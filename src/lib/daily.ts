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

/**
 * Premier jour de jeu. Origine du numéro de partie, et borne basse des
 * archives : rien avant cette date n'est jouable.
 *
 * ⚠️ La déplacer change le pays de CHAQUE jour, archives comprises. Elle est
 * figée une fois pour toutes à la mise en ligne.
 */
export const EPOCH = '2026-08-20';

export function puzzleNumber(key: string): number {
    const day = 86_400_000;
    return Math.max(1, Math.round((Date.parse(key) - Date.parse(EPOCH)) / day) + 1);
}

/**
 * Un jour jouable : au format attendu, pas avant l'origine, pas dans l'avenir.
 *
 * ⚠️ La borne haute n'est pas cosmétique. Sans elle, `?d=2030-01-01` révélerait
 * le pays d'un jour à venir, et le score partagé du jour ne voudrait plus rien
 * dire.
 */
export function isPlayableDay(key: string, today: string = dayKey()): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
    // ⚠️ Le motif ne suffit pas : « 2026-13-01 » et « 2026-02-30 » le passent
    // et donnent une date invalide, sur laquelle `dayKey` lève. On repasse par
    // le calendrier, qui rejette aussi les 31 février.
    const date = new Date(`${key}T12:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== key) return false;
    return key >= EPOCH && key <= today;
}

/** Tous les jours jouables, du plus récent au plus ancien. */
export function playableDays(today: string = dayKey()): string[] {
    const days: string[] = [];
    for (let key = today; key >= EPOCH; key = previousDay(key)) days.push(key);
    return days;
}

/**
 * La date telle qu'on l'écrit dans la langue du visiteur.
 *
 * Midi UTC comme point d'ancrage : à minuit, le fuseau de la machine ferait
 * afficher la veille à un visiteur situé à l'ouest.
 */
export function formatDay(
    key: string,
    locale: string,
    options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
        new Date(`${key}T12:00:00Z`),
    );
}

/**
 * Mélange déterministe des pays, pour un cycle donné.
 *
 * Une permutation complète plutôt qu'un tirage : aucun pays ne revient avant
 * que tous soient passés, là où un `hash % 175` rejouerait le même pays deux
 * fois dans la semaine.
 *
 * ⚠️ La graine dépend du NUMÉRO DE CYCLE, et c'est ce qui évite que la suite
 * recommence à l'identique tous les 175 jours. Avec une graine fixe, le jour
 * 176 redonnait le pays du jour 1 et tout l'ordre se répétait — invisible tant
 * qu'on ne jouait que le jour même, flagrant depuis que les archives
 * s'ouvrent.
 *
 * Rien de tout ceci n'est stocké : à date égale, le calcul redonne le même
 * pays sur toutes les machines et pour toujours. C'est `scripts/check-schedule`
 * qui le VÉRIFIE, contre des couples date → pays figés.
 */
function shuffled(cycle: number): Country[] {
    // `|| 1` : un xorshift dont la graine vaut zéro reste bloqué sur zéro.
    let seed = ((0x9e3779b9 ^ Math.imul(cycle, 0x85ebca6b)) >>> 0) || 1;
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

// Un cycle entier est calculé d'un coup, puis gardé : la page d'archives
// demande des centaines de jours, presque tous dans le même cycle.
const cycles = new Map<number, Country[]>();

function order(cycle: number): Country[] {
    let list = cycles.get(cycle);
    if (!list) {
        list = shuffled(cycle);
        cycles.set(cycle, list);
    }
    return list;
}

export function countryOfDay(key: string = dayKey()): Country {
    const index = puzzleNumber(key) - 1;
    const size = COUNTRIES.length;
    return order(Math.floor(index / size))[index % size]!;
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
