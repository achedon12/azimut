'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import { format } from '@/i18n/format';
import { THEME_COLORS } from '@/lib/theme';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';

// Un seul bouton qui fait défiler les trois états, au lieu de trois boutons
// côte à côte. L'icône affiche l'état COURANT et le nom accessible le dit à
// voix haute : c'est ce qui rend un bouton cyclique honnête, sans quoi son
// état est deviné.
const ORDER: Theme[] = ['system', 'light', 'dark'];

// `localStorage` est un état EXTÉRIEUR à React : le lire dans un effet pour le
// recopier dans un `useState` marche, mais duplique la source de vérité et se
// désynchronise entre deux onglets. `useSyncExternalStore` le lit là où il est.
//
// C'est aussi ce qui rend l'hydratation correcte sans bricolage : React se sert
// de l'instantané SERVEUR pour le premier rendu — « système », comme le HTML
// livré — puis rebascule sur la valeur réelle.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    // L'événement `storage` ne se déclenche QUE dans les autres onglets : d'où
    // la liste d'abonnés, qui couvre l'onglet courant.
    window.addEventListener('storage', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

function getSnapshot(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'system';
    } catch {
        // Stockage indisponible (navigation privée, cookies bloqués) :
        // « système » reste un défaut valable.
        return 'system';
    }
}

function getServerSnapshot(): Theme {
    return 'system';
}

function applyTheme(next: Theme) {
    try {
        if (next === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // Le thème s'applique quand même, il ne survivra pas au rechargement.
    }

    if (next === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);

    // La barre d'adresse doit suivre le clic, pas le rechargement suivant. En
    // « système », chaque balise retrouve la couleur de SA requête média —
    // c'est l'attribut `media` qui dit laquelle, pas l'ordre du document.
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
        const scheme = meta.media.includes('dark') ? 'dark' : 'light';
        meta.content = next === 'system' ? THEME_COLORS[scheme] : THEME_COLORS[next];
    }

    for (const listener of listeners) listener();
}

export function ThemeToggle({ dictionary }: { dictionary: Dictionary }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const Icon = { system: Monitor, light: Sun, dark: Moon }[theme];
    const modeLabel = {
        system: dictionary.header.themeSystem,
        light: dictionary.header.themeLight,
        dark: dictionary.header.themeDark,
    }[theme];
    const label = format(dictionary.header.themeToggle, { mode: modeLabel });

    return (
        <button
            type="button"
            onClick={() => applyTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system')}
            title={label}
            className="flex size-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-sunken hover:text-fg"
        >
            <Icon aria-hidden="true" className="size-[1.05rem]" strokeWidth={2} />
            <span className="sr-only">{label}</span>
        </button>
    );
}
