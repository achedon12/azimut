'use client';

import { useSyncExternalStore } from 'react';
import { format } from '@/i18n/format';
import { getClock, getClockServerSnapshot, subscribeClock } from '@/lib/clock';
import { nextPuzzleAt } from '@/lib/daily';

// L'échéance ne change qu'une fois par jour : la recalculer à chaque seconde
// reconstruirait un `Intl.DateTimeFormat` soixante fois par minute pour rien.
let deadline = 0;
function nextAt(now: number): number {
    if (now >= deadline) deadline = nextPuzzleAt(new Date(now));
    return deadline;
}

function clock(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
}

/** Le temps restant avant la partie suivante — la seule raison de revenir
 *  demain, donc la dernière chose que lit un joueur qui vient de finir. */
export function Countdown({ template }: { template: string }) {
    const now = useSyncExternalStore(subscribeClock, getClock, getClockServerSnapshot);

    // Zéro = rendu serveur ou hydratation en cours. Un gabarit plutôt qu'une
    // heure fausse, et il occupe déjà la place définitive.
    const time = now === 0 ? '--:--:--' : clock(nextAt(now) - now);

    return (
        <p className="text-[0.8rem] text-fg-muted">
            {format(template, { time })}
        </p>
    );
}
