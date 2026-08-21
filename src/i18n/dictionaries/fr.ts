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
        prevMonth: 'Mois précédent',
        nextMonth: 'Mois suivant',
        prevYear: 'Année précédente',
        nextYear: 'Année suivante',
        legendWon: 'Trouvé',
        legendLost: 'Non trouvé',
        legendPlaying: 'En cours',
        legendNew: 'À jouer',
        countPlayed: '{done} parties jouées sur {total}',
        note: 'Les parties passées ne comptent pas dans votre série : elle mesure les jours où vous êtes venu, pas le nombre de grilles remplies.',
    },
    intro: {
        heading: 'Un pays par jour, six essais',
        paragraphs: [
            'Azimut est un jeu de géographie quotidien. Chaque jour à minuit, un nouveau pays est tiré parmi les {count} du monde, et vous n’avez que sa silhouette pour le reconnaître. Aucune inscription, aucune application à installer : le jeu tient dans une page.',
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
    data: {
        heading: 'Vos données',
        body: 'Vos parties et vos statistiques restent dans ce navigateur et ne partent nulle part. Ce bouton les efface définitivement, sur cet appareil.',
        clear: 'Effacer mes données',
        confirm: 'Confirmer l’effacement',
        cancel: 'Annuler',
        done: 'Données effacées.',
    },
    footer: {
        madeBy: 'Créé par {author}',
        data: 'Données géographiques : Natural Earth, domaine public.',
        otherGames: 'Mes autres jeux',
        versionLabel: 'Version {version}',
    },
    changelog: {
        title: 'Nouveautés',
        heading: 'Ce qui a changé',
        lede: 'Les évolutions du jeu, de la plus récente à la plus ancienne.',
        metaDescription:
            'Les évolutions d’Azimut, version par version : nouvelles fonctionnalités, corrections et changements de règle. Le journal des modifications du jeu de géographie quotidien.',
        entries: [
            {
                version: '0.1.0',
                date: '2026-08-21',
                title: 'Première version',
                changes: [
                    'Le jeu : une silhouette de pays par jour, six essais, la distance et le cap à chaque proposition.',
                    'Les parties passées se rejouent depuis un calendrier, jusqu’au 1er janvier 2026.',
                    'Statistiques et série conservées dans le navigateur. Les archives ne comptent pas dans la série.',
                    'Fiche du pays en fin de partie : continent, population et situation sur la carte du monde.',
                    'Un indice facultatif après trois essais.',
                    'Quatre langues, thème clair et sombre, et le jeu reste jouable hors ligne.',
                ],
            },
        ],
        back: 'Jouer',
    },
    legal: {
        title: 'Mentions légales',
        heading: 'Mentions légales',
        lede: 'Les informations exigées par la loi pour un site accessible au public.',
        metaDescription:
            'Éditeur, hébergeur et conditions d’utilisation d’azimut.page, le jeu de géographie quotidien.',
        sections: [
            {
                title: 'Éditeur',
                body: 'Le site azimut.page est édité par {author}, à titre personnel et non commercial. Le directeur de la publication est l’éditeur lui-même.',
            },
            {
                title: 'Hébergeur',
                body: 'Le site est hébergé par {host}, {address}. Téléphone : {phone}. SIREN {registration}.',
            },
            {
                title: 'Contenu',
                body: 'Les textes et l’habillage de ce site sont l’œuvre de son éditeur. Les frontières des pays proviennent de Natural Earth, dans le domaine public. Les noms de pays sont ceux de cette même source.',
            },
            {
                title: 'Liens sortants',
                body: 'Ce site ne renvoie que vers jeux.leoderoin.fr, le site personnel de son auteur et le dépôt public du code. Il n’affiche aucune publicité et ne comporte aucun lien commercial ni affilié.',
            },
        ],
        contactTitle: 'Contact',
        contactBody: 'Pour toute question relative à ces mentions :',
        back: 'Jouer',
    },
    privacy: {
        title: 'Confidentialité',
        heading: 'Confidentialité',
        lede: 'Ce qui est mesuré, ce qui ne l’est pas, et où ça reste.',
        metaDescription:
            'Ce qui est mesuré sur Azimut, ce qui ne l’est pas, et ce qui reste dans votre navigateur. Aucun compte, aucun traqueur tiers, aucun cookie de mesure.',
        sections: [
            {
                title: 'Vos parties',
                body: 'Vos essais, vos statistiques et votre série sont conservés dans le stockage local de votre navigateur. Ils ne sont JAMAIS envoyés à un serveur : il n’y en a pas. Vous pouvez les effacer d’un bouton, depuis la page « à propos ».',
            },
            {
                title: 'Mesure d’audience',
                body: 'Le site utilise Matomo, installé sur le même serveur que lui. Sont enregistrés les pages consultées, la langue du navigateur, le type d’appareil et la page de provenance. Aucune donnée n’est transmise à un service tiers, et il n’y a ni régie publicitaire ni réseau social embarqué.',
            },
            {
                title: 'Cookies',
                body: 'Aucun. Matomo est configuré sans cookie et respecte le signal « Do Not Track » de votre navigateur, ce qui dispense ce site de bandeau de consentement. Votre choix de thème est conservé dans le stockage local, jamais envoyé au serveur.',
            },
            {
                title: 'Fonctionnement hors ligne',
                body: 'Un travailleur de service met en cache les fichiers du site pour qu’il reste jouable sans réseau. Il ne conserve que ces fichiers — aucune donnée vous concernant — et disparaît si vous effacez les données du site depuis votre navigateur.',
            },
            {
                title: 'Journaux du serveur',
                body: 'Comme tout serveur web, celui-ci conserve des journaux d’accès techniques : adresse IP, date, page demandée. Ils servent au diagnostic et à la sécurité, et ne sont exploités à aucune autre fin.',
            },
            {
                title: 'Vos droits',
                body: 'Vous pouvez demander l’accès aux données vous concernant, leur rectification ou leur effacement. La demande se fait par courriel et n’a pas besoin d’être motivée.',
            },
        ],
        contactTitle: 'Écrire',
        contactBody: 'Pour exercer vos droits ou poser une question :',
        back: 'Jouer',
    },
    continents: {
        africa: 'Afrique',
        asia: 'Asie',
        europe: 'Europe',
        northAmerica: 'Amérique du Nord',
        southAmerica: 'Amérique du Sud',
        oceania: 'Océanie',
        other: 'Ailleurs',
    },
    country: {
        continent: 'Continent',
        population: 'Population',
        located: 'Situation sur la carte du monde',
        hint: 'Un indice ?',
        hintReveal: 'Révéler le continent',
        hintGiven: 'Continent : {continent}',
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
