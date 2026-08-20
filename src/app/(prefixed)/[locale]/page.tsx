import { notFound } from 'next/navigation';
import { Console } from '@/components/Console';
import { Intro } from '@/components/Intro';
import { PuzzleReadout } from '@/components/PuzzleReadout';
import { getDictionary } from '@/i18n';
import { isLocale } from '@/i18n/config';
import { buildJsonLd } from '@/lib/seo';
import { GameView } from '@/views/GameView';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <Console locale={locale} routeKey="home" readout={<PuzzleReadout locale={locale} />}>
            <GameView locale={locale} />
            <Intro locale={locale} dictionary={getDictionary(locale)} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd(locale) }} />
        </Console>
    );
}
