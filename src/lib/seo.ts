import type { Metadata } from 'next';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { AUTHOR, SITE_URL } from './site';

const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US', es: 'es_ES', de: 'de_DE' };

function alternates(key: RouteKey): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = path(key, locale);
    // `x-default` doit viser une page RÉELLE, pas une redirection.
    languages['x-default'] = path(key, DEFAULT_LOCALE);
    return languages;
}

export function buildMetadata(locale: Locale, key: RouteKey = 'home'): Metadata {
    const d = getDictionary(locale);
    const copy =
        key === 'home'
            ? d.meta
            : key === 'about'
              ? { titleTag: `${d.about.title} — ${d.meta.title}`, description: d.about.metaDescription }
              : { titleTag: `${d.rules.title} — ${d.meta.title}`, description: d.rules.metaDescription };

    return {
        metadataBase: new URL(SITE_URL),
        title: copy.titleTag,
        description: copy.description,
        keywords: d.meta.keywords,
        applicationName: d.meta.title,
        authors: [{ name: AUTHOR.name, url: AUTHOR.site }],
        creator: AUTHOR.name,
        publisher: AUTHOR.name,
        alternates: { canonical: path(key, locale), languages: alternates(key) },
        openGraph: {
            type: 'website',
            url: path(key, locale),
            siteName: d.meta.title,
            title: copy.titleTag,
            description: copy.description,
            locale: OG_LOCALES[locale],
            alternateLocale: LOCALES.filter((o) => o !== locale).map((o) => OG_LOCALES[o]),
            images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: d.meta.ogAlt }],
        },
        twitter: {
            card: 'summary_large_image',
            title: copy.titleTag,
            description: copy.description,
            images: [{ url: `/og-${locale}.png`, alt: d.meta.ogAlt }],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
        formatDetection: { telephone: false, address: false, email: false },
    };
}

/**
 * Données structurées de l'accueil : un `VideoGame` gratuit et le `WebSite` qui
 * le porte, réunis dans un `@graph`.
 *
 * Les deux entités sont liées par `@id` plutôt que dupliquées : sans ce lien,
 * un moteur voit un jeu et un site sans rapport l'un avec l'autre, et n'attache
 * l'auteur ni à l'un ni à l'autre.
 */
export function buildJsonLd(locale: Locale): string {
    const d = getDictionary(locale);
    const home = `${SITE_URL}${path('home', locale)}`;
    const author = {
        '@type': 'Person',
        '@id': `${SITE_URL}/#author`,
        name: AUTHOR.name,
        url: AUTHOR.site,
        sameAs: [AUTHOR.site, AUTHOR.github],
    };
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${home}#website`,
                url: home,
                name: d.meta.title,
                description: d.meta.description,
                inLanguage: locale,
                author: { '@id': `${SITE_URL}/#author` },
                publisher: { '@id': `${SITE_URL}/#author` },
            },
            author,
            game(locale, d, home),
        ],
    });
}

type Dict = ReturnType<typeof getDictionary>;

function game(locale: Locale, d: Dict, home: string) {
    return {
        '@type': 'VideoGame',
        '@id': `${home}#game`,
        isPartOf: { '@id': `${home}#website` },
        name: d.meta.title,
        url: home,
        description: d.meta.description,
        inLanguage: locale,
        gamePlatform: 'Web browser',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        playMode: 'SinglePlayer',
        genre: 'Geography',
        author: { '@id': `${SITE_URL}/#author` },
        // Le prix zéro doit être déclaré : sans `offers`, un jeu gratuit n'est
        // pas signalé comme tel dans les résultats.
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    };
}

/**
 * Le fil d'Ariane d'une page annexe.
 *
 * C'est ce qui remplace l'URL brute sous le titre dans les résultats de
 * recherche : `Azimut › Comment on joue` plutôt que `azimut.leoderoin.fr/regles`.
 */
export function buildBreadcrumbJsonLd(locale: Locale, key: Exclude<RouteKey, 'home'>): string {
    const d = getDictionary(locale);
    const name = key === 'about' ? d.about.title : d.rules.title;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: d.meta.title,
                item: `${SITE_URL}${path('home', locale)}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name,
                item: `${SITE_URL}${path(key, locale)}`,
            },
        ],
    });
}
