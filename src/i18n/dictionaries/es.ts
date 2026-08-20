import type { Dictionary } from './fr';

export const es: Dictionary = {
    meta: {
        title: 'Azimut',
        titleTag: 'Azimut — el juego de geografía del día',
        description:
            'Adivina el país del día por su silueta. Cada intento te da la distancia y la dirección. Seis intentos, una partida al día, sin registro.',
        ogAlt: 'Azimut — adivina el país del día por su silueta',
        keywords: 'juego de geografía, país del día, juego diario, silueta de país, juego gratis',
        shortName: 'Azimut',
    },
    header: {
        skipToContent: 'Ir al contenido',
        brand: 'Azimut',
        navLabel: 'Navegación',
        navRules: 'Reglas',
        navAbout: 'Acerca de',
        languageLabel: 'Idioma',
        themeLabel: 'Tema',
        themeToggle: 'Tema: {mode}',
        themeSystem: 'Sistema',
        themeLight: 'Claro',
        themeDark: 'Oscuro',
    },
    game: {
        puzzle: 'Partida n.º {number}',
        prompt: '¿Qué país es este?',
        hint: 'Cada intento indica a qué distancia está el país y en qué dirección.',
        inputLabel: 'Nombre del país',
        placeholder: 'Escribe un país…',
        submit: 'Probar',
        attemptsLeft: 'Queda {count} intento',
        attemptsLeftPlural: 'Quedan {count} intentos',
        noMatch: 'Ningún país coincide',
        alreadyGuessed: 'Ya propuesto',
        won: '¡Acertado en {count}!',
        wonOne: '¡Acertado al primer intento!',
        lost: 'Sin intentos — era {country}',
        answerWas: 'La respuesta era {country}',
        nextIn: 'Próxima partida en {time}',
        share: 'Compartir mi resultado',
        copied: 'Copiado',
        distance: 'Distancia',
        direction: 'Rumbo',
        closeness: 'Proximidad',
        bullseye: 'Ya estás',
    },
    rules: {
        title: 'Reglas',
        heading: 'Cómo se juega',
        lede: 'Un país al día, el mismo para todos, seis intentos.',
        metaDescription:
            'Las reglas de Azimut: cómo leer la distancia y la dirección tras cada intento, cómo se calcula la proximidad y por qué todos juegan la misma partida cada día.',
        steps: [
            {
                title: 'La silueta',
                body: 'El contorno mostrado es el de un país real, a escala y en el sentido correcto. Nada se deforma para complicarlo.',
            },
            {
                title: 'Cada intento te acerca',
                body: 'Un intento te da tres cosas: la distancia en línea recta hasta el país buscado, el rumbo para alcanzarlo y una proximidad en porcentaje.',
            },
            {
                title: 'El rumbo es un rumbo de verdad',
                body: 'La flecha indica el rumbo inicial — el que seguiría un barco al partir. Sobre un globo, eso no es lo mismo que «arriba a la derecha en el mapa».',
            },
            {
                title: 'Una partida al día',
                body: 'Todos reciben el mismo país, calculado a partir de la fecha en hora de París. La siguiente llega a medianoche.',
            },
        ],
        back: 'Jugar',
    },
    about: {
        title: 'Acerca de',
        heading: 'Acerca de Azimut',
        lede: 'Un juego de geografía diario, sin cuenta y sin publicidad.',
        metaDescription:
            'Azimut, juego de geografía diario, gratuito, sin cuenta ni publicidad. De dónde vienen los datos, cómo se sortea el país del día y quién está detrás del sitio.',
        sections: [
            {
                title: 'De dónde vienen los mapas',
                body: 'Los contornos provienen de Natural Earth, un conjunto de datos cartográficos de dominio público. Se simplifican al construir para seguir siendo legibles en pequeño — nunca se deforman.',
            },
            {
                title: 'Lo que no se recopila',
                body: 'Sin cuenta, sin publicidad, sin rastreadores de terceros. Tu partida del día se guarda en tu navegador y no se envía a ninguna parte. La analítica es un Matomo autoalojado, sin cookies.',
            },
            {
                title: 'Quién lo hizo',
                body: '{author}, desarrollador. Azimut se suma a Push Your Luck y Hombres Lobo, reunidos en un panel común.',
            },
        ],
        contactTitle: 'Escribir',
        contactBody: 'Una frontera equivocada, una traducción torpe, una idea:',
        back: 'Jugar',
    },
    intro: {
        heading: 'Un país al día, seis intentos',
        paragraphs: [
            'Azimut es un juego de geografía diario. Cada día a medianoche se sortea un país entre los 175 del mundo, y solo cuentas con su silueta para reconocerlo. Sin registro y sin aplicación que instalar: el juego cabe en una sola página.',
            'En cada intento, el cuadrante muestra la distancia que te separa del país buscado y la dirección en la que se encuentra. Un intento lejano nunca se pierde: acota una región, y el siguiente se acerca. Ese vaivén entre distancia y rumbo es lo que sustituye al mapa.',
            'La partida es la misma para todo el mundo, estés donde estés: el día de juego sigue la hora de París, así puedes comparar tu resultado con tus amigos sin que nadie juegue por adelantado.',
        ],
        rulesLink: 'Leer las reglas completas',
    },
    stats: {
        title: 'Tus estadísticas',
        played: 'Partidas',
        winRate: 'Aciertos',
        streak: 'Racha',
        maxStreak: 'Récord',
        distribution: 'Distribución de intentos',
        streakBadge: 'Racha {count}',
        empty: 'Vuelve mañana para empezar una racha.',
    },
    footer: {
        madeBy: 'Creado por {author}',
        data: 'Datos geográficos: Natural Earth, dominio público.',
        otherGames: 'Mis otros juegos',
        versionLabel: 'Versión {version}',
    },
    compass: { n: 'norte', ne: 'noreste', e: 'este', se: 'sureste', s: 'sur', sw: 'suroeste', w: 'oeste', nw: 'noroeste' },
    notFound: {
        title: 'Página no encontrada',
        body: 'Esta dirección no corresponde a nada en este sitio.',
        back: 'Volver al juego',
    },
};
