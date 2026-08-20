import { COUNTRIES } from '../src/data/countries.ts';
import { EPOCH, countryOfDay } from '../src/lib/daily.ts';

/**
 * Le calendrier du jeu, figé.
 *
 * Azimut ne STOCKE aucun pays : le pays d'un jour est le résultat d'un calcul
 * qui ne dépend que de la date. À date égale, toutes les machines trouvent le
 * même, aujourd'hui comme dans dix ans, sans rien demander à un serveur.
 *
 * Ce qui doit donc être protégé n'est pas une base de données, mais la STABILITÉ
 * de ce calcul. Trois choses le déterminent : l'origine `EPOCH`, la graine du
 * mélange, et le contenu ET L'ORDRE de la table des pays. Ajouter un pays au
 * milieu de `countries.ts` décale toute la suite et réécrit silencieusement la
 * réponse de chaque jour passé — les archives des joueurs deviendraient fausses
 * sans qu'aucun test ne bronche.
 *
 * D'où ces repères, étalés sur dix ans. Ils échouent au premier changement qui
 * réécrirait l'histoire. C'est la sauvegarde du calendrier : pas un fichier à
 * restaurer, une propriété à tenir.
 *
 * ⚠️ Ne JAMAIS mettre ces valeurs à jour pour faire passer le test. Si elles
 * changent, c'est la modification qu'il faut revoir. Elles n'ont été fixées
 * qu'une fois, avant la mise en ligne, quand l'origine a été arrêtée.
 */
const PINNED: [day: string, code: string][] = [
    ['2026-01-01', 'ID'],
    ['2026-01-02', 'SA'],
    ['2026-02-14', 'ER'],
    ['2026-03-15', 'ZW'],
    // De part et d'autre d'une frontière de cycle : c'est là que la permutation
    // change de graine.
    ['2026-06-17', 'RS'],
    ['2026-06-18', 'PE'],
    ['2026-08-19', 'ZM'],
    ['2026-08-20', 'EE'],
    ['2026-12-25', 'SL'],
    ['2027-06-01', 'US'],
    // Un 29 février : le calcul du jour ne doit pas trébucher dessus.
    ['2028-02-29', 'BT'],
    ['2029-01-01', 'EE'],
    ['2030-07-04', 'IR'],
    ['2032-02-09', 'NZ'],
    ['2036-01-01', 'GW'],
];


if (EPOCH !== '2026-01-01') {
    throw new Error(`EPOCH vaut ${EPOCH} : la déplacer change le pays de CHAQUE jour.`);
}

for (const [day, expected] of PINNED) {
    const actual = countryOfDay(day).code;
    if (actual !== expected) {
        throw new Error(
            `Le ${day} donne ${actual} au lieu de ${expected}. ` +
                `Le calendrier a changé : les archives déjà jouées deviennent fausses.`,
        );
    }
}

/**
 * Aucun pays ne doit revenir avant que tous soient passés — la promesse d'une
 * permutation complète, vérifiée sur les premiers cycles.
 */
const size = COUNTRIES.length;
const start = Date.parse(`${EPOCH}T12:00:00Z`);
for (let cycle = 0; cycle < 4; cycle += 1) {
    const seen = new Set<string>();
    for (let i = 0; i < size; i += 1) {
        const day = new Date(start + (cycle * size + i) * 86_400_000).toISOString().slice(0, 10);
        seen.add(countryOfDay(day).code);
    }
    if (seen.size !== size) {
        throw new Error(`Cycle ${cycle} : ${seen.size} pays distincts au lieu de ${size}.`);
    }
}

// Deux cycles voisins ne doivent pas suivre le même ordre : sinon la suite
// recommence à l'identique tous les 168 jours, ce qu'un joueur voit dès qu'il
// ouvre les archives.
const first = new Date(start).toISOString().slice(0, 10);
const next = new Date(start + size * 86_400_000).toISOString().slice(0, 10);
if (countryOfDay(first).code === countryOfDay(next).code) {
    throw new Error('Le cycle suivant rejoue le même ordre que le premier.');
}

console.log(`check-schedule: ${PINNED.length} repères tenus sur dix ans, ${size} pays par cycle.`);
