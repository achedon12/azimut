'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { path } from '@/i18n/routes';
import { buildMonthGrid, shiftMonth, weekdayNames } from '@/lib/calendar';
import { EPOCH, MAX_GUESSES, countryOfDay, formatDay, playableDays } from '@/lib/daily';
import { DAY_PARAM, getServerSnapshot, getSnapshot, guessesFor, subscribe } from '@/lib/gameStore';

type Status = 'won' | 'lost' | 'playing' | 'new';

function statusOf(day: string): { status: Status; tries: number } {
    const guesses = guessesFor(day);
    if (guesses.length === 0) return { status: 'new', tries: 0 };
    const target = countryOfDay(day).code;
    if (guesses.includes(target)) return { status: 'won', tries: guesses.indexOf(target) + 1 };
    return { status: guesses.length >= MAX_GUESSES ? 'lost' : 'playing', tries: guesses.length };
}

/** Chaque état a sa couleur ET sa forme : un joueur daltonien distingue le
 *  rempli du contour, là où deux teintes seules se confondent. */
const CELL: Record<Status, string> = {
    won: 'border-transparent font-semibold',
    lost: 'border-border-strong bg-bg-sunken text-fg-muted',
    playing: 'border-accent text-accent',
    new: 'border-border-subtle hover:border-accent',
};

function Swatch({ status, label }: { status: Status; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span
                className={`size-3 rounded border ${CELL[status]}`}
                style={status === 'won' ? { background: 'var(--win)' } : undefined}
            />
            {label}
        </span>
    );
}

function Step({
    onSelect,
    label,
    icon: Icon,
}: {
    /** `null` quand le mois visé sort des bornes. */
    onSelect: (() => void) | null;
    label: string;
    icon: typeof ChevronLeft;
}) {
    const shape = 'flex size-8 items-center justify-center rounded-md border border-border-subtle';
    // Hors bornes : un bouton DÉSACTIVÉ plutôt qu'absent, sinon les quatre
    // commandes se déplacent d'un mois à l'autre sous le doigt.
    return (
        <button
            type="button"
            disabled={onSelect === null}
            onClick={onSelect ?? undefined}
            aria-label={label}
            className={`${shape} text-fg-muted transition-colors enabled:hover:border-accent enabled:hover:text-fg disabled:text-fg-muted/30`}
        >
            <Icon aria-hidden="true" className="size-4" />
        </button>
    );
}

/**
 * Le calendrier des parties passées.
 *
 * Une grille mensuelle et non une liste : c'est ce qui permet d'aller à une
 * date précise. Chaque case est un LIEN vers `/?d=…` — une partie passée se met
 * en favori et se partage.
 */
export function ArchiveView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    // Le jour d'aujourd'hui dépend du fuseau : il n'existe qu'après hydratation.
    const { day: today } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [month, setMonth] = useState<string | null>(null);

    if (!today) {
        return (
            <div className="mx-auto w-full max-w-md px-5 py-8">
                <h1 className="text-xl font-semibold tracking-tight">{d.archives.title}</h1>
                <p className="mt-2 text-[0.9rem] text-fg-muted">{d.archives.lede}</p>
            </div>
        );
    }

    const shown = month ?? today.slice(0, 7);
    const firstMonth = EPOCH.slice(0, 7);
    const currentMonth = today.slice(0, 7);
    const { firstWeekday, days } = buildMonthGrid(shown);

    const all = playableDays(today);
    const done = all.filter((day) => statusOf(day).status !== 'new').length;

    const stepTo = (delta: number): string | null => {
        const target = shiftMonth(shown, delta);
        return target < firstMonth || target > currentMonth ? null : target;
    };

    const steps = [
        { delta: -12, icon: ChevronsLeft, label: d.archives.prevYear },
        { delta: -1, icon: ChevronLeft, label: d.archives.prevMonth },
    ];
    const stepsAfter = [
        { delta: 1, icon: ChevronRight, label: d.archives.nextMonth },
        { delta: 12, icon: ChevronsRight, label: d.archives.nextYear },
    ];

    const monthLabel = formatDay(`${shown}-01`, locale, { month: 'long', year: 'numeric' });

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{d.archives.title}</h1>
                <p className="text-[0.9rem] text-fg-muted">{d.archives.lede}</p>
                <p className="numeric text-[0.8rem] text-accent">
                    {format(d.archives.countPlayed, { done, total: all.length })}
                </p>
            </header>

            <section className="flex flex-col gap-3 rounded-md border border-border-subtle p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                        {steps.map(({ delta, icon, label }) => {
                            const target = stepTo(delta);
                            return (
                                <Step
                                    key={delta}
                                    onSelect={target ? () => setMonth(target) : null}
                                    label={label}
                                    icon={icon}
                                />
                            );
                        })}
                    </div>
                    <p className="label text-[0.65rem] text-fg">{monthLabel}</p>
                    <div className="flex items-center gap-1">
                        {stepsAfter.map(({ delta, icon, label }) => {
                            const target = stepTo(delta);
                            return (
                                <Step
                                    key={delta}
                                    onSelect={target ? () => setMonth(target) : null}
                                    label={label}
                                    icon={icon}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {weekdayNames(locale).map((name) => (
                        <span key={name} className="label pb-1 text-center text-[0.55rem] text-fg-muted">
                            {name.slice(0, 2)}
                        </span>
                    ))}

                    {Array.from({ length: firstWeekday }, (_, i) => (
                        <span key={`vide-${i}`} aria-hidden="true" />
                    ))}

                    {days.map((day) => {
                        const playable = day >= EPOCH && day <= today;
                        const number = Number(day.slice(8));
                        if (!playable) {
                            return (
                                <span
                                    key={day}
                                    aria-hidden="true"
                                    className="numeric flex aspect-square items-center justify-center rounded-md text-[0.8rem] text-fg-muted/25"
                                >
                                    {number}
                                </span>
                            );
                        }
                        const { status, tries } = statusOf(day);
                        const title =
                            status === 'won'
                                ? tries === 1
                                    ? d.archives.statusWonOne
                                    : format(d.archives.statusWon, { count: tries })
                                : status === 'lost'
                                  ? d.archives.statusLost
                                  : status === 'playing'
                                    ? d.archives.statusPlaying
                                    : d.archives.statusNew;
                        return (
                            <Link
                                key={day}
                                href={`${path('home', locale)}?${DAY_PARAM}=${day}`}
                                aria-current={day === today ? 'date' : undefined}
                                className={`numeric flex aspect-square items-center justify-center rounded-md border text-[0.8rem] no-underline transition-colors aria-[current=date]:ring-1 aria-[current=date]:ring-accent ${CELL[status]}`}
                                style={
                                    status === 'won'
                                        ? { background: 'var(--win)', color: 'var(--accent-contrast)' }
                                        : undefined
                                }
                            >
                                {number}
                                <span className="sr-only">
                                    {` — ${formatDay(day, locale)} : ${title}`}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-fg-muted">
                    <Swatch status="won" label={d.archives.legendWon} />
                    <Swatch status="lost" label={d.archives.legendLost} />
                    <Swatch status="playing" label={d.archives.legendPlaying} />
                    <Swatch status="new" label={d.archives.legendNew} />
                </div>
            </section>

            <p className="text-[0.75rem] leading-relaxed text-fg-muted">{d.archives.note}</p>
        </div>
    );
}
