import Link from 'next/link';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function SiteHeader({
    locale,
    routeKey,
    dictionary,
}: {
    locale: Locale;
    routeKey: RouteKey;
    dictionary: Dictionary;
}) {
    return (
        // Un filet d'un pixel, pas de fond translucide : une barre d'appareil
        // se signale par une ligne, pas par une surface.
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg/95">
            <div className="mx-auto flex w-full max-w-xl items-center gap-4 px-4 py-2 sm:px-6">
                <Link
                    href={path('home', locale)}
                    aria-current={routeKey === 'home' ? 'page' : undefined}
                    className="flex shrink-0 items-center gap-2 text-fg no-underline"
                >
                    {/* Rose des vents : une aiguille et son cercle gradué. Le
                        nom du jeu EST cet instrument. */}
                    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-6 shrink-0">
                        <circle cx="16" cy="16" r="14" fill="none" className="stroke-accent" strokeWidth="1.5" />
                        <path d="M16 4l2.8 9.2L28 16l-9.2 2.8L16 28l-2.8-9.2L4 16l9.2-2.8Z" className="fill-accent" />
                    </svg>
                    {/* Le nom en capitales espacées : une plaque gravée. */}
                    <span className="label text-[0.78rem] font-medium text-fg">
                        {dictionary.header.brand}
                    </span>
                </Link>

                <div className="ml-auto flex items-center gap-3">
                    <nav aria-label={dictionary.header.navLabel} className="hidden xs:flex xs:items-center xs:gap-3">
                        <Link
                            href={path('rules', locale)}
                            aria-current={routeKey === 'rules' ? 'page' : undefined}
                            className="label text-fg-muted no-underline transition-colors hover:text-fg aria-[current=page]:text-fg"
                        >
                            {dictionary.header.navRules}
                        </Link>
                        <Link
                            href={path('about', locale)}
                            aria-current={routeKey === 'about' ? 'page' : undefined}
                            className="label text-fg-muted no-underline transition-colors hover:text-fg aria-[current=page]:text-fg"
                        >
                            {dictionary.header.navAbout}
                        </Link>
                    </nav>
                    <span aria-hidden="true" className="hidden h-3.5 w-px bg-border-strong xs:block" />
                    <LocaleSwitcher locale={locale} routeKey={routeKey} dictionary={dictionary} />
                    <ThemeToggle dictionary={dictionary} />
                </div>
            </div>
        </header>
    );
}
