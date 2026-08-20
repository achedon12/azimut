import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { path } from '@/i18n/routes';

export function RulesView({ locale }: { locale: Locale }) {
    const d = getDictionary(locale);

    return (
        <article className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="text-3xl font-semibold text-balance">{d.rules.heading}</h1>
            <p className="mt-3 text-lg text-fg-muted text-pretty">{d.rules.lede}</p>

            {/* Une liste de définitions : chaque bloc est un intitulé suivi de
                sa réponse, ce que <dl> décrit exactement. */}
            <dl className="mt-8 flex flex-col gap-6">
                {d.rules.steps.map((step) => (
                    <div key={step.title} className="flex flex-col gap-1.5">
                        <dt className="text-lg font-semibold">
                            {step.title}
                        </dt>
                        <dd className="m-0 leading-relaxed text-fg-muted text-pretty">{step.body}</dd>
                    </div>
                ))}
            </dl>

            <Link
                href={path('home', locale)}
                className="mt-8 inline-flex items-center gap-2 label rounded-md bg-accent px-5 py-3 text-accent-contrast no-underline"
            >
                {d.rules.back}
                <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
        </article>
    );
}
