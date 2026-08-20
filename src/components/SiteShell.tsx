import type { ReactNode } from 'react';
import { display, mono } from '@/fonts';
import type { Locale } from '@/i18n/config';
import { ThemeScript } from './ThemeScript';

// Enveloppe <html>/<body>, et rien d'autre : l'en-tête a besoin de savoir
// quelle page est rendue, ce qu'un layout Next ignore. C'est `PageChrome`,
// appelé par chaque page, qui porte le châssis.
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
    return (
        <html
            lang={locale}
            className={`${display.variable} ${mono.variable}`}
            suppressHydrationWarning
        >
            <body className="flex min-h-dvh flex-col antialiased">
                <ThemeScript />
                {children}
            </body>
        </html>
    );
}
