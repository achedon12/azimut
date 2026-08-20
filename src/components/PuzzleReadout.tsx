'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n/config';
import { formatDay } from '@/lib/daily';
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/gameStore';

/**
 * La date de la partie affichée, gravée sur la plaque.
 *
 * La date et non un numéro de partie : depuis que les jours passés se rejouent,
 * « partie n° 12 » n'apprend rien à qui cherche à savoir QUEL jour il regarde.
 *
 * Vide côté serveur : le jour dépend du fuseau et n'existe qu'après hydratation.
 */
export function PuzzleReadout({ locale }: { locale: Locale }) {
    const { day } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!day) return null;
    return <>{formatDay(day, locale, { day: 'numeric', month: 'short', year: 'numeric' })}</>;
}
