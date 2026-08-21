import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/config';
import { url, type RouteKey } from '@/i18n/routes';
import { SITE_URL } from '@/lib/site';
import { UPDATED } from '@/lib/updated';

// `output: 'export'` traite les gestionnaires de route comme dynamiques et
// refuse de construire sans cette ligne.
export const dynamic = 'force-static';

// Une entrée par langue ET par page.
//
// ⚠️ SANS `alternates` : ils ajoutent des `xhtml:link`, et Chrome désactive son
// visualiseur XML dès qu'un document contient l'espace de noms XHTML. Les
// `hreflang` sont déjà dans le `<head>` de chaque page.
const PAGES: { key: RouteKey; priority: number; changeFrequency: 'daily' | 'monthly' }[] = [
    { key: 'home', priority: 1, changeFrequency: 'daily' },
    { key: 'rules', priority: 0.6, changeFrequency: 'monthly' },
    // Une entrée de plus chaque jour : les archives changent aussi souvent
    // que l'accueil.
    { key: 'archives', priority: 0.5, changeFrequency: 'daily' },
    { key: 'about', priority: 0.4, changeFrequency: 'monthly' },
    { key: 'changelog', priority: 0.4, changeFrequency: 'monthly' },
    // Obligatoires et indexables, mais elles n'ont pas à concurrencer le jeu.
    { key: 'legal', priority: 0.2, changeFrequency: 'monthly' },
    { key: 'privacy', priority: 0.2, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    return PAGES.flatMap(({ key, priority, changeFrequency }) => {
        const lastModified = new Date(`${UPDATED[key]}T00:00:00Z`);
        return LOCALES.map((locale) => ({
            url: url(key, locale, SITE_URL),
            lastModified,
            changeFrequency,
            priority,
        }));
    });
}
