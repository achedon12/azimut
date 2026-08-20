/**
 * Travailleur de service d'Azimut.
 *
 * Le site est entièrement statique et le pays du jour se calcule dans le
 * navigateur : une fois les fichiers en cache, le jeu tourne sans réseau.
 *
 * Deux stratégies, et le choix compte :
 *
 * — Les fichiers de `/_next/static/` portent un condensat dans leur nom. Leur
 *   contenu ne change JAMAIS à URL constante : le cache est donc consulté en
 *   premier, sans même tenter le réseau.
 *
 * — Les pages HTML passent par le RÉSEAU d'abord. Servir une page en cache
 *   d'abord ferait tourner une version périmée du jeu après un déploiement,
 *   sans aucun moyen pour le joueur de s'en apercevoir. Le cache ne sert que
 *   de filet quand le réseau ne répond pas.
 */
const CACHE = 'azimut-v1';

self.addEventListener('install', (event) => {
    // La coquille minimale, pour que le tout premier chargement hors ligne
    // affiche autre chose que l'erreur du navigateur.
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/'])).catch(() => {}));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
            .then(() => self.clients.claim()),
    );
});

async function fromCacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(CACHE);
        void cache.put(request, response.clone());
    }
    return response;
}

async function fromNetworkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE);
            void cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        // Une adresse jamais visitée retombe sur l'accueil : le jeu du jour y
        // est jouable, ce qui vaut mieux qu'une page d'erreur.
        if (cached) return cached;
        const home = await caches.match('/');
        if (home) return home;
        throw error;
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    // Uniquement notre propre origine : la mesure d'audience et tout ce qui
    // vient d'ailleurs doit passer directement.
    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(fromCacheFirst(request));
        return;
    }

    event.respondWith(fromNetworkFirst(request));
});
