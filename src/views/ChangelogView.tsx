import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';
import { formatDay } from '@/lib/daily';

/**
 * Le journal des versions.
 *
 * ⚠️ La plus récente EN PREMIER dans le dictionnaire : personne ne fait défiler
 * trois ans de notes pour savoir ce qui a changé cette semaine.
 *
 * Les dates passent par `formatDay` plutôt que d'être écrites en toutes lettres
 * dans les dictionnaires : un « 21 août 2026 » recopié quatre fois finirait par
 * diverger, et le format d'écriture d'une date n'est pas le même d'une langue à
 * l'autre.
 */
export function ChangelogView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <article className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="text-3xl text-balance">{d.changelog.heading}</h1>
            <p className="mt-3 text-lg text-fg-muted text-pretty">{d.changelog.lede}</p>

            <ol className="mt-8 flex list-none flex-col gap-8 p-0">
                {d.changelog.entries.map((entry) => (
                    <li key={entry.version} className="flex flex-col gap-3">
                        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h2 className="text-xl font-semibold tracking-tight">{entry.title}</h2>
                            <span className="numeric rounded-full border border-border-strong px-2 py-0.5 text-[0.7rem] text-fg-muted">
                                {entry.version}
                            </span>
                            <time dateTime={entry.date} className="numeric text-[0.8rem] text-fg-muted">
                                {formatDay(entry.date, locale)}
                            </time>
                        </header>
                        <ul className="flex flex-col gap-2 pl-5 leading-relaxed">
                            {entry.changes.map((change) => (
                                <li key={change} className="list-disc text-pretty marker:text-accent">
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>

            <Link
                href={path('home', locale)}
                className="label mt-10 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-accent-contrast no-underline"
            >
                {d.changelog.back}
                <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
        </article>
    );
}
