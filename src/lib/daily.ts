import { COUNTRIES, type Country } from '@/data/countries';

/**
 * Le jour de jeu, figé sur Europe/Paris.
 *
 * ⚠️ Sans fuseau imposé, deux joueurs séparés par une frontière horaire
 * n'auraient pas la même partie au même moment, et le score partagé ne voudrait
 * plus rien dire. C'est le même choix que sur Push Your Luck.
 */
export function dayKey(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('fr-CA', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}

/** Premier jour de jeu. Sert d'origine au numéro de partie. */
export const EPOCH = '2026-08-21';

export function puzzleNumber(key: string): number {
    const day = 86_400_000;
    return Math.max(1, Math.round((Date.parse(key) - Date.parse(EPOCH)) / day) + 1);
}

/**
 * Mélange déterministe des pays.
 *
 * Une permutation complète plutôt qu'un tirage : aucun pays ne revient avant
 * que tous soient passés, là où un `hash % 175` rejouerait le même pays deux
 * fois dans la semaine.
 *
 * Le mélange ne dépend pas du jour : la suite est calculée une fois, et chaque
 * jour y lit sa position.
 */
function shuffled(): Country[] {
    let seed = 0x9e3779b9;
    const random = () => {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return ((seed >>> 0) % 1_000_000) / 1_000_000;
    };

    const list = [...COUNTRIES];
    for (let i = list.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
}

const ORDER = shuffled();

export function countryOfDay(key: string = dayKey()): Country {
    return ORDER[(puzzleNumber(key) - 1) % ORDER.length]!;
}

export const MAX_GUESSES = 6;

/**
 * L'instant de la prochaine partie, en millisecondes.
 *
 * ⚠️ Deux jours par an ne durent pas 24 h. L'estimation par « 86 400 moins le
 * temps écoulé » vise alors une heure trop tôt ou trop tard, d'où le recalage :
 * on cherche la PREMIÈRE seconde qui n'appartient plus à aujourd'hui.
 */
export function nextPuzzleAt(now: Date = new Date()): number {
    const today = dayKey(now);
    const parts = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(now);
    const at = (type: string) => Number(parts.find((p) => p.type === type)!.value);
    const elapsed = at('hour') * 3600 + at('minute') * 60 + at('second');

    let ms = now.getTime() + (86_400 - elapsed) * 1000;
    while (dayKey(new Date(ms - 1000)) !== today) ms -= 3_600_000;
    while (dayKey(new Date(ms)) === today) ms += 3_600_000;
    return ms;
}

/** Le jour de jeu précédent — sert à savoir si une série se poursuit. */
export function previousDay(day: string): string {
    // Midi UTC : une heure proche de minuit ferait dépendre le résultat du
    // fuseau de la machine.
    const date = new Date(`${day}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
}
