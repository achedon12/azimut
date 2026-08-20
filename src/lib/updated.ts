import type { RouteKey } from '@/i18n/routes';

/**
 * Dernière modification de fond de chaque page, écrite à la main.
 *
 * Surtout pas une date de construction : elle bougerait à chaque déploiement
 * sans qu'un mot ait changé, et les moteurs ignorent les `lastmod` peu fiables.
 *
 * ⚠️ À modifier EN MÊME TEMPS que le texte de la page.
 */
export const UPDATED: Record<RouteKey, string> = {
    home: '2026-08-20',
    rules: '2026-08-20',
    about: '2026-08-20',
    archives: '2026-08-20',
};
