import type { Metadata } from 'next';
import { Console } from '@/components/Console';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { ChangelogView } from '@/views/ChangelogView';

// ⚠️ Le nom du dossier EST le slug français : il doit rester identique à
// `SLUGS.changelog.fr` dans `src/i18n/routes.ts`. Une divergence donne des liens
// internes vers une page inexistante, sans erreur de construction.
export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'changelog');

export default function Page() {
    const d = getDictionary(DEFAULT_LOCALE);

    return (
        <Console locale={DEFAULT_LOCALE} routeKey="changelog" readout={d.changelog.title}>
            <ChangelogView locale={DEFAULT_LOCALE} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(DEFAULT_LOCALE, 'changelog') }}
            />
        </Console>
    );
}
