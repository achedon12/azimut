'use client';

import { useSyncExternalStore } from 'react';
import { Flame } from 'lucide-react';
import { format } from '@/i18n/format';
import { getStatsServerSnapshot, getStatsSnapshot, subscribeStats } from '@/lib/statsStore';

/**
 * La série en cours, gravée sur la plaque.
 *
 * Absente tant qu'elle vaut zéro : annoncer « série 0 » à quelqu'un qui arrive
 * pour la première fois découragerait au lieu d'accrocher.
 */
export function StreakBadge({ template }: { template: string }) {
    const stats = useSyncExternalStore(subscribeStats, getStatsSnapshot, getStatsServerSnapshot);
    if (stats.streak === 0) return null;

    return (
        <span
            className="numeric inline-flex items-center gap-1 rounded-full border border-accent/40 px-2 py-0.5 text-[0.65rem] text-accent"
            title={format(template, { count: stats.streak })}
        >
            <Flame aria-hidden="true" className="size-3" />
            {stats.streak}
            <span className="sr-only">{format(template, { count: stats.streak })}</span>
        </span>
    );
}
