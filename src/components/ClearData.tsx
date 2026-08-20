'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { clearAll } from '@/lib/storage';

/**
 * Efface les parties et les statistiques conservées par le navigateur.
 *
 * En DEUX temps plutôt qu'avec `confirm()` : une boîte de dialogue native
 * bloque la page, se traduit mal et se distingue mal d'une fenêtre du
 * navigateur. Deux clics suffisent à écarter le geste accidentel.
 */
export function ClearData({ dictionary }: { dictionary: Dictionary }) {
    const d = dictionary.data;
    const [state, setState] = useState<'idle' | 'asking' | 'done'>('idle');

    if (state === 'done') {
        return (
            <p aria-live="polite" className="text-[0.9rem] text-fg-muted">
                {d.done}
            </p>
        );
    }

    if (state === 'asking') {
        return (
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        clearAll();
                        setState('done');
                        // Rechargement : les magasins gardent l'ancien contenu
                        // en mémoire, et l'écran mentirait jusqu'à la prochaine
                        // visite.
                        window.location.reload();
                    }}
                    className="label rounded-md px-4 py-2 text-accent-contrast"
                    style={{ background: 'var(--step-5)' }}
                >
                    {d.confirm}
                </button>
                <button
                    type="button"
                    onClick={() => setState('idle')}
                    className="label rounded-md border border-border-strong px-4 py-2 text-fg-muted"
                >
                    {d.cancel}
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setState('asking')}
            className="label inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2 text-fg-muted transition-colors hover:border-accent hover:text-fg"
        >
            <Trash2 aria-hidden="true" className="size-4" />
            {d.clear}
        </button>
    );
}
