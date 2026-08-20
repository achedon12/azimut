import localFont from 'next/font/local';

// Archivo pour le texte, Roboto Mono pour les seuls nombres — chasse fixe,
// donc alignés en colonne d'un essai à l'autre.
//
// Auto-hébergées : la CSP n'autorise `font-src` que sur `'self'`.
export const display = localFont({
    src: './archivo-latin-wght-normal.woff2',
    // ⚠️ Suffixe `-local` obligatoire : `--font-sans` est déjà un jeton
    // Tailwind, et lui réaffecter sa valeur ferait une référence circulaire.
    variable: '--font-sans-local',
    weight: '100 900',
    display: 'swap',
    fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

export const mono = localFont({
    src: './roboto-mono-latin-wght-normal.woff2',
    variable: '--font-mono-local',
    weight: '100 700',
    display: 'swap',
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
