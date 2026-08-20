import { MAX_GUESSES, countryOfDay, dayKey } from './daily';
import { recordResult } from './statsStore';
import { load, save } from './storage';

export type GameState = { day: string; guesses: readonly string[] };

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

const SERVER: GameState = { day: '', guesses: [] };

function current(): GameState {
    const day = dayKey();
    if (!cache || cache.day !== day) cache = { day, guesses: load(day) };
    return cache;
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    // L'événement `storage` ne se déclenche que dans les AUTRES onglets : deux
    // parties ouvertes côte à côte restent ainsi d'accord.
    const onStorage = () => {
        cache = null;
        listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
}

export function getSnapshot(): GameState {
    return current();
}

export function getServerSnapshot(): GameState {
    return SERVER;
}

/** `duplicate` permet à la saisie de le DIRE. Refuser en silence laissait
 *  croire à un bouton cassé. */
export type GuessResult = 'ok' | 'duplicate';

export function addGuess(code: string): GuessResult {
    const state = current();
    if (state.guesses.includes(code)) return 'duplicate';
    const guesses = [...state.guesses, code];
    cache = { day: state.day, guesses };
    save(state.day, guesses);

    // La partie se comptabilise ICI, au moment où elle se termine, et non
    // pendant un rendu : un enregistrement fait à l'affichage se rejouerait à
    // chaque montage du composant.
    const won = code === countryOfDay(state.day).code;
    if (won || guesses.length >= MAX_GUESSES) {
        recordResult(state.day, won, guesses.length);
    }

    for (const listener of listeners) listener();
    return 'ok';
}
