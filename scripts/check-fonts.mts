import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { CHARSET } from './subset-fonts.mts';

/**
 * Vérifie que le sous-ensemble des polices couvre tout le contenu affiché.
 *
 * Un caractère manquant s'affiche en carré vide, et seulement dans la langue
 * qui l'emploie : impossible à voir en développant en français. Les
 * commentaires du code sont ignorés — ils ne sont jamais rendus.
 */
const ROOT = new URL('..', import.meta.url).pathname;
const covered = new Set(CHARSET);

let text = '';
for (const file of await readdir(join(ROOT, 'src/i18n/dictionaries'))) {
    text += await readFile(join(ROOT, 'src/i18n/dictionaries', file), 'utf8');
}
text += await readFile(join(ROOT, 'src/data/countries.ts'), 'utf8');

// Seules les chaînes littérales comptent : le reste du fichier est du code.
const strings = text.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g) ?? [];
const missing = new Set<string>();
for (const s of strings) {
    for (const c of s) {
        if (c.codePointAt(0)! > 0x1f && !covered.has(c)) missing.add(c);
    }
}

if (missing.size > 0) {
    const list = [...missing]
        .map((c) => `${c} (U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})`)
        .join(', ');
    throw new Error(`Caractères absents du sous-ensemble des polices : ${list}`);
}

console.log(`check-fonts: ${strings.length} chaînes vérifiées, tous les caractères sont couverts.`);
