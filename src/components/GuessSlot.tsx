import { Crosshair } from 'lucide-react';
import type { Compass } from '@/lib/geo';
import type { Dictionary } from '@/i18n';

const ANGLE: Record<Compass, number> = { n: 0, ne: 45, e: 90, se: 135, s: 180, sw: 225, w: 270, nw: 315 };

/** Cinq paliers : en dessous les sauts se voient, au-dessus deux essais
 *  voisins deviennent indiscernables. */
function step(closeness: number): string {
    if (closeness >= 90) return 'var(--step-5)';
    if (closeness >= 70) return 'var(--step-4)';
    if (closeness >= 45) return 'var(--step-3)';
    if (closeness >= 20) return 'var(--step-2)';
    return 'var(--step-1)';
}

export type Filled = {
    name: string;
    km: number;
    direction: Compass;
    closeness: number;
    correct: boolean;
};

/**
 * Une case d'essai — remplie ou en attente.
 *
 * Les six sont affichées DÈS LE DÉPART : la tâche est visible d'un coup d'œil,
 * et la hauteur de la page ne change jamais.
 */
export function GuessSlot({
    index,
    filled,
    next,
    locale,
    dictionary,
}: {
    index: number;
    filled?: Filled;
    /** La case qu'on s'apprête à remplir : elle s'annonce. */
    next: boolean;
    locale: string;
    dictionary: Dictionary;
}) {
    // Une case vide est une GRADUATION, pas une boîte : six rectangles bordés
    // pèseraient plus lourd que le cadran sans rien dire de plus.
    if (!filled) {
        return (
            <li className="flex h-10 items-center gap-3 px-3">
                <span className={`numeric text-xs ${next ? 'text-accent' : 'text-fg-muted'}`}>
                    {index + 1}
                </span>
                {next ? (
                    <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-accent/50 to-transparent" />
                ) : (
                    <span aria-hidden="true" className="h-px flex-1 bg-border-strong/70" />
                )}
            </li>
        );
    }

    const color = filled.correct ? 'var(--win)' : step(filled.closeness);

    return (
        <li
            className="flex h-10 items-center gap-3 overflow-hidden rounded-md border px-3"
            style={{
                borderColor: filled.correct ? 'var(--win)' : 'var(--border)',
                background: filled.correct ? 'var(--win-soft)' : 'var(--bg-elevated)',
            }}
        >
            <span className="numeric text-xs text-fg-muted">{index + 1}</span>
            <span className="min-w-0 flex-1 truncate text-[0.95rem]">{filled.name}</span>

            {/* `Intl` formate les milliers selon la langue : un séparateur
                figé serait faux dans trois langues sur quatre. */}
            <span className="numeric shrink-0 text-sm text-fg-muted">
                {new Intl.NumberFormat(locale).format(filled.km)} km
            </span>

            {filled.correct ? (
                <Crosshair aria-hidden="true" className="size-4 shrink-0" style={{ color }} />
            ) : (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-4 shrink-0"
                    style={{ transform: `rotate(${ANGLE[filled.direction]}deg)`, color }}
                >
                    <path d="M8 1l4 13-4-3.4L4 14Z" fill="currentColor" />
                </svg>
            )}

            <span className="numeric w-11 shrink-0 text-right text-sm font-medium" style={{ color }}>
                {filled.closeness}%
            </span>

            <span className="sr-only">
                {filled.correct
                    ? dictionary.game.bullseye
                    : `${dictionary.game.direction} : ${dictionary.compass[filled.direction]}`}
            </span>
        </li>
    );
}
