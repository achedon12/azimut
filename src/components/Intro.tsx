import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';

/**
 * Le texte de présentation, sous le jeu.
 *
 * Tout le reste de l'accueil est produit par le navigateur : sans lui la page
 * ne compte que 66 mots indexables, ce qui ne se positionne sur rien.
 *
 * Placé APRÈS le jeu — un joueur qui revient ne doit pas avoir à le franchir.
 */
export function Intro({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
    const d = dictionary.intro;

    return (
        <section className="mx-auto w-full max-w-md border-t border-border-subtle px-5 py-8">
            <h2 className="text-base font-semibold tracking-tight">{d.heading}</h2>
            <div className="mt-3 flex flex-col gap-3 text-[0.85rem] leading-relaxed text-fg-muted">
                {d.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
            <Link
                href={path('rules', locale)}
                className="label mt-4 inline-flex items-center gap-1.5 text-accent no-underline hover:underline"
            >
                {d.rulesLink}
                <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
        </section>
    );
}
