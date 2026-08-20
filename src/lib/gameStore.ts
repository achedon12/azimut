import { MAX_GUESSES, countryOfDay, dayKey, isPlayableDay } from './daily';
import { recordResult } from './statsStore';
import { loadAll, saveAll, type Saved } from './storage';

/** Le jour affiché est porté par l'URL : une partie d'archive se met en favori
 *  et se partage comme n'importe quelle page. */
export const DAY_PARAM = 'd';

export type GameState = {
    /** Le jour affiché. Vide tant que le navigateur n'a pas pris la main. */
    day: string;
    guesses: readonly string[];
    /** Faux quand on rejoue une archive : les statistiques n'en tiennent pas
     *  compte, et l'écran le dit. */
    isToday: boolean;
};

/**
 * L'état de la partie, tenu HORS de React.
 *
 * `useSyncExternalStore` le lit là où il est, plutôt que de le recopier dans un
 * `useState` depuis un effet. C'est aussi ce qui rend l'hydratation correcte :
 * React se sert de l'instantané SERVEUR pour le premier rendu — aucun essai,
 * comme dans le HTML livré — puis rebascule sur l'état réel.
 */
const listeners = new Set<() => void>();

// ⚠️ L'instantané doit garder la MÊME référence tant que rien ne change :
// renvoyer un objet neuf à chaque appel ferait boucler React indéfiniment.
let cache: GameState | null = null;
let games: Saved | null = null;

const SERVER: GameState = { day: '', guesses: [], isToday: true };

/** Le jour demandé par l'URL, s'il est jouable. Sinon celui d'aujourd'hui. */
function requestedDay(): string {
    const today = dayKey();
    if (typeof window === 'undefined') return today;
    const asked = new URLSearchParams(window.location.search).get(DAY_PARAM);
    // Une date à venir ou mal formée retombe sur aujourd'hui plutôt que de
    // donner une page d'erreur : le jeu reste jouable quoi qu'on tape.
    return asked && isPlayableDay(asked, today) ? asked : today;
}

function current(): GameState {
    const day = requestedDay();
    if (!games) games = loadAll();
    if (!cache || cache.day !== day) {
        cache = { day, guesses: games[day] ?? [], isToday: day === dayKey() };
    }
    return cache;
}

function notify(): void {
    for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    // L'événement `storage` ne se déclenche que dans les AUTRES onglets : deux
    // parties ouvertes côte à côte restent ainsi d'accord.
    const onStorage = () => {
        games = null;
        cache = null;
        listener();
    };
    // Le bouton « précédent » change le jour sans recharger la page.
    const onPop = () => {
        cache = null;
        listener();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('popstate', onPop);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('popstate', onPop);
    };
}

export function getSnapshot(): GameState {
    return current();
}

export function getServerSnapshot(): GameState {
    return SERVER;
}

/** Les essais d'un jour donné, pour la page d'archives. */
export function guessesFor(day: string): readonly string[] {
    if (!games) games = loadAll();
    return games[day] ?? [];
}

/**
 * Change le jour affiché sans recharger la page.
 *
 * `pushState` plutôt qu'une navigation : l'état du jeu vit en mémoire, et un
 * rechargement complet le relirait du stockage pour rien. Le bouton
 * « précédent » continue de fonctionner, via l'écouteur `popstate`.
 */
export function selectDay(day: string): void {
    const today = dayKey();
    if (!isPlayableDay(day, today)) return;
    const url = new URL(window.location.href);
    if (day === today) url.searchParams.delete(DAY_PARAM);
    else url.searchParams.set(DAY_PARAM, day);
    window.history.pushState(null, '', url);
    cache = null;
    notify();
}

/** `duplicate` permet à la saisie de le DIRE. Refuser en silence laissait
 *  croire à un bouton cassé. */
export type GuessResult = 'ok' | 'duplicate';

export function addGuess(code: string): GuessResult {
    const state = current();
    if (state.guesses.includes(code)) return 'duplicate';
    const guesses = [...state.guesses, code];
    cache = { ...state, guesses };
    if (!games) games = loadAll();
    games = { ...games, [state.day]: guesses };
    saveAll(games);

    // La partie se comptabilise ICI, au moment où elle se termine, et non
    // pendant un rendu : un enregistrement fait à l'affichage se rejouerait à
    // chaque montage du composant.
    //
    // ⚠️ Les archives ne comptent PAS. Une série qu'on peut rattraper en
    // rejouant les jours manqués ne mesure plus l'assiduité, et le record
    // deviendrait une simple mesure de patience.
    const won = code === countryOfDay(state.day).code;
    if (state.isToday && (won || guesses.length >= MAX_GUESSES)) {
        recordResult(state.day, won, guesses.length);
    }

    notify();
    return 'ok';
}
