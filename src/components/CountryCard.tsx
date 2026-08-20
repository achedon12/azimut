import type { Country } from '@/data/countries';
import { WORLD_PATH } from '@/data/world';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';

/**
 * La fiche du pays, révélée en fin de partie.
 *
 * C'est le moment où l'on apprend quelque chose : la silhouette seule ne dit
 * pas OÙ se trouve le pays, et c'est justement ce qui manquait à qui vient de
 * perdre. La carte transforme « je ne savais pas » en « ah, c'était là ».
 */
export function CountryCard({
    country,
    locale,
    dictionary,
}: {
    country: Country;
    locale: Locale;
    dictionary: Dictionary;
}) {
    const [lon, lat] = country.center;

    // Projection équirectangulaire : la carte est générée dans le même repère,
    // un simple décalage suffit à placer le point.
    const x = lon + 180;
    const y = 90 - lat;

    return (
        <figure className="flex w-full flex-col gap-2">
            {/* viewBox rognée : la projection descend jusqu'au pôle Sud, et
                l'Antarctique occuperait un quart de la hauteur pour rien. */}
            <svg
                viewBox="0 6 360 146"
                role="img"
                aria-label={`${dictionary.country.located} — ${country.names[locale]}`}
                className="w-full rounded-md bg-bg-sunken"
            >
                <path d={WORLD_PATH} className="fill-border-strong" />
                {/* Halo puis point : sur une carte à cette échelle, un point de
                    3 unités se perd dans le trait de côte. */}
                <circle cx={x} cy={y} r="11" fill="var(--accent)" opacity="0.25" />
                <circle cx={x} cy={y} r="4.5" fill="var(--accent)" />
                <circle cx={x} cy={y} r="4.5" fill="none" stroke="var(--bg)" strokeWidth="1.2" />
            </svg>

            <figcaption className="flex items-baseline justify-center gap-x-4 gap-y-1 text-[0.8rem] text-fg-muted">
                <span>{dictionary.continents[country.continent]}</span>
                {country.population > 0 && (
                    <span className="numeric">
                        {/* `compact` plutôt que le chiffre exact : « 67 M »
                            situe, « 67 059 887 » donne une fausse précision à
                            une estimation. */}
                        {new Intl.NumberFormat(locale, {
                            notation: 'compact',
                            maximumFractionDigits: 1,
                        }).format(country.population)}
                    </span>
                )}
            </figcaption>
        </figure>
    );
}
