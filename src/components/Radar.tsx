import { MAX_DISTANCE_KM } from '@/lib/geo';

export type Blip = { code: string; name: string; km: number; bearing: number; closeness: number; correct: boolean };

const R = 92; // Rayon du cadran, dans le repère du viewBox.

function step(closeness: number): string {
    if (closeness >= 90) return 'var(--step-5)';
    if (closeness >= 70) return 'var(--step-4)';
    if (closeness >= 45) return 'var(--step-3)';
    if (closeness >= 20) return 'var(--step-2)';
    return 'var(--step-1)';
}

/**
 * Le cadran de relèvement — l'écran entier du jeu.
 *
 * La cible est au CENTRE, et chaque proposition s'y place à son cap réel et à
 * une distance proportionnelle : on voit les essais converger, ce qu'une liste
 * de lignes ne montre jamais.
 *
 * ⚠️ Le repère SVG n'est pas celui d'une boussole : `y` descend, et l'angle
 * zéro pointe à l'est. D'où `sin` sur x et `-cos` sur y — un `cos/sin` naïf
 * placerait le nord à droite.
 */
export function Radar({
    path,
    blips,
    labels,
}: {
    path: string;
    blips: Blip[];
    labels: { n: string; e: string; s: string; w: string };
}) {
    const place = (km: number, bearing: number) => {
        const radius = Math.min(km / MAX_DISTANCE_KM, 1) * R;
        const angle = (bearing * Math.PI) / 180;
        return { x: 100 + radius * Math.sin(angle), y: 100 - radius * Math.cos(angle) };
    };

    return (
        <svg viewBox="-10 -12 220 224" aria-hidden="true" className="size-full">
            <defs>
                {/* Le puits donne au cadran sa profondeur : sans lui les
                    anneaux flottent sur un fond plat. */}
                <radialGradient id="well">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.16" />
                    <stop offset="0.55" stopColor="var(--accent)" stopOpacity="0.06" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="sweepFade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.30" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>

                {/* ⚠️ Le modelé joue sur l'OPACITÉ d'une seule teinte, jamais
                    sur deux couleurs. Un dégradé `--fg → --fg-muted` éteignait
                    le bas de la silhouette au point de déplacer sa masse perçue
                    de 28 px vers le haut : elle paraissait décentrée alors que
                    sa boîte englobante était exacte. */}
                <linearGradient id="landmass" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="var(--fg)" stopOpacity="1" />
                    <stop offset="1" stopColor="var(--fg)" stopOpacity="0.86" />
                </linearGradient>

                <filter id="halo" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
            </defs>

            <circle cx="100" cy="100" r={R} fill="url(#well)" />

            {/* Le cercle extérieur vaut la moitié de la circonférence
                terrestre — on ne peut pas être plus loin. */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
                <circle
                    key={f}
                    cx="100"
                    cy="100"
                    r={R * f}
                    fill="none"
                    stroke="var(--accent)"
                    strokeOpacity={f === 1 ? 0.34 : 0.16}
                    strokeWidth={f === 1 ? 1 : 0.6}
                />
            ))}

            <line x1="100" y1={100 - R} x2="100" y2={100 + R} stroke="var(--accent)" strokeOpacity="0.13" strokeWidth="0.6" />
            <line x1={100 - R} y1="100" x2={100 + R} y2="100" stroke="var(--accent)" strokeOpacity="0.13" strokeWidth="0.6" />

            {/* Points cardinaux, à l'extérieur du cadran. */}
            <text x="100" y={100 - R - 5} textAnchor="middle" className="numeric fill-fg-muted text-[9px]">{labels.n}</text>
            <text x={100 + R + 8} y="103" textAnchor="middle" className="numeric fill-fg-muted text-[9px]">{labels.e}</text>
            <text x="100" y={100 + R + 12} textAnchor="middle" className="numeric fill-fg-muted text-[9px]">{labels.s}</text>
            <text x={100 - R - 8} y="103" textAnchor="middle" className="numeric fill-fg-muted text-[9px]">{labels.w}</text>

            {/* Le halo détache la cible des anneaux : sans lui elle se lit
                comme un motif de fond parmi les graduations. */}
            <g transform="translate(58 58) scale(0.84)">
                <path d={path} fill="var(--accent)" opacity="0.55" filter="url(#halo)" />
                <path d={path} fill="url(#landmass)" />
            </g>

            {/* ⚠️ APRÈS la cible, jamais avant. Dessiné dessous, le sommet du
                faisceau disparaissait sous la silhouette : sa racine visible se
                déplaçait au fil de la rotation, puisque le pays n'est pas rond,
                et le balayage semblait pivoter à côté du centre. Un faisceau de
                radar passe par-dessus ce qu'il éclaire. */}
            <g className="sweep">
                <path d={`M100 100 L100 ${100 - R} A${R} ${R} 0 0 1 ${100 + R * 0.55} ${100 - R * 0.84} Z`} fill="url(#sweepFade)" />
                <line x1="100" y1="100" x2="100" y2={100 - R} stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="0.8" />
            </g>

            {blips.map((b) => {
                const { x, y } = place(b.km, b.bearing);
                const color = b.correct ? 'var(--win)' : step(b.closeness);
                return (
                    <g key={b.code}>
                        {/* Le trait montre le CAP ; une pastille seule ne
                            dirait que la distance. */}
                        <line x1="100" y1="100" x2={x} y2={y} stroke={color} strokeWidth="0.7" opacity="0.45" />
                        <circle cx={x} cy={y} r="7" fill={color} opacity="0.5" filter="url(#halo)" />
                        <circle cx={x} cy={y} r="3.4" fill={color} />
                        <circle cx={x} cy={y} r="6.5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
                    </g>
                );
            })}
        </svg>
    );
}
