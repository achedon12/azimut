import type { Metadata } from 'next';
import { Console } from '@/components/Console';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { AboutView } from '@/views/AboutView';

// ⚠️ Le nom du dossier EST le slug français : il doit rester identique à
// `SLUGS.about.fr` dans `src/i18n/routes.ts`. Une divergence donne des liens
// internes vers une page inexistante, sans erreur de construction.
//
// Ici `about` : cette page porte le même slug dans les quatre langues.
export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'about');

export default function Page() {
    const d = getDictionary(DEFAULT_LOCALE);

    return (
        <Console locale={DEFAULT_LOCALE} routeKey="about" readout={d.about.title}>
            <AboutView locale={DEFAULT_LOCALE} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(DEFAULT_LOCALE, 'about') }}
            />
        </Console>
    );
}
