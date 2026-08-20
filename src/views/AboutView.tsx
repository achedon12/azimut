import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';
import { ClearData } from '@/components/ClearData';
import { AUTHOR } from '@/lib/site';

/** Le jeton `{author}` devient un lien. Les dictionnaires ne portent que des
 *  chaînes, et chaque langue place le nom où sa grammaire l'exige. */
function WithAuthor({ template }: { template: string }) {
    const parts = template.split('{author}');
    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>
                    {part}
                    {i < parts.length - 1 && (
                        <a href={AUTHOR.site} rel="author" className="text-fg underline-offset-4 hover:underline">
                            {AUTHOR.name}
                        </a>
                    )}
                </Fragment>
            ))}
        </>
    );
}

export function AboutView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <article className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="text-3xl text-balance">{d.about.heading}</h1>
            <p className="mt-3 text-lg text-fg-muted text-pretty">{d.about.lede}</p>

            {/* Une liste de définitions : chaque bloc est un intitulé suivi de
                sa réponse, ce que <dl> décrit exactement. */}
            <dl className="mt-8 flex flex-col gap-6">
                {d.about.sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-1.5">
                        <dt className="label text-fg-muted">{section.title}</dt>
                        <dd className="m-0 leading-relaxed text-pretty">
                            <WithAuthor template={section.body} />
                        </dd>
                    </div>
                ))}

                <div className="flex flex-col gap-1.5">
                    <dt className="label text-fg-muted">{d.about.contactTitle}</dt>
                    <dd className="m-0 leading-relaxed">
                        {d.about.contactBody}{' '}
                        <a href={`mailto:${AUTHOR.email}`} className="text-accent underline-offset-4 hover:underline">
                            {AUTHOR.email}
                        </a>
                    </dd>
                </div>
            </dl>

            <Link
                href={path('home', locale)}
                className="label mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-accent-contrast no-underline"
            >
                {d.about.back}
                <ArrowRight aria-hidden="true" className="size-4" />
            </Link>

            {/* Les données du joueur vivent dans son navigateur : il doit
                pouvoir les reprendre. */}
            <section className="mt-10 border-t border-border-subtle pt-6">
                <h2 className="text-xl font-semibold tracking-tight">{d.data.heading}</h2>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-fg-muted">{d.data.body}</p>
                <div className="mt-4">
                    <ClearData dictionary={d} />
                </div>
            </section>
        </article>
    );
}
