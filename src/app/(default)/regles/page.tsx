import type { Metadata } from 'next';
import { Console } from '@/components/Console';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { RulesView } from '@/views/RulesView';

// ⚠️ Le nom du dossier EST le slug français : il doit rester identique à
// `SLUGS.rules.fr` dans `src/i18n/routes.ts`. Une divergence donne des liens
// internes vers une page inexistante, sans erreur de construction.
export const metadata: Metadata = buildMetadata(DEFAULT_LOCALE, 'rules');

export default function Page() {
    const d = getDictionary(DEFAULT_LOCALE);

    return (
        <Console locale={DEFAULT_LOCALE} routeKey="rules" readout={d.rules.title}>
            <RulesView locale={DEFAULT_LOCALE} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(DEFAULT_LOCALE, 'rules') }}
            />
        </Console>
    );
}
