import { ALIASES } from '../src/data/aliases.ts';
import { COUNTRIES } from '../src/data/countries.ts';

/**
 * Garde-fou sur la table générée.
 *
 * Le jeu repose entièrement sur elle : une silhouette décentrée flotte dans le
 * cadran, un pays manquant fait sauter un jour de la rotation. Ni l'un ni
 * l'autre ne se voit sans jouer, d'où cette vérification en intégration
 * continue — et à la main après chaque `npm run countries`.
 */
const MINIMUM = 150;
const TOLERANCE = 0.5; // en unités du carré de 100, soit un demi-pour-cent.

if (COUNTRIES.length < MINIMUM) {
    throw new Error(`Seulement ${COUNTRIES.length} pays, il en faut au moins ${MINIMUM}.`);
}

const codes = new Set<string>();

for (const country of COUNTRIES) {
    if (codes.has(country.code)) throw new Error(`Code ISO en double : ${country.code}`);
    codes.add(country.code);

    for (const [locale, name] of Object.entries(country.names)) {
        if (!name.trim()) throw new Error(`${country.code} n'a pas de nom en ${locale}.`);
    }

    const [lon, lat] = country.center;
    if (Math.abs(lon) > 180 || Math.abs(lat) > 90) {
        throw new Error(`${country.code} a un centre hors du globe : ${lon}, ${lat}`);
    }

    const numbers = country.path.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
    if (numbers.length < 6) throw new Error(`${country.code} a un chemin vide ou trop court.`);

    const xs = numbers.filter((_, i) => i % 2 === 0);
    const ys = numbers.filter((_, i) => i % 2 === 1);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

    if (Math.abs(cx - 50) > TOLERANCE || Math.abs(cy - 50) > TOLERANCE) {
        throw new Error(
            `${country.code} est décentré : sa boîte englobante a pour centre ` +
                `(${cx.toFixed(2)}, ${cy.toFixed(2)}) au lieu de (50, 50).`,
        );
    }
}

// Un alias qui vise un code absent ne fait rien : la recherche l'ignore en
// silence, et personne ne s'aperçoit que « vatican » ne trouve rien.
const orphans = Object.keys(ALIASES).filter((code) => !codes.has(code));
if (orphans.length > 0) {
    throw new Error(`Alias vers des codes absents de la table : ${orphans.join(', ')}`);
}

const aliasCount = Object.values(ALIASES).reduce((n, list) => n + list.length, 0);
console.log(
    `check-countries: ${COUNTRIES.length} pays, tous nommés et centrés, ${aliasCount} alias valides.`,
);
