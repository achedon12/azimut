/**
 * Noms usuels acceptés par la recherche, en plus du nom officiel.
 *
 * Écrits à la main : `NAME_ALT` de Natural Earth ne couvre que quatre pays, ce
 * qui ne sert à rien. La liste vise les confusions RÉELLES — personne ne tape
 * « Royaume-Uni », on tape « Angleterre » ; personne ne tape « États-Unis »,
 * on tape « USA ».
 *
 * Une seule liste pour les quatre langues : la comparaison ignore la casse et
 * les accents, et un joueur francophone peut très bien taper « holland ». Sur
 * un jeu à six essais, un essai perdu parce que le champ ne reconnaît pas le
 * nom qu'on connaît est la pire des frustrations.
 *
 * ⚠️ Les codes doivent exister dans `countries.ts` — Natural Earth 110m ignore
 * les micro-États. `npm run check:countries` refuse un alias orphelin, qui
 * serait invisible autrement.
 */
export const ALIASES: Record<string, readonly string[]> = {
    US: ['usa', 'us', 'etats unis', 'united states', 'america', 'amerique', 'estados unidos', 'vereinigte staaten'],
    GB: ['uk', 'angleterre', 'england', 'grande bretagne', 'great britain', 'britain', 'inglaterra', 'gran bretana', 'grossbritannien', 'ecosse', 'scotland', 'pays de galles', 'wales'],
    NL: ['hollande', 'holland', 'holanda', 'netherlands', 'pays bas'],
    CZ: ['republique tcheque', 'czech republic', 'czechia', 'republica checa', 'tschechien'],
    MM: ['birmanie', 'burma', 'myanmar'],
    CI: ['cote d ivoire', 'ivory coast', 'costa de marfil', 'elfenbeinkuste'],
    CD: ['congo kinshasa', 'rdc', 'zaire', 'drc', 'dr congo'],
    CG: ['congo brazzaville'],
    KR: ['coree du sud', 'south korea', 'corea del sur', 'sudkorea'],
    KP: ['coree du nord', 'north korea', 'corea del norte', 'nordkorea'],
    AE: ['emirats', 'uae', 'emirates', 'dubai', 'abu dhabi'],
    CH: ['suisse', 'switzerland', 'suiza', 'schweiz', 'helvetie'],
    DE: ['allemagne', 'germany', 'alemania', 'deutschland'],
    ES: ['espagne', 'spain', 'espana', 'spanien'],
    IT: ['italie', 'italy', 'italia', 'italien'],
    GR: ['grece', 'greece', 'grecia', 'griechenland', 'hellas'],
    SZ: ['swaziland', 'eswatini'],
    TL: ['timor oriental', 'east timor', 'timor leste'],
    MK: ['macedoine', 'macedonia', 'mazedonien'],
    TR: ['turquie', 'turkey', 'turkiye', 'turquia', 'turkei'],
    ZA: ['afrique du sud', 'south africa', 'sudafrica', 'sudafrika', 'rsa'],
    NZ: ['nouvelle zelande', 'new zealand', 'nueva zelanda', 'neuseeland'],
    PG: ['papouasie', 'papua', 'png'],
    DO: ['republique dominicaine', 'dominican republic', 'republica dominicana'],
    CF: ['centrafrique', 'central african republic', 'rca'],
    LA: ['laos'],
    VN: ['vietnam', 'viet nam'],
    TT: ['trinite', 'trinidad', 'trinidad et tobago'],
    BA: ['bosnie', 'bosnia', 'bosnien'],
    RU: ['russie', 'russia', 'rusia', 'russland'],
    CN: ['chine', 'china'],
    JP: ['japon', 'japan', 'japon', 'nippon'],
    IN: ['inde', 'india', 'indien'],
    EG: ['egypte', 'egypt', 'egipto', 'agypten'],
    MA: ['maroc', 'morocco', 'marruecos', 'marokko'],
    SA: ['arabie saoudite', 'saudi arabia', 'arabia saudi', 'saudi arabien'],
    IR: ['iran', 'perse', 'persia'],
    PS: ['palestine', 'palestina'],
    MD: ['moldavie', 'moldova', 'moldawien'],
    BY: ['bielorussie', 'belarus', 'bielorrusia', 'weissrussland'],
    LK: ['sri lanka', 'ceylan', 'ceylon'],
    ET: ['ethiopie', 'ethiopia', 'etiopia', 'athiopien', 'abyssinie'],
};
