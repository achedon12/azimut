import type { Dictionary } from '@/i18n';
import { MAX_GUESSES } from '@/lib/daily';
import type { Stats } from '@/lib/stats';

function Figure({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            <span className="numeric text-xl leading-none font-semibold">{value}</span>
            <span className="label text-[0.6rem] text-fg-muted">{label}</span>
        </div>
    );
}

/**
 * Le tableau de bord de fin de partie : c'est lui qui donne au jeu une mémoire
 * d'un jour sur l'autre — une série à ne pas casser, un score à battre.
 */
export function StatsPanel({
    stats,
    dictionary,
    /** Nombre d'essais de la partie qui vient de se terminer, pour la mettre
     *  en avant dans la répartition. */
    highlight,
}: {
    stats: Stats;
    dictionary: Dictionary;
    highlight: number | null;
}) {
    const d = dictionary.stats;
    const rate = stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100);
    // La barre la plus longue sert d'échelle. Le plancher à 1 évite une
    // division par zéro sur une première partie perdue.
    const peak = Math.max(1, ...stats.distribution);

    return (
        <section aria-label={d.title} className="flex w-full flex-col gap-3">
            <div className="grid grid-cols-4 gap-2">
                <Figure value={String(stats.played)} label={d.played} />
                <Figure value={`${rate}%`} label={d.winRate} />
                <Figure value={String(stats.streak)} label={d.streak} />
                <Figure value={String(stats.maxStreak)} label={d.maxStreak} />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="label text-[0.6rem] text-fg-muted">{d.distribution}</h3>
                {Array.from({ length: MAX_GUESSES }, (_, i) => {
                    const count = stats.distribution[i] ?? 0;
                    const mine = highlight === i + 1;
                    return (
                        <div key={i} className="flex items-center gap-2">
                            <span className="numeric w-3 text-[0.7rem] text-fg-muted">{i + 1}</span>
                            <div className="h-4 flex-1 overflow-hidden rounded-sm bg-bg-sunken">
                                <div
                                    className="flex h-full items-center justify-end rounded-sm px-1.5"
                                    style={{
                                        // Un minimum visible même à zéro : une
                                        // barre absente se lit comme un bug
                                        // d'affichage, pas comme un zéro.
                                        width: `${Math.max(8, (count / peak) * 100)}%`,
                                        background: mine ? 'var(--win)' : 'var(--accent)',
                                        opacity: count === 0 ? 0.25 : 1,
                                    }}
                                >
                                    <span
                                        className="numeric text-[0.65rem] font-medium"
                                        style={{ color: 'var(--accent-contrast)' }}
                                    >
                                        {count}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
