'use client';

import { useEffect } from 'react';

/**
 * Enregistre le travailleur de service, qui rend le jeu jouable hors ligne.
 *
 * C'est cohérent avec le reste : le pays du jour se calcule dans le navigateur,
 * rien n'a besoin du réseau une fois la page chargée. Un joueur dans le métro
 * peut donc faire sa partie.
 *
 * L'échec est silencieux À DESSEIN : sans travailleur de service, le site
 * fonctionne exactement comme avant. Le signaler n'apprendrait rien au joueur.
 */
export function ServiceWorker() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        const register = () => {
            void navigator.serviceWorker.register('/sw.js').catch(() => {});
        };
        // Après le chargement : l'enregistrement entre sinon en concurrence
        // avec les requêtes du premier rendu.
        if (document.readyState === 'complete') register();
        else window.addEventListener('load', register, { once: true });
    }, []);

    return null;
}
