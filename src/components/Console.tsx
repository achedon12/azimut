import type { ReactNode } from 'react';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { Credits } from './Credits';
import { LocaleSwitcher } from './LocaleSwitcher';
import { StreakBadge } from './StreakBadge';
import { ThemeToggle } from './ThemeToggle';

/**
 * Le châssis d'Azimut : une PLAQUE en haut, une barre de commandes en BAS.
 *
 * Sur un appareil, la façade porte son nom et son relevé ; les commandes sont
 * sous la main.
 */
export function Console({
    locale,
    routeKey,
    readout,
    children,
}: {
    locale: Locale;
    routeKey: RouteKey;
    /** Le relevé gravé sur la plaque : numéro de partie, ou titre de page. */
    readout?: ReactNode;
    children: ReactNode;
}) {
    const d = getDictionary(locale);

    const nav = [
        { key: 'rules' as const, label: d.header.navRules },
        { key: 'about' as const, label: d.header.navAbout },
    ];

    return (
        <>
            <a
                href="#contenu"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-contrast"
            >
                {d.header.skipToContent}
            </a>

            {/* La plaque : nom gravé à gauche, relevé à droite. Rien d'autre —
                aucun menu, aucun bouton. */}
            <div className="border-b border-border-subtle">
                <div className="mx-auto flex w-full max-w-md items-baseline justify-between gap-4 px-5 py-3">
                    <Link href={path('home', locale)} className="flex items-baseline gap-2 no-underline">
                        <span className="label text-[0.8rem] text-fg">{d.header.brand}</span>
                    </Link>
                    <span className="flex items-center gap-2">
                        <StreakBadge template={d.stats.streakBadge} />
                        <span className="numeric text-[0.7rem] tracking-[0.12em] text-fg-muted uppercase">
                            {readout}
                        </span>
                        {/* Le calendrier, juste après la date : c'est là qu'on
                            le cherche quand on veut un AUTRE jour. Le libellé
                            reste dans le balisage — une ancre sans texte est
                            plus faible pour l'indexation, et n'a pas de nom
                            accessible. */}
                        <Link
                            href={path('archives', locale)}
                            aria-current={routeKey === 'archives' ? 'page' : undefined}
                            className="-m-1.5 rounded p-1.5 text-fg-muted transition-colors hover:text-fg aria-[current=page]:text-accent"
                        >
                            <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.75} />
                            <span className="sr-only">{d.header.navArchives}</span>
                        </Link>
                    </span>
                </div>
            </div>

            <main id="contenu" className="flex flex-1 flex-col justify-center">
                {children}
            </main>

            {/* Les commandes, en bas : langue, thème, pages annexes — puis les
                crédits. Un <footer> plutôt qu'un <div> : c'est bien le pied de
                page du document, même s'il porte aussi des commandes. */}
            <footer className="border-t border-border-subtle">
                <div className="mx-auto flex w-full max-w-md flex-col gap-2.5 px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <nav aria-label={d.header.navLabel} className="flex items-center gap-4">
                            {nav.map((item) => (
                                <Link
                                    key={item.key}
                                    href={path(item.key, locale)}
                                    aria-current={routeKey === item.key ? 'page' : undefined}
                                    className="label text-fg-muted no-underline transition-colors hover:text-fg aria-[current=page]:text-fg"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex items-center gap-3">
                            <LocaleSwitcher locale={locale} routeKey={routeKey} dictionary={d} />
                            <ThemeToggle dictionary={d} />
                        </div>
                    </div>

                    <div className="h-px bg-border-subtle" />

                    <Credits dictionary={d} />
                </div>
            </footer>
        </>
    );
}
