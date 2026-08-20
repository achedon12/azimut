'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { Country } from '@/data/countries';
import type { GuessResult } from '@/lib/gameStore';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';

/** Sans accents ni casse : « perou » doit trouver « Pérou ». */
function fold(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();
}

export function GuessInput({
    countries,
    locale,
    dictionary,
    disabled,
    onGuess,
}: {
    countries: readonly Country[];
    locale: Locale;
    dictionary: Dictionary;
    disabled: boolean;
    onGuess: (code: string) => GuessResult;
}) {
    const [value, setValue] = useState('');
    const [active, setActive] = useState(0);
    const [notice, setNotice] = useState('');
    const listId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const matches = useMemo(() => {
        const needle = fold(value);
        if (!needle) return [];
        return countries
            .map((c) => ({ c, name: c.names[locale] }))
            .filter(({ name }) => fold(name).includes(needle))
            // Ce qui COMMENCE par la saisie remonte : en tapant « ir », on
            // cherche l'Iran ou l'Irlande, pas le Kiribati.
            .sort((a, b) => {
                const sa = fold(a.name).startsWith(needle) ? 0 : 1;
                const sb = fold(b.name).startsWith(needle) ? 0 : 1;
                return sa - sb || a.name.localeCompare(b.name, locale);
            })
            .slice(0, 6);
    }, [countries, locale, value]);

    function submit(code?: string) {
        const chosen = code ?? matches[active]?.c.code;
        if (!chosen) return;
        // Un pays déjà proposé était refusé en SILENCE : le champ se vidait
        // sans qu'aucune ligne n'apparaisse, ce qui se lit comme un bouton
        // cassé plutôt que comme un refus.
        setNotice(onGuess(chosen) === 'duplicate' ? dictionary.game.alreadyGuessed : '');
        setValue('');
        setActive(0);
        inputRef.current?.focus();
    }

    // Une saisie qui ne correspond à rien doit le dire elle aussi, sinon le
    // bouton reste désactivé sans raison apparente.
    const message = value.trim() !== '' && matches.length === 0 ? dictionary.game.noMatch : notice;

    return (
        <div className="relative">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                className="flex gap-2"
            >
                <div className="relative flex-1">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-muted"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        disabled={disabled}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setActive(0);
                            setNotice('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActive((i) => Math.min(i + 1, matches.length - 1));
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActive((i) => Math.max(i - 1, 0));
                            } else if (e.key === 'Escape') {
                                setValue('');
                            }
                        }}
                        // Motif « combobox » : le champ annonce qu'il pilote une
                        // liste, et laquelle de ses options est active. Sans
                        // ces attributs, un lecteur d'écran ne voit qu'un champ
                        // de texte ordinaire et les suggestions n'existent pas.
                        role="combobox"
                        aria-expanded={matches.length > 0}
                        aria-controls={listId}
                        aria-autocomplete="list"
                        aria-activedescendant={
                            matches.length > 0 ? `${listId}-${active}` : undefined
                        }
                        aria-label={dictionary.game.inputLabel}
                        placeholder={dictionary.game.placeholder}
                        autoComplete="off"
                        className="w-full rounded-md border border-border-strong bg-bg-elevated py-3 pr-3 pl-10 text-[0.95rem] outline-none transition-colors placeholder:text-fg-muted focus:border-accent disabled:opacity-50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={disabled || matches.length === 0}
                    className="label rounded-md bg-accent px-5 text-accent-contrast transition-opacity disabled:opacity-30"
                >
                    {dictionary.game.submit}
                </button>
            </form>

            <p aria-live="polite" className="mt-1 h-4 text-[0.75rem] text-fg-muted">
                {message}
            </p>

            {matches.length > 0 && (
                <ul
                    id={listId}
                    role="listbox"
                    aria-label={dictionary.game.inputLabel}
                    className="absolute top-full z-20 mt-1.5 w-full overflow-hidden rounded-md border border-border-strong bg-bg-elevated shadow-lg"
                >
                    {matches.map(({ c, name }, index) => (
                        <li
                            key={c.code}
                            id={`${listId}-${index}`}
                            role="option"
                            aria-selected={index === active}
                            onMouseDown={(e) => {
                                // `mousedown` et non `click` : le champ perdrait
                                // le focus avant que le clic n'aboutisse, et la
                                // liste se fermerait sous le curseur.
                                e.preventDefault();
                                submit(c.code);
                            }}
                            onMouseEnter={() => setActive(index)}
                            className={`cursor-pointer px-3 py-2 text-[0.95rem] ${
                                index === active ? 'bg-bg-sunken font-medium' : ''
                            }`}
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
