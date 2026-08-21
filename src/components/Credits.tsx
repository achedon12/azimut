import { Fragment } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { path } from '@/i18n/routes';
import { APP_VERSION, AUTHOR, HUB_URL } from '@/lib/site';

const linkClass =
    'text-fg no-underline underline-offset-2 transition-colors hover:text-accent hover:underline';

/** Le jeton `{author}` devient un lien. Découper la phrase en dur autour du
 *  nom marcherait en français et casserait dans les autres langues. */
function AuthorLine({ template }: { template: string }) {
    const parts = template.split('{author}');
    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>
                    {part}
                    {i < parts.length - 1 && (
                        <a href={AUTHOR.site} rel="author" className={linkClass}>
                            {AUTHOR.name}
                        </a>
                    )}
                </Fragment>
            ))}
        </>
    );
}

/**
 * La ligne de crédits, sous les commandes. En bas de casse et en petit corps,
 * pour que le bas de l'écran ne devienne pas un bloc de capitales.
 */
function Dot() {
    return (
        <span aria-hidden="true" className="text-border-strong">
            ·
        </span>
    );
}

export function Credits({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
    return (
        <div className="flex flex-col gap-1 text-[0.7rem] text-fg-muted">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <AuthorLine template={dictionary.footer.madeBy} />
                    <Dot />
                    {/* Le lien retour vers le panneau : c'est lui qui fait
                        circuler les joueurs d'un jeu à l'autre. */}
                    <a href={HUB_URL} className={linkClass}>
                        {dictionary.footer.otherGames}
                    </a>
                </span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{dictionary.footer.data}</span>
                    <Dot />
                    {/* Le numéro de version MÈNE au journal : c'est là qu'on
                        clique quand on se demande ce qui a changé, et ça évite
                        une entrée de plus dans une barre déjà chargée. */}
                    <Link href={path('changelog', locale)} className={`numeric ${linkClass}`}>
                        {format(dictionary.footer.versionLabel, { version: APP_VERSION })}
                    </Link>
                </span>
            </div>

            {/* Obligatoires, et attendues en pied de page : c'est là qu'on les
                cherche. */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link href={path('legal', locale)} className={linkClass}>
                    {dictionary.legal.title}
                </Link>
                <Dot />
                <Link href={path('privacy', locale)} className={linkClass}>
                    {dictionary.privacy.title}
                </Link>
            </div>
        </div>
    );
}
