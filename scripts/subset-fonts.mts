import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import subsetFont from 'subset-font';

/**
 * Réduit les polices à ce que le site emploie réellement.
 *
 * Les fichiers de `@fontsource-variable` portent toute la plage de graisses
 * 100–900 et un jeu latin complet. Le site n'utilise que 400 à 700 et l'alphabet
 * latin étendu : le reste voyage sur le réseau pour rien, et la police de texte
 * est sur le chemin critique du plus grand rendu.
 *
 * ⚠️ Le jeu de caractères doit couvrir les QUATRE langues et les 168 noms de
 * pays. Un caractère absent s'affiche en carré vide, et seulement dans la langue
 * concernée — le genre de défaut qu'on ne voit jamais en développant en
 * français. `npm run check:fonts` le vérifie sur le contenu réel.
 */
const ROOT = new URL('..', import.meta.url).pathname;

/** Latin de base + latin étendu A et B, puis la ponctuation employée. */
export const CHARSET =
    Array.from({ length: 0x24f - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i)).join('') +
    '€—–…«»‘’“”„°′″·×→↑↓←№';

const FONTS = [
    {
        source: 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2',
        target: 'src/fonts/archivo-latin-wght-normal.woff2',
    },
    {
        source: 'node_modules/@fontsource-variable/roboto-mono/files/roboto-mono-latin-wght-normal.woff2',
        target: 'src/fonts/roboto-mono-latin-wght-normal.woff2',
    },
];

for (const { source, target } of FONTS) {
    const before = await readFile(join(ROOT, source));
    const after = await subsetFont(before, CHARSET, {
        targetFormat: 'woff2',
        // La plage réellement employée : `font-medium`, `font-semibold` et
        // `font-bold`, plus le poids normal.
        variationAxes: { wght: { min: 400, max: 700 } },
    });
    await writeFile(join(ROOT, target), after);
    const gain = Math.round(100 - (100 * after.length) / before.length);
    console.log(
        `subset-fonts: ${target.split('/').pop()} — ${(before.length / 1024).toFixed(1)} Ko → ${(after.length / 1024).toFixed(1)} Ko (−${gain} %)`,
    );
}
