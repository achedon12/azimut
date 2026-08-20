const R = 6371; // Rayon terrestre moyen, en kilomètres.

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Distance orthodromique entre deux points, en kilomètres.
 *
 * Haversine, et non une distance euclidienne sur latitude/longitude : celle-ci
 * se trompe de 3 000 km près des pôles, où un degré de longitude ne vaut plus
 * qu'une poignée de kilomètres.
 */
export function distanceKm([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): number {
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
}

/**
 * Azimut initial vers la cible, en degrés depuis le nord.
 *
 * Un `atan2` sur les écarts de coordonnées indiquerait le nord-est pour un
 * trajet qui, sur le globe, part plein nord.
 */
export function bearing([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): number {
    const dLon = rad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(rad(lat2));
    const x =
        Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
        Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(dLon);
    return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** La moitié de la circonférence : deux points ne peuvent pas être plus loin. */
export const MAX_DISTANCE_KM = Math.round(Math.PI * R);

/**
 * Proximité en pourcentage.
 *
 * Racine carrée plutôt que linéaire : elle étire le haut de l'échelle, là où
 * se joue la fin de la partie.
 */
export function closeness(km: number): number {
    return Math.round(100 * (1 - Math.sqrt(Math.min(km, MAX_DISTANCE_KM) / MAX_DISTANCE_KM)));
}

/** Les huit secteurs, du nord au nord-ouest. */
export const COMPASS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;

export type Compass = (typeof COMPASS)[number];

export function sector(bearingDeg: number): Compass {
    return COMPASS[Math.round(bearingDeg / 45) % 8]!;
}
