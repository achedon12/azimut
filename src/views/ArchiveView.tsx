'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { path } from '@/i18n/routes';
import { MAX_GUESSES, countryOfDay, formatDay, playableDays } from '@/lib/daily';
import { DAY_PARAM, getServerSnapshot, getSnapshot, guessesFor, subscribe } from '@/lib/gameStore';

type Status = 'won' | 'lost' | 'playing' | 'new';

function statusOf(day: string): { status: Status; tries: number } {
    const guesses = guessesFor(day);
    if (guesses.length === 0) return { status: 'new', tries: 0 };
    const target = countryOfDay(day).code;
    if (guesses.includes(target)) return { status: 'won', tries: guesses.indexOf(target) + 1 };
    return { status: guesses.length >= MAX_GUESSES ? 'lost' : 'playing', tries: guesses.length };
}

const TONE: Record<Status, string> = {
    won: 'border-transparent text-accent-contrast',
    lost: 'border-border-strong text-fg-muted',
    playing: 'border-accent text-accent',
    new: 'border-border text-fg',
};

/**
 * La liste des jours jouables, du plus récent au plus ancien.
 *
 * Groupée par mois : à trois cents jours, une colonne continue de dates ne se
 * parcourt plus. Les jours sont des LIENS vers `/?d=…`, pas des boutons —
 * une partie passée se met en favori et se partage.
 */
export function ArchiveView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    // Le jour d'aujourd'hui dépend du fuseau : il n'existe qu'après hydratation.
    // Tant qu'il est vide, la liste ne peut pas être calculée.
    const { day: today } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!today) {
        return (
            <div className="mx-auto w-full max-w-md px-5 py-8">
                <h1 className="text-xl font-semibold tracking-tight">{d.archives.title}</h1>
                <p className="mt-2 text-[0.9rem] text-fg-muted">{d.archives.lede}</p>
            </div>
        );
    }

    const days = playableDays(today);
    const done = days.filter((day) => statusOf(day).status !== 'new').length;

    // Regroupement par mois, en gardant l'ordre décroissant des jours.
    const months: { label: string; days: string[] }[] = [];
    for (const day of days) {
        const label = formatDay(day, locale, { month: 'long', year: 'numeric' });
        const last = months.at(-1);
        if (last && last.label === label) last.days.push(day);
        else months.push({ label, days: [day] });
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{d.archives.title}</h1>
                <p className="text-[0.9rem] text-fg-muted">{d.archives.lede}</p>
                <p className="numeric text-[0.8rem] text-accent">
                    {format(d.archives.countPlayed, { done, total: days.length })}
                </p>
            </header>

            {months.map((month) => (
                <section key={month.label} className="flex flex-col gap-2">
                    <h2 className="label text-[0.6rem] text-fg-muted">{month.label}</h2>
                    <ul className="flex flex-col gap-1">
                        {month.days.map((day) => {
                            const { status, tries } = statusOf(day);
                            const label =
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
                                <li key={day}>
                                    <Link
                                        href={`${path('home', locale)}?${DAY_PARAM}=${day}`}
                                        className="flex h-11 items-center justify-between gap-3 rounded-md border border-border-subtle px-3 no-underline transition-colors hover:border-accent"
                                    >
                                        <span className="flex items-baseline gap-2">
                                            <span className="numeric text-[0.95rem]">
                                                {formatDay(day, locale, { day: 'numeric', month: 'short' })}
                                            </span>
                                            {day === today && (
                                                <span className="label text-[0.6rem] text-accent">
                                                    {d.archives.today}
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[0.7rem] ${TONE[status]}`}
                                            style={
                                                status === 'won'
                                                    ? { background: 'var(--win)', color: 'var(--accent-contrast)' }
                                                    : undefined
                                            }
                                        >
                                            {label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            <p className="text-[0.75rem] leading-relaxed text-fg-muted">{d.archives.note}</p>
        </div>
    );
}
