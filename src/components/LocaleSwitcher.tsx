import Link from 'next/link';
import type { Dictionary } from '@/i18n';
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';

// Des liens, et pas un menu déroulant : chaque langue doit rester une URL
// qu'un robot peut suivre, sinon les `hreflang` ne mènent nulle part.
//
// Chaque lien vise la MÊME page dans l'autre langue, slug traduit compris —
// d'où `routeKey`.
export function LocaleSwitcher({
    locale,
    routeKey,
    dictionary,
}: {
    locale: Locale;
    routeKey: RouteKey;
    dictionary: Dictionary;
}) {
    return (
        <nav aria-label={dictionary.header.languageLabel}>
            <ul className="flex items-center gap-1 text-xs font-semibold tracking-wide">
                {LOCALES.map((candidate, index) => {
                    const active = candidate === locale;
                    return (
                        <li key={candidate} className="flex items-center gap-1">
                            {index > 0 && (
                                <span aria-hidden="true" className="text-border-strong">
                                    ·
                                </span>
                            )}
                            <Link
                                href={path(routeKey, candidate)}
                                hrefLang={candidate}
                                lang={candidate}
                                aria-current={active ? 'true' : undefined}
                                // Pas de `title` : avec le `sr-only`, un
                                // lecteur d'écran annonçait « Français,
                                // Français ».
                                //
                                // La cible tombait sous les 24 px de WCAG 2.2.
                                // Élargie par du remplissage, avec des marges
                                // négatives pour ne pas changer la hauteur.
                                className={`-my-1.5 rounded px-1.5 py-1.5 transition-colors ${
                                    // ⚠️ Le soulignement est le second signal,
                                    // non coloré : la couleur seule est
                                    // contraire à WCAG 1.4.1. Réservé à l'état
                                    // actif — au survol aussi il se
                                    // confondrait avec « vous êtes ici ».
                                    active
                                        ? 'text-fg underline decoration-2 underline-offset-4'
                                        : 'text-fg-muted no-underline hover:text-fg'
                                }`}
                            >
                                <span aria-hidden="true">{LOCALE_SHORT[candidate]}</span>
                                <span className="sr-only">{LOCALE_NAMES[candidate]}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
