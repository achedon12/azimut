import type { Metadata } from 'next';
import { Console } from '@/components/Console';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { ArchiveView } from '@/views/ArchiveView';

// ⚠️ Le nom du dossier EST le slug français : il doit rester identique à
// `SLUGS.archives.fr` dans `src/i18n/routes.ts`. Une divergence donne des liens
// internes vers une page inexistante, sans erreur de construction.
export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'archives');

export default function Page() {
    const d = getDictionary(DEFAULT_LOCALE);

    return (
        <Console locale={DEFAULT_LOCALE} routeKey="archives" readout={d.archives.title}>
            <ArchiveView locale={DEFAULT_LOCALE} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(DEFAULT_LOCALE, 'archives') }}
            />
        </Console>
    );
}
