import { EMPTY, loadStats, record, saveStats, type Stats } from './stats';

/**
 * Les statistiques, tenues hors de React — même raison que `gameStore` : une
 * source de vérité unique, lue là où elle est plutôt que recopiée dans un état.
 */
const listeners = new Set<() => void>();

// ⚠️ Référence stable tant que rien ne change : un objet neuf à chaque lecture
// ferait boucler React indéfiniment.
let cache: Stats | null = null;

export function subscribeStats(listener: () => void): () => void {
    listeners.add(listener);
    const onStorage = () => {
        cache = null;
        listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
}

export function getStatsSnapshot(): Stats {
    if (!cache) cache = loadStats();
    return cache;
}

export function getStatsServerSnapshot(): Stats {
    return EMPTY;
}

export function recordResult(day: string, won: boolean, tries: number): void {
    const next = record(getStatsSnapshot(), day, won, tries);
    if (next === cache) return;
    cache = next;
    saveStats(next);
    for (const listener of listeners) listener();
}
