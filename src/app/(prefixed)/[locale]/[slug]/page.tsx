import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Console } from '@/components/Console';
import { getDictionary } from '@/i18n';
import { isLocale } from '@/i18n/config';
import { contentKeyForSlug, contentParams } from '@/i18n/routes';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { AboutView } from '@/views/AboutView';
import { ArchiveView } from '@/views/ArchiveView';
import { RulesView } from '@/views/RulesView';

// Segment dynamique plutôt qu'un dossier par langue : les slugs sont TRADUITS
// et `routes.ts` en est la seule source.
export function generateStaticParams() {
    return contentParams();
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const key = contentKeyForSlug(locale, slug);
    if (!key) notFound();
    return buildMetadata(locale, key);
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const key = contentKeyForSlug(locale, slug);
    if (!key) notFound();

    const d = getDictionary(locale);

    return (
        <Console locale={locale} routeKey={key} readout={d[key].title}>
            {key === 'about' ? (
                <AboutView locale={locale} />
            ) : key === 'archives' ? (
                <ArchiveView locale={locale} />
            ) : (
                <RulesView locale={locale} />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(locale, key) }}
            />
        </Console>
    );
}
