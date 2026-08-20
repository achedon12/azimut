import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { fr } from '../src/i18n/dictionaries/fr.ts';
import { en } from '../src/i18n/dictionaries/en.ts';
import { es } from '../src/i18n/dictionaries/es.ts';
import { de } from '../src/i18n/dictionaries/de.ts';
import { COUNTRIES } from '../src/data/countries.ts';

// Les SVG de `public/` sont la SOURCE des icônes ; l'image de partage, elle,
// est décrite ici parce qu'elle est PARAMÉTRÉE PAR LANGUE. Les PNG produits
// sont versionnés : la construction Docker n'a ni sharp ni polices système.
const ROOT = join(import.meta.dirname, '..');
const FONT = 'DejaVu Sans, Noto Sans, Liberation Sans, sans-serif';

// Une silhouette reconnaissable pour l'image de partage — l'Italie, dont la
// forme se lit même en vignette. Elle ne dévoile aucune partie : ce n'est pas
// le pays du jour, seulement une illustration du principe.
const SAMPLE = COUNTRIES.find((c) => c.code === 'IT')!;

function svg(d: typeof fr): string {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M30 0H0V30" fill="none" stroke="#15233b" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#f5f1e4"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect y="612" width="1200" height="18" fill="#15233b"/>

  <g transform="translate(84 74)">
    <rect width="76" height="76" rx="18" fill="#15233b"/>
    <g transform="translate(6 6) scale(1.0)">
      <path d="M32 9l5.6 17.4L55 32l-17.4 5.6L32 55l-5.6-17.4L9 32l17.4-5.6Z" fill="#f5f1e4"/>
      <circle cx="32" cy="32" r="3" fill="#15233b"/>
    </g>
  </g>
  <text x="180" y="128" font-family="${FONT}" font-size="54" font-weight="bold" fill="#15233b">${esc(d.meta.title)}</text>
  <text x="86" y="206" font-family="${FONT}" font-size="27" fill="#566880">${esc(d.meta.description.split('.')[0]!)}.</text>

  <g transform="translate(760 190) scale(3.4)">
    <path d="${SAMPLE.path}" fill="#15233b" opacity="0.92"/>
  </g>

  <text x="86" y="470" font-family="${FONT}" font-size="30" font-weight="bold" fill="#15233b">${esc(d.game.prompt)}</text>
  <text x="86" y="530" font-family="${FONT}" font-size="25" font-weight="bold" fill="#7b8aa1" letter-spacing="1">azimut.leoderoin.fr</text>
</svg>`;
}

async function png(source: string | Buffer, output: string, width: number, height: number) {
    const buffer = await sharp(Buffer.from(source as string), { density: 384 })
        .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toBuffer();
    const target = join(ROOT, output);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buffer);
    console.log(`${output} — ${width}×${height}, ${(buffer.length / 1024).toFixed(1)} Ko`);
}

for (const [locale, d] of Object.entries({ fr, en, es, de })) {
    await png(svg(d as typeof fr), `public/og-${locale}.png`, 1200, 630);
}

const ICONS = [
    { src: 'public/logo-mark.svg', out: 'public/icon-192.png', size: 192 },
    { src: 'public/logo-mark.svg', out: 'public/icon-512.png', size: 512 },
    { src: 'public/logo-mark-maskable.svg', out: 'public/icon-maskable-512.png', size: 512 },
    // iOS ignore le favicon SVG et n'accepte qu'un PNG.
    { src: 'public/logo-mark.svg', out: 'src/app/apple-icon.png', size: 180 },
];
for (const icon of ICONS) {
    await png(await readFile(join(ROOT, icon.src)), icon.out, icon.size, icon.size);
}

// Le favicon reste vectoriel : Next le sert sur `/icon.svg`, et tous les
// navigateurs modernes le préfèrent à un PNG, à n'importe quelle taille.
await writeFile(join(ROOT, 'src/app/icon.svg'), await readFile(join(ROOT, 'public/logo-mark.svg')));
console.log('src/app/icon.svg — copié depuis public/logo-mark.svg');
