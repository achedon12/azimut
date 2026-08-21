import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';
import { AUTHOR, HOST } from '@/lib/site';

const LINK = 'text-fg underline underline-offset-4';

/**
 * Remplace les jetons d'un paragraphe par leurs valeurs.
 *
 * Le nom de l'auteur devient un LIEN, les coordonnées de l'hébergeur du texte
 * simple. Les dictionnaires ne portent que des chaînes, et chaque langue place
 * ces éléments là où sa grammaire l'exige — découper la phrase en dur
 * marcherait en français et casserait ailleurs.
 */
function Filled({ template }: { template: string }) {
    const values: Record<string, string> = {
        host: HOST.name,
        address: HOST.address,
        phone: HOST.phone,
        registration: HOST.registration,
    };
    const parts = template.split(/(\{author\}|\{host\}|\{address\}|\{phone\}|\{registration\})/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part === '{author}') {
                    return (
                        <a key={i} href={AUTHOR.site} rel="author" className={LINK}>
                            {AUTHOR.name}
                        </a>
                    );
                }
                const token = part.startsWith('{') ? values[part.slice(1, -1)] : undefined;
                return <Fragment key={i}>{token ?? part}</Fragment>;
            })}
        </>
    );
}

/**
 * Page de texte à sections : mentions légales et confidentialité.
 *
 * La même forme que « à propos » — un intitulé, une réponse — parce que ces
 * pages répondent au même genre de question. Une seule vue plutôt que trois
 * presque identiques : leur mise en page n'a aucune raison de diverger.
 */
export function TextPageView({ locale, page }: { locale: Locale; page: 'legal' | 'privacy' }) {
    const d = getDictionary(locale);
    const copy = d[page];

    return (
        <article className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="text-3xl text-balance">{copy.heading}</h1>
            <p className="mt-3 text-lg text-fg-muted text-pretty">{copy.lede}</p>

            <dl className="mt-8 flex flex-col gap-6">
                {copy.sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-1.5">
                        <dt className="label text-fg-muted">{section.title}</dt>
                        <dd className="m-0 leading-relaxed text-pretty">
                            <Filled template={section.body} />
                        </dd>
                    </div>
                ))}

                <div className="flex flex-col gap-1.5">
                    <dt className="label text-fg-muted">{copy.contactTitle}</dt>
                    <dd className="m-0 leading-relaxed">
                        {copy.contactBody}{' '}
                        <a href={`mailto:${AUTHOR.email}`} className="text-accent underline underline-offset-4">
                            {AUTHOR.email}
                        </a>
                    </dd>
                </div>
            </dl>

            <Link
                href={path('home', locale)}
                className="label mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-accent-contrast no-underline"
            >
                {copy.back}
                <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
        </article>
    );
}
