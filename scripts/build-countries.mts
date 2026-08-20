import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Construit le jeu de données des pays à partir de Natural Earth 110m
// (domaine public). Le GeoJSON brut fait 800 Ko et n'a rien à faire dans le
// navigateur : ce script en extrait le strict nécessaire — un code, quatre
// noms, un centre, une silhouette — et écrit un module TypeScript versionné.
//
// Il est lancé À LA MAIN, pas à chaque construction : les frontières ne
// bougent pas toutes les semaines, et une construction Docker ne doit pas
// dépendre d'un téléchargement distant.
const ROOT = join(import.meta.dirname, '..');
const SOURCE = join(ROOT, 'scripts/ne_110m_admin_0_countries.geojson');

type Ring = [number, number][];

/** Une entité peut être un polygone ou un archipel : on aplatit tout. */
function rings(geometry: { type: string; coordinates: unknown }): Ring[] {
    if (geometry.type === 'Polygon') return geometry.coordinates as Ring[];
    if (geometry.type === 'MultiPolygon')
        return (geometry.coordinates as Ring[][]).flatMap((polygon) => polygon);
    return [];
}

/**
 * Douglas-Peucker. Garde les points qui PORTENT la silhouette et jette les
 * autres : un contour reconnaissable ne demande pas la précision d'une carte
 * marine, et le brut pèse trois fois plus pour un résultat identique à l'œil.
 */
function simplify(points: Ring, tolerance: number): Ring {
    if (points.length < 3) return points;

    const distance = (p: [number, number], a: [number, number], b: [number, number]) => {
        const [x, y] = p;
        const [x1, y1] = a;
        const [x2, y2] = b;
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
        return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
    };

    let worst = 0;
    let index = 0;
    for (let i = 1; i < points.length - 1; i += 1) {
        const d = distance(points[i]!, points[0]!, points[points.length - 1]!);
        if (d > worst) {
            worst = d;
            index = i;
        }
    }

    if (worst > tolerance) {
        const left = simplify(points.slice(0, index + 1), tolerance);
        const right = simplify(points.slice(index), tolerance);
        return [...left.slice(0, -1), ...right];
    }
    return [points[0]!, points[points.length - 1]!];
}

/** Centre du plus grand anneau : le centre de MASSE d'un archipel tomberait en mer. */
function centroid(largest: Ring): [number, number] {
    let area = 0;
    let x = 0;
    let y = 0;
    for (let i = 0; i < largest.length - 1; i += 1) {
        const [x0, y0] = largest[i]!;
        const [x1, y1] = largest[i + 1]!;
        const cross = x0 * y1 - x1 * y0;
        area += cross;
        x += (x0 + x1) * cross;
        y += (y0 + y1) * cross;
    }
    if (area === 0) return largest[0]!;
    area *= 3;
    return [Number((x / area).toFixed(3)), Number((y / area).toFixed(3))];
}

function bbox(ring: Ring) {
    const xs = ring.map((p) => p[0]);
    const ys = ring.map((p) => p[1]);
    return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/**
 * Garde la masse principale et ce qui gravite autour, écarte le lointain.
 *
 * ⚠️ Sans ce tri, la France se réduisait à un point : son entité inclut la
 * Guyane, donc le cadre s'étirait de l'Amérique du Sud à l'Europe et la
 * métropole devenait invisible.
 *
 * Le seuil est RELATIF à la taille du pays, jamais en degrés absolus : mesuré
 * sur les données, la Guyane est à 4,5 diagonales de la métropole quand aucun
 * anneau d'archipel — Indonésie, Philippines — ne dépasse 2,2. Trois sépare
 * les deux cas sans arbitrage manuel.
 */
function mainland(all: Ring[]): Ring[] {
    const sorted = [...all].sort((a, b) => b.length - a.length);
    const largest = sorted[0]!;
    const b = bbox(largest);
    const diagonal = Math.hypot(b.x1 - b.x0, b.y1 - b.y0) || 1;
    const cx = (b.x0 + b.x1) / 2;
    const cy = (b.y0 + b.y1) / 2;

    return sorted
        .filter((ring) => {
            const r = bbox(ring);
            const distance = Math.hypot((r.x0 + r.x1) / 2 - cx, (r.y0 + r.y1) / 2 - cy);
            return distance / diagonal <= 3;
        })
        .slice(0, 12);
}

/**
 * Silhouette en chemin SVG, projetée dans un carré de 100 unités.
 *
 * La longitude est resserrée par le cosinus de la latitude moyenne : sans cette
 * correction, la Norvège et le Chili s'écrasent en galette et deviennent
 * méconnaissables — c'est exactement l'indice que le jeu donne à voir.
 */
function outline(all: Ring[]): string {
    const kept = mainland(all);
    const points = kept.flat();
    const lats = points.map((p) => p[1]);
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const squeeze = Math.max(0.2, Math.cos((midLat * Math.PI) / 180));

    // Tolérance PROPORTIONNELLE à l'étendue du pays. Une valeur fixe en degrés
    // laissait la Russie intacte et transformait l'Allemagne en polygone à six
    // côtés : 0,35° pèse 4 % de l'Allemagne et 0,3 % de la Russie.
    const lons = points.map((p) => p[0]);
    const extent = Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats));
    const tolerance = Math.max(0.02, extent * 0.006);

    const projected = kept.map((ring) =>
        simplify(ring, tolerance).map(([lon, lat]) => [lon * squeeze, -lat] as [number, number]),
    );
    const flat = projected.flat();
    const xs = flat.map((p) => p[0]);
    const ys = flat.map((p) => p[1]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const width = Math.max(...xs) - minX;
    const height = Math.max(...ys) - minY;
    const scale = 100 / Math.max(width, height, 1e-6);

    // ⚠️ CENTRAGE dans le carré. La normalisation cale le plus GRAND côté sur
    // 100 ; l'autre reste plus court, et sans ce décalage le pays se colle au
    // bord gauche ou haut. Visible immédiatement sur la Corée du Sud, plus
    // haute que large, qui pendait à gauche du cadran.
    const padX = (100 - width * scale) / 2;
    const padY = (100 - height * scale) / 2;

    return projected
        .map(
            (ring) =>
                'M' +
                ring
                    .map(
                        ([px, py]) =>
                            `${((px - minX) * scale + padX).toFixed(1)} ${((py - minY) * scale + padY).toFixed(1)}`,
                    )
                    .join('L') +
                'Z',
        )
        .join('');
}

const geojson = JSON.parse(await readFile(SOURCE, 'utf8')) as {
    features: { properties: Record<string, string>; geometry: { type: string; coordinates: unknown } }[];
};

/**
 * Entités à écarter, avec leur raison.
 *
 * La question posée au joueur est « quel est ce pays ? ». Une règle explicite
 * vaut mieux qu'un arbitrage au cas par cas, qui deviendrait vite politique :
 * on garde ce qui SE GOUVERNE SOI-MÊME, on écarte les dépendances et les
 * territoires sans gouvernement propre. Taïwan et le Kosovo restent donc, les
 * collectivités et possessions non.
 */
const EXCLUDED: Record<string, string> = {
    AQ: 'Continent sans gouvernement, et silhouette reconnaissable entre mille.',
    TF: 'Îles subantarctiques éparses : injouable, et non autonome.',
    EH: 'Territoire non autonome au sens de l’ONU.',
    FK: 'Territoire britannique d’outre-mer.',
    GL: 'Territoire autonome du Danemark, pas un État.',
    NC: 'Collectivité française.',
    PR: 'Territoire des États-Unis.',
};

/** Les continents de Natural Earth, ramenés aux clés du dictionnaire. */
const CONTINENTS: Record<string, string> = {
    Africa: 'africa',
    Asia: 'asia',
    Europe: 'europe',
    'North America': 'northAmerica',
    'South America': 'southAmerica',
    Oceania: 'oceania',
};

/**
 * Silhouette du monde entier, en projection équirectangulaire.
 *
 * Sert de fond à la mini-carte de fin de partie : un seul chemin partagé par
 * les 168 pays, plutôt qu'une carte par pays. Simplifié beaucoup plus fort que
 * les silhouettes du jeu — à cette taille, le détail ne se voit pas et ne
 * ferait que peser.
 */
function worldPath(features: typeof geojson.features): string {
    const parts: string[] = [];
    for (const f of features) {
        for (const ring of rings(f.geometry)) {
            // Les îlots sous ce seuil disparaissent à l'écran : les garder
            // n'ajouterait que des octets.
            if (ring.length < 8) continue;
            const simple = simplify(ring, 0.9);
            if (simple.length < 4) continue;
            parts.push(
                'M' +
                    simple
                        .map(([lon, lat]) => `${(lon + 180).toFixed(1)} ${(90 - lat).toFixed(1)}`)
                        .join('L') +
                    'Z',
            );
        }
    }
    return parts.join('');
}

const countries = geojson.features
    .filter((f) => {
        const code = f.properties.ISO_A2_EH;
        // `-99` marque les entités sans code ISO : territoires contestés et
        // dépendances. Les exclure évite d'avoir à trancher des questions de
        // souveraineté dans un jeu.
        if (!code || code === '-99' || !f.properties.NAME_FR || !f.properties.NAME_EN) return false;
        if (code in EXCLUDED) {
            console.log(`build-countries: ${code} écarté — ${EXCLUDED[code]}`);
            return false;
        }
        return true;
    })
    .map((f) => {
        const all = rings(f.geometry);
        const largest = mainland(all)[0]!;
        return {
            code: f.properties.ISO_A2_EH!,
            names: {
                fr: f.properties.NAME_FR!,
                en: f.properties.NAME_EN!,
                es: f.properties.NAME_ES ?? f.properties.NAME_EN!,
                de: f.properties.NAME_DE ?? f.properties.NAME_EN!,
            },
            center: centroid(largest),
            path: outline(all),
            // Clé, pas un libellé : le continent est traduit dans les
            // dictionnaires, comme le reste de l'interface.
            continent: CONTINENTS[f.properties.CONTINENT!] ?? 'other',
            // Estimation Natural Earth. Sert à situer le pays en fin de partie,
            // pas à donner un chiffre exact — d'où l'arrondi à l'affichage.
            population: Number(f.properties.POP_EST) || 0,
        };
    })
    .sort((a, b) => a.code.localeCompare(b.code));

const source = `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Produit par \`npm run countries\` depuis Natural Earth 110m (domaine public).
//
// ${countries.length} pays. Pour chacun : son code ISO, son nom dans les quatre
// langues, le centre de sa masse principale, et sa silhouette en chemin SVG
// projetée dans un carré de 100 unités.

export type Continent =
    | 'africa'
    | 'asia'
    | 'europe'
    | 'northAmerica'
    | 'southAmerica'
    | 'oceania'
    | 'other';

export type Country = {
    code: string;
    names: { fr: string; en: string; es: string; de: string };
    /** [longitude, latitude] du centre de la masse principale. */
    center: [number, number];
    /** Chemin SVG dans un viewBox 0 0 100 100. */
    path: string;
    continent: Continent;
    /** Estimation Natural Earth, arrondie à l'affichage. */
    population: number;
};

export const COUNTRIES: readonly Country[] = ${JSON.stringify(countries, null, 0)};

`;

await writeFile(join(ROOT, 'src/data/countries.ts'), source);
console.log(
    `src/data/countries.ts — ${countries.length} pays, ${(Buffer.byteLength(source) / 1024).toFixed(0)} Ko`,
);

// Fichier SÉPARÉ : la carte ne sert qu'à l'écran de fin. La laisser dans
// `countries.ts` la ferait charger avec le jeu, alors qu'elle n'est utile
// qu'une fois la partie terminée.
const world = `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Produit par \`npm run countries\` depuis Natural Earth 110m (domaine public).

/**
 * Le monde entier en projection équirectangulaire, viewBox \`0 0 360 180\`.
 *
 * Un seul chemin pour tous les pays : la mini-carte de fin de partie s'en sert
 * de fond et n'y ajoute qu'un point. Simplifié beaucoup plus fort que les
 * silhouettes du jeu — à cette taille le détail ne se voit pas et ne ferait que
 * peser.
 */
export const WORLD_PATH = ${JSON.stringify(worldPath(geojson.features))};
`;

await writeFile(join(ROOT, 'src/data/world.ts'), world);
console.log(`src/data/world.ts — carte du monde, ${(Buffer.byteLength(world) / 1024).toFixed(0)} Ko`);
