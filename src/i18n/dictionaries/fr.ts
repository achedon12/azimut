// Dictionnaire de RÉFÉRENCE. Les autres langues sont typées d'après lui :
// ajouter une clé ici et l'oublier ailleurs casse `npm run typecheck`.
export const fr = {
    meta: {
        title: 'Azimut',
        titleTag: 'Azimut — le jeu de géographie du jour',
        description:
            'Devinez le pays du jour à sa silhouette. Chaque proposition vous donne la distance et la direction. Six essais, une partie par jour, sans inscription.',
        ogAlt: 'Azimut — devinez le pays du jour à sa silhouette',
        keywords: 'jeu géographie, pays du jour, jeu quotidien, silhouette pays, jeu gratuit',
        shortName: 'Azimut',
    },
    header: {
        skipToContent: 'Aller au contenu',
        brand: 'Azimut',
        navLabel: 'Navigation',
        navRules: 'Règles',
        navAbout: 'À propos',
        navArchives: 'Archives',
        languageLabel: 'Langue',
        themeLabel: 'Thème',
        themeToggle: 'Thème : {mode}',
        themeSystem: 'Système',
        themeLight: 'Clair',
        themeDark: 'Sombre',
    },
    game: {
        puzzle: 'Partie n° {number}',
        prompt: 'Quel est ce pays ?',
        hint: 'Chaque proposition indique la distance et la direction du pays à trouver.',
        inputLabel: 'Nom du pays',
        placeholder: 'Tapez un pays…',
        submit: 'Proposer',
        attemptsLeft: '{count} essai restant',
        attemptsLeftPlural: '{count} essais restants',
        noMatch: 'Aucun pays ne correspond',
        alreadyGuessed: 'Déjà proposé',
        won: 'Trouvé en {count} !',
        wonOne: 'Trouvé du premier coup !',
        lost: 'Perdu — c’était {country}',
        answerWas: 'La réponse était {country}',
        nextIn: 'Prochaine partie dans {time}',
        share: 'Partager mon résultat',
        copied: 'Copié',
        distance: 'Distance',
        direction: 'Direction',
        closeness: 'Proximité',
        archiveNotice: 'Partie du {date}',
        archiveExcluded: 'Cette partie passée ne compte pas dans votre série.',
        backToToday: 'Revenir à aujourd’hui',
        seeArchives: 'Voir les parties passées',
        bullseye: 'Vous y êtes',
    },
    rules: {
        title: 'Règles',
        heading: 'Comment on joue',
        lede: 'Un pays par jour, le même pour tout le monde, six essais.',
        metaDescription:
            'Les règles d’Azimut : lire la distance et la direction après chaque proposition, comprendre la proximité, et pourquoi la partie est la même pour tous.',
        steps: [
            {
                title: 'La silhouette',
                body: 'Le contour affiché est celui d’un pays réel, à l’échelle et dans le bon sens. Rien n’est déformé pour corser la chose.',
            },
            {
                title: 'Chaque proposition vous rapproche',
                body: 'Une proposition vous donne trois choses : la distance à vol d’oiseau jusqu’au pays cherché, la direction à suivre pour l’atteindre, et une proximité en pourcentage.',
            },
            {
                title: 'La direction est un vrai cap',
                body: 'La flèche indique l’azimut initial — le cap qu’un navire suivrait au départ. Sur un globe, ce n’est pas la même chose que « en haut à droite sur la carte ».',
            },
            {
                title: 'Une partie par jour',
                body: 'Tout le monde a le même pays, calculé à partir de la date en heure de Paris. La partie suivante arrive à minuit.',
            },
        ],
        back: 'Jouer',
    },
    about: {
        title: 'À propos',
        heading: 'À propos d’Azimut',
        lede: 'Un jeu de géographie quotidien, sans compte et sans publicité.',
        metaDescription:
            'Azimut, jeu de géographie quotidien, gratuit, sans compte ni publicité. D’où viennent les données, comment le pays du jour est tiré, et qui est derrière le site.',
        sections: [
            {
                title: 'D’où viennent les cartes',
                body: 'Les contours proviennent de Natural Earth, un jeu de données cartographiques du domaine public. Ils sont simplifiés à la construction pour rester lisibles à petite taille — jamais déformés.',
            },
            {
                title: 'Ce qui n’est pas collecté',
                body: 'Aucun compte, aucune publicité, aucun traqueur tiers. Votre partie du jour est conservée dans votre navigateur et n’est jamais envoyée nulle part. La mesure d’audience est un Matomo auto-hébergé, sans cookie.',
            },
            {
                title: 'Qui l’a fait',
                body: '{author}, développeur. Azimut rejoint Push Your Luck et Loups-Garous, réunis sur un panneau commun.',
            },
        ],
        contactTitle: 'Écrire',
        contactBody: 'Une erreur de frontière, une traduction bancale, une idée :',
        back: 'Jouer',
    },
    archives: {
        title: 'Les parties passées',
        lede: 'Toutes les parties depuis le premier jour. Rien ne se périme.',
        metaDescription:
            'Rejouez n’importe quelle partie d’Azimut depuis le premier jour. Un pays par jour, six essais, et les jours manqués restent jouables aussi longtemps que le site existe.',
        heading: 'Rejouer un jour passé',
        today: 'Aujourd’hui',
        statusWon: 'Trouvé en {count}',
        statusWonOne: 'Trouvé du premier coup',
        statusLost: 'Non trouvé',
        statusPlaying: 'En cours',
        statusNew: 'Jamais jouée',
        countPlayed: '{done} parties jouées sur {total}',
        note: 'Les parties passées ne comptent pas dans votre série : elle mesure les jours où vous êtes venu, pas le nombre de grilles remplies.',
    },
    intro: {
        heading: 'Un pays par jour, six essais',
        paragraphs: [
            'Azimut est un jeu de géographie quotidien. Chaque jour à minuit, un nouveau pays est tiré parmi les 175 du monde, et vous n’avez que sa silhouette pour le reconnaître. Aucune inscription, aucune application à installer : le jeu tient dans une page.',
            'À chaque proposition, le cadran affiche la distance qui vous sépare du pays cherché et la direction dans laquelle il se trouve. Un essai lointain n’est donc jamais perdu — il délimite une région, et le suivant s’en rapproche. C’est ce va-et-vient entre distance et cap qui remplace la carte.',
            'La partie est la même pour tout le monde, où que vous soyez : le jour de jeu est calé sur l’heure de Paris, ce qui permet de comparer son résultat avec ses amis sans que personne ne joue en avance.',
        ],
        rulesLink: 'Lire les règles en détail',
    },
    stats: {
        title: 'Vos statistiques',
        played: 'Parties',
        winRate: 'Réussite',
        streak: 'Série',
        maxStreak: 'Record',
        distribution: 'Répartition des essais',
        streakBadge: 'Série {count}',
        empty: 'Revenez demain pour lancer une série.',
    },
    footer: {
        madeBy: 'Créé par {author}',
        data: 'Données géographiques : Natural Earth, domaine public.',
        otherGames: 'Mes autres jeux',
        versionLabel: 'Version {version}',
    },
    compass: { n: 'nord', ne: 'nord-est', e: 'est', se: 'sud-est', s: 'sud', sw: 'sud-ouest', w: 'ouest', nw: 'nord-ouest' },
    notFound: {
        title: 'Page introuvable',
        body: 'Cette adresse ne correspond à rien sur ce site.',
        back: 'Retour au jeu',
    },
} as const;

// `as const` fige chaque chaîne en type littéral : sans élargissement, aucune
// traduction ne serait assignable. Widen ne conserve donc que la FORME.
type Widen<T> = T extends string
    ? string
    : T extends readonly (infer Item)[]
      ? readonly Widen<Item>[]
      : { [Key in keyof T]: Widen<T[Key]> };

export type Dictionary = Widen<typeof fr>;
