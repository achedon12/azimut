/** Une horloge partagée, à la seconde. Un seul intervalle, qui ne tourne que
 *  tant qu'un composant l'écoute. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let snapshot = 0;

export function subscribeClock(listener: () => void): () => void {
    listeners.add(listener);
    if (timer === undefined) {
        snapshot = Date.now();
        timer = setInterval(() => {
            snapshot = Date.now();
            for (const l of listeners) l();
        }, 1000);
    }
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            clearInterval(timer);
            timer = undefined;
        }
    };
}

export function getClock(): number {
    return snapshot;
}

/** Zéro côté serveur : le HTML livré ne peut pas contenir d'heure, sinon il
 *  serait périmé dès qu'il est mis en cache. Le composant affiche un gabarit
 *  tant que la valeur vaut zéro. */
export function getClockServerSnapshot(): number {
    return 0;
}
