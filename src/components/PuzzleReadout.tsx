'use client';

import { useSyncExternalStore } from 'react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { puzzleNumber } from '@/lib/daily';
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/gameStore';

/** Le numéro de la partie du jour, gravé sur la plaque. Vide côté serveur :
 *  le jour dépend du fuseau et n'existe qu'après hydratation. */
export function PuzzleReadout({ locale }: { locale: Locale }) {
    const { day } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!day) return null;
    return <>{format(getDictionary(locale).game.puzzle, { number: puzzleNumber(day) })}</>;
}
