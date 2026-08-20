import { MAX_GUESSES, previousDay } from './daily';

const KEY = 'azimut:stats';

export type Stats = {
    played: number;
    wins: number;
    /** Série en cours. Une défaite la remet à zéro, un jour sauté aussi. */
    streak: number;
    maxStreak: number;
    /** Victoires par nombre d'essais : l'index 0 compte celles du premier coup. */
    distribution: readonly number[];
    /** Dernier jour comptabilisé. C'est lui qui rend l'enregistrement idempotent. */
    lastDay: string;
};

export const EMPTY: Stats = {
    played: 0,
    wins: 0,
    streak: 0,
    maxStreak: 0,
    distribution: Array.from({ length: MAX_GUESSES }, () => 0),
    lastDay: '',
};

function sane(value: unknown): Stats {
    if (typeof value !== 'object' || value === null) return EMPTY;
    const raw = value as Partial<Stats>;
    const distribution = Array.from(
        { length: MAX_GUESSES },
        (_, i) => Number(raw.distribution?.[i]) || 0,
    );
    return {
        played: Number(raw.played) || 0,
        wins: Number(raw.wins) || 0,
        streak: Number(raw.streak) || 0,
        maxStreak: Number(raw.maxStreak) || 0,
        distribution,
        lastDay: typeof raw.lastDay === 'string' ? raw.lastDay : '',
    };
}

export function loadStats(): Stats {
    try {
        const raw = localStorage.getItem(KEY);
        // `sane` plutôt qu'un cast : ces chiffres viennent du stockage, que
        // l'utilisateur peut éditer et qu'une version plus ancienne du jeu a pu
        // écrire. Un NaN dedans afficherait « NaN % » à l'écran.
        return raw ? sane(JSON.parse(raw)) : EMPTY;
    } catch {
        return EMPTY;
    }
}

export function saveStats(stats: Stats): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(stats));
    } catch {
        // Stockage refusé : on joue sans historique, ce qui reste jouable.
    }
}

/**
 * La partie du jour, ajoutée au compteur.
 *
 * Idempotent : rappelé le même jour, il rend les statistiques inchangées. Sans
 * cette garantie, un simple rechargement de page gonflerait le total.
 */
export function record(stats: Stats, day: string, won: boolean, tries: number): Stats {
    if (stats.lastDay === day) return stats;

    const consecutive = stats.lastDay === previousDay(day);
    const streak = won ? (consecutive ? stats.streak : 0) + 1 : 0;
    const distribution = stats.distribution.map((n, i) =>
        won && i === tries - 1 ? n + 1 : n,
    );

    return {
        played: stats.played + 1,
        wins: stats.wins + (won ? 1 : 0),
        streak,
        maxStreak: Math.max(stats.maxStreak, streak),
        distribution,
        lastDay: day,
    };
}
