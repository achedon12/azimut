const KEY = 'azimut:games';

/** Format d'avant les archives : une seule partie, celle du jour. */
const LEGACY_KEY = 'azimut:game';

/** Les essais de chaque jour joué, indexés par jour. */
export type Saved = Record<string, string[]>;

function parse(raw: string | null): Saved {
    if (!raw) return {};
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return {};
    const out: Saved = {};
    for (const [day, guesses] of Object.entries(value as Record<string, unknown>)) {
        // Ces données viennent du stockage, que l'utilisateur peut éditer et
        // qu'une version plus ancienne du jeu a pu écrire. Un tableau contenant
        // autre chose que des chaînes ferait planter la boucle des essais.
        if (Array.isArray(guesses) && guesses.every((g) => typeof g === 'string')) {
            out[day] = guesses;
        }
    }
    return out;
}

/**
 * Reprend une partie écrite avant les archives.
 *
 * L'ancienne clé ne gardait qu'un jour. Elle est relue une fois, versée dans la
 * nouvelle carte, puis effacée : sans ça, un joueur qui revient perdrait la
 * partie du jour au moment même où il ouvre la page.
 */
function migrate(): Saved {
    try {
        const raw = localStorage.getItem(LEGACY_KEY);
        if (!raw) return {};
        const old = JSON.parse(raw) as { day?: unknown; guesses?: unknown };
        localStorage.removeItem(LEGACY_KEY);
        if (typeof old.day === 'string' && Array.isArray(old.guesses)) {
            return { [old.day]: old.guesses.filter((g): g is string => typeof g === 'string') };
        }
    } catch {
        // Rien à reprendre : on repart d'une carte vide.
    }
    return {};
}

export function loadAll(): Saved {
    try {
        const current = parse(localStorage.getItem(KEY));
        const legacy = migrate();
        if (Object.keys(legacy).length === 0) return current;
        // La partie en cours l'emporte sur celle reprise de l'ancien format :
        // si les deux existent, la nouvelle est forcément la plus avancée.
        const merged = { ...legacy, ...current };
        saveAll(merged);
        return merged;
    } catch {
        // Stockage indisponible : on joue sans mémoire, ce qui reste jouable.
        return {};
    }
}

export function saveAll(games: Saved): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(games));
    } catch {
        // Idem : l'échec d'écriture ne doit pas interrompre la partie.
    }
}

/**
 * Efface tout ce que le jeu garde dans ce navigateur.
 *
 * Les clés sont nommées une à une plutôt que d'appeler `localStorage.clear()` :
 * le stockage est partagé par origine, et tout effacer emporterait aussi les
 * préférences d'un autre outil servi depuis le même domaine.
 */
export function clearAll(): void {
    try {
        for (const key of [KEY, LEGACY_KEY, 'azimut:stats']) localStorage.removeItem(key);
    } catch {
        // Stockage indisponible : il n'y a rien à effacer.
    }
}
