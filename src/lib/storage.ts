const KEY = 'azimut:game';

export type Saved = { day: string; guesses: string[] };

/**
 * La partie en cours, conservée dans le navigateur.
 *
 * Le jour est stocké avec les essais : au changement de jour la sauvegarde est
 * ignorée plutôt qu'effacée, ce qui évite d'écrire au simple chargement.
 */
export function load(day: string): string[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const saved = JSON.parse(raw) as Saved;
        return saved.day === day && Array.isArray(saved.guesses) ? saved.guesses : [];
    } catch {
        // Stockage indisponible : on joue sans mémoire, ce qui reste jouable.
        return [];
    }
}

export function save(day: string, guesses: string[]): void {
    try {
        localStorage.setItem(KEY, JSON.stringify({ day, guesses } satisfies Saved));
    } catch {
        // Idem : l'échec d'écriture ne doit pas interrompre la partie.
    }
}
