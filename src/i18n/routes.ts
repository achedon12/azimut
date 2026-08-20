import { DEFAULT_LOCALE, type Locale } from './config';

export type RouteKey = 'home' | 'rules' | 'about';

export const CONTENT_KEYS = ['rules', 'about'] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

// Slugs TRADUITS : un mot-clé dans l'URL, dans la langue du visiteur.
//
// ⚠️ Toute URL interne passe par `path()`. Écrire `/en/rules/` en dur casse
// silencieusement les hreflang, le sitemap, les redirections nginx et le
// sélecteur de langue, tous construits depuis cette table.
//
// ⚠️ Le nom du dossier de route français DOIT être identique au slug `fr`.
const SLUGS: Record<RouteKey, Record<Locale, string>> = {
    home: { fr: '', en: '', es: '', de: '' },
    rules: { fr: 'regles', en: 'rules', es: 'reglas', de: 'regeln' },
    // `about` dans les QUATRE langues, à la demande : le mot est compris
    // partout et l'adresse reste la même quel que soit le drapeau choisi.
    // Les règles, elles, gardent des slugs traduits — c'est une exception
    // pour cette page-là, pas un renoncement à la règle générale.
    about: { fr: 'about', en: 'about', es: 'about', de: 'about' },
};

export function path(key: RouteKey, locale: Locale): string {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    const slug = SLUGS[key][locale];
    return slug ? `${prefix}/${slug}/` : `${prefix}/`;
}

export function url(key: RouteKey, locale: Locale, siteUrl: string): string {
    return `${siteUrl.replace(/\/$/, '')}${path(key, locale)}`;
}

export function contentParams(): { locale: Locale; slug: string }[] {
    return CONTENT_KEYS.flatMap((key) =>
        (Object.keys(SLUGS[key]) as Locale[])
            .filter((locale) => locale !== DEFAULT_LOCALE)
            .map((locale) => ({ locale, slug: SLUGS[key][locale] })),
    );
}

export function contentKeyForSlug(locale: Locale, slug: string): ContentKey | null {
    return CONTENT_KEYS.find((key) => SLUGS[key][locale] === slug) ?? null;
}

/** Tous les chemins, pour dériver les redirections nginx. */
export function allPaths(): string[] {
    return (Object.keys(SLUGS) as RouteKey[]).flatMap((key) =>
        (Object.keys(SLUGS[key]) as Locale[]).map((locale) => path(key, locale)),
    );
}
