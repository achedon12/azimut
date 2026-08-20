'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { Check, Lightbulb, Share2 } from 'lucide-react';
import Link from 'next/link';
import { CalendarClock, RotateCcw } from 'lucide-react';
import { Countdown } from '@/components/Countdown';
import { CountryCard } from '@/components/CountryCard';
import { GuessInput } from '@/components/GuessInput';
import { GuessSlot } from '@/components/GuessSlot';
import { Radar, type Blip } from '@/components/Radar';
import { StatsPanel } from '@/components/StatsPanel';
import { COUNTRIES } from '@/data/countries';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { path } from '@/i18n/routes';
import { MAX_GUESSES, countryOfDay, dayKey, formatDay } from '@/lib/daily';
import { bearing, closeness, distanceKm, sector } from '@/lib/geo';
import { addGuess, getServerSnapshot, getSnapshot, selectDay, subscribe } from '@/lib/gameStore';
import { getStatsServerSnapshot, getStatsSnapshot, subscribeStats } from '@/lib/statsStore';
import { shareText } from '@/lib/share';
import { SITE_URL } from '@/lib/site';

export function GameView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    // L'état vit hors de React — voir `lib/gameStore`.
    const { day, guesses, isToday } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const stats = useSyncExternalStore(subscribeStats, getStatsSnapshot, getStatsServerSnapshot);
    const [copied, setCopied] = useState(false);
    // Le JOUR pour lequel l'indice a été demandé : sans lui, l'indice resterait
    // affiché en passant à une autre partie depuis le calendrier.
    const [hintFor, setHintFor] = useState<string | null>(null);

    const target = useMemo(() => (day ? countryOfDay(day) : null), [day]);

    const rows = useMemo(() => {
        if (!target) return [];
        return guesses.map((code) => {
            const country = COUNTRIES.find((c) => c.code === code)!;
            const km = distanceKm(country.center, target.center);
            const deg = bearing(country.center, target.center);
            return {
                country,
                km,
                deg,
                direction: sector(deg),
                closeness: closeness(km),
                correct: country.code === target.code,
            };
        });
    }, [guesses, target]);

    const won = rows.some((r) => r.correct);
    const over = won || guesses.length >= MAX_GUESSES;
    const remaining = MAX_GUESSES - guesses.length;

    const blips: Blip[] = rows.map((r) => ({
        code: r.country.code,
        name: r.country.names[locale],
        km: r.km,
        bearing: r.deg,
        closeness: r.closeness,
        correct: r.correct,
    }));

    async function copy() {
        if (!day) return;
        try {
            await navigator.clipboard.writeText(
                shareText({
                    title: d.meta.title,
                    puzzle: formatDay(day, locale),
                    lines: rows.map((r) => ({ km: r.km, direction: r.direction, correct: r.correct })),
                    maxGuesses: MAX_GUESSES,
                    url: SITE_URL,
                    won,
                    streak: stats.streak,
                }),
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Presse-papiers refusé : le bouton ne fait rien plutôt que de
            // mentir en affichant « copié ».
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-3.5 px-5 py-4">
            {/* Bandeau d'archive. Au-dessus du cadran et non en bas : sans lui,
                rien ne distingue une partie d'un autre jour de celle du jour,
                et un joueur croirait avoir déjà trouvé la réponse du jour. */}
            {day && !isToday && (
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md border border-accent/40 bg-bg-elevated px-3 py-2">
                    <span className="flex items-center gap-2 text-[0.8rem]">
                        <CalendarClock aria-hidden="true" className="size-4 text-accent" />
                        {format(d.game.archiveNotice, { date: formatDay(day, locale) })}
                    </span>
                    <button
                        type="button"
                        onClick={() => selectDay(dayKey())}
                        className="label inline-flex items-center gap-1.5 text-accent"
                    >
                        <RotateCcw aria-hidden="true" className="size-3.5" />
                        {d.game.backToToday}
                    </button>
                </div>
            )}

            {/* Le cadran EST la page, pas une illustration posée dessus. */}
            <div className="relative mx-auto aspect-square w-full max-w-[19rem]">
                {target && (
                    <Radar
                        path={target.path}
                        blips={blips}
                        labels={{
                            n: d.compass.n.slice(0, 1).toUpperCase(),
                            e: d.compass.e.slice(0, 1).toUpperCase(),
                            s: d.compass.s.slice(0, 1).toUpperCase(),
                            w: d.compass.w.slice(0, 1).toUpperCase(),
                        }}
                    />
                )}
            </div>

            <div className="flex flex-col gap-1 text-center">
                <h1 className="text-xl font-semibold tracking-tight">{d.game.prompt}</h1>
                {/* La règle en une phrase, tant que rien n'a été proposé : sans
                    elle un nouvel arrivant ne peut pas deviner ce que produit
                    un essai. Le premier essai la démontre mieux qu'un texte. */}
                {guesses.length === 0 && (
                    <p className="text-[0.8rem] text-fg-muted">{d.game.hint}</p>
                )}
            </div>

            {!over ? (
                <div className="flex flex-col gap-2">
                    <GuessInput
                        countries={COUNTRIES}
                        locale={locale}
                        dictionary={d}
                        disabled={!day}
                        onGuess={(code) => addGuess(code)}
                    />
                    {/* L'indice n'apparaît qu'après trois essais, et il faut le
                        demander : proposé d'emblée, il retirerait sa difficulté
                        au jeu ; jamais proposé, il laisse abandonner sur un pays
                        qu'on ne pouvait pas situer. */}
                    {target && guesses.length >= 3 && (
                        <div className="text-center text-[0.8rem]">
                            {hintFor === day ? (
                                <p className="text-fg-muted">
                                    {format(d.country.hintGiven, {
                                        continent: d.continents[target.continent],
                                    })}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setHintFor(day)}
                                    className="inline-flex items-center gap-1.5 text-fg-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                                >
                                    <Lightbulb aria-hidden="true" className="size-3.5" />
                                    {d.country.hintReveal}
                                </button>
                            )}
                        </div>
                    )}

                    <p aria-live="polite" className="sr-only">
                        {format(remaining === 1 ? d.game.attemptsLeft : d.game.attemptsLeftPlural, {
                            count: remaining,
                        })}
                    </p>
                </div>
            ) : (
                target && (
                    <div
                        className="flex flex-col items-center gap-4 rounded-md border p-4 text-center"
                        style={{
                            borderColor: won ? 'var(--win)' : 'var(--border-strong)',
                            background: won ? 'var(--win-soft)' : 'var(--bg-elevated)',
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">
                                {won
                                    ? guesses.length === 1
                                        ? d.game.wonOne
                                        : format(d.game.won, { count: guesses.length })
                                    : format(d.game.lost, { country: target.names[locale] })}
                            </p>
                            {/* Nommé même après une victoire : la silhouette
                                seule laisse un doute. */}
                            {won && (
                                <p className="text-sm text-fg-muted">
                                    {format(d.game.answerWas, { country: target.names[locale] })}
                                </p>
                            )}
                        </div>

                        <CountryCard country={target} locale={locale} dictionary={d} />

                        {isToday ? (
                            <StatsPanel
                                stats={stats}
                                dictionary={d}
                                highlight={won ? guesses.length : null}
                            />
                        ) : (
                            <p className="text-[0.8rem] text-fg-muted">{d.game.archiveExcluded}</p>
                        )}

                        <div className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={copy}
                                className="label inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-accent-contrast"
                            >
                                {copied ? <Check aria-hidden="true" className="size-4" /> : <Share2 aria-hidden="true" className="size-4" />}
                                {copied ? d.game.copied : d.game.share}
                            </button>
                            {isToday ? (
                                <Countdown template={d.game.nextIn} />
                            ) : (
                                <Link
                                    href={path('archives', locale)}
                                    className="text-[0.8rem] text-fg-muted underline-offset-4 hover:underline"
                                >
                                    {d.game.seeArchives}
                                </Link>
                            )}
                        </div>
                        {isToday && (
                            <Link
                                href={path('archives', locale)}
                                className="text-[0.8rem] text-fg-muted underline-offset-4 hover:underline"
                            >
                                {d.game.seeArchives}
                            </Link>
                        )}
                        <span aria-live="polite" className="sr-only">{copied ? d.game.copied : ''}</span>
                    </div>
                )
            )}

            {/* Toujours les six, voir `GuessSlot`. */}
            <ul className="flex flex-col gap-0.5">
                {Array.from({ length: MAX_GUESSES }, (_, i) => {
                    const r = rows[i];
                    return (
                        <GuessSlot
                            key={i}
                            index={i}
                            next={!over && i === rows.length}
                            filled={
                                r && {
                                    name: r.country.names[locale],
                                    km: r.km,
                                    direction: r.direction,
                                    closeness: r.closeness,
                                    correct: r.correct,
                                }
                            }
                            locale={locale}
                            dictionary={d}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
