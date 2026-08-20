import { Console } from '@/components/Console';
import { Intro } from '@/components/Intro';
import { PuzzleReadout } from '@/components/PuzzleReadout';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { buildJsonLd } from '@/lib/seo';
import { GameView } from '@/views/GameView';

export default function Page() {
    return (
        <Console locale={DEFAULT_LOCALE} routeKey="home" readout={<PuzzleReadout locale={DEFAULT_LOCALE} />}>
            <GameView locale={DEFAULT_LOCALE} />
            <Intro locale={DEFAULT_LOCALE} dictionary={getDictionary(DEFAULT_LOCALE)} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildJsonLd(DEFAULT_LOCALE) }}
            />
        </Console>
    );
}
