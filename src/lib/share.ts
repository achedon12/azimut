import { closeness, type Compass } from './geo';

/** La flèche de chaque secteur, pour le texte partagé. */
const ARROWS: Record<Compass, string> = {
    n: '⬆️', ne: '↗️', e: '➡️', se: '↘️', s: '⬇️', sw: '↙️', w: '⬅️', nw: '↖️',
};

const BULLSEYE = '🎯';

/**
 * Les cinq carrés de proximité d'un essai.
 *
 * C'est ce bloc qui circule sur les réseaux, et c'est lui qui amène des
 * joueurs : il doit se lire d'un coup d'œil sans rien dévoiler du pays. D'où
 * des carrés de couleur plutôt que des chiffres — un « 8 200 km » désignerait
 * un continent.
 */
function bar(km: number): string {
    const filled = Math.round((closeness(km) / 100) * 5);
    return '🟩'.repeat(filled) + '⬜'.repeat(5 - filled);
}

export type ShareLine = { km: number; direction: Compass; correct: boolean };

export function shareText({
    title,
    puzzle,
    lines,
    maxGuesses,
    url,
    won,
    streak = 0,
}: {
    title: string;
    puzzle: string;
    lines: ShareLine[];
    maxGuesses: number;
    url: string;
    won: boolean;
    /** Série en cours. Omise à zéro : « 🔥 0 » se lit comme un échec. */
    streak?: number;
}): string {
    const score = won ? `${lines.length}/${maxGuesses}` : `X/${maxGuesses}`;
    const flame = streak > 1 ? ` 🔥${streak}` : '';
    const grid = lines
        .map((l) => `${bar(l.km)} ${l.correct ? BULLSEYE : ARROWS[l.direction]}`)
        .join('\n');
    return `${title} ${puzzle} ${score}${flame}\n\n${grid}\n\n${url}`;
}
