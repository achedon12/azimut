export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://azimut.page').replace(
    /\/$/,
    '',
);

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';

export const AUTHOR = {
    name: 'Léo Deroin',
    site: 'https://leoderoin.fr',
    github: 'https://github.com/achedon12',
    email: 'contact@leoderoin.fr',
} as const;

/** Le panneau qui liste les jeux. Le lien retour que le hub attend. */
export const HUB_URL = 'https://jeux.leoderoin.fr';

/**
 * L'hébergeur, nommé dans les mentions légales — OBLIGATOIRE en France pour un
 * site accessible au public.
 *
 * Les valeurs par défaut sont celles de LordHosting. Les variables ne servent
 * qu'à les surcharger si l'hébergeur change, sans reconstruire la table.
 */
export const HOST = {
    name: process.env.NEXT_PUBLIC_HOST_NAME || 'LordHosting, SASU au capital de 1 000 €',
    address:
        process.env.NEXT_PUBLIC_HOST_ADDRESS || '5 square Frédéric Vallois, 75015 Paris, France',
    phone: process.env.NEXT_PUBLIC_HOST_PHONE || '06 01 21 24 27',
    registration: process.env.NEXT_PUBLIC_HOST_SIREN || '105 383 988 (RCS Paris)',
} as const;

export const MATOMO = {
    url: process.env.NEXT_PUBLIC_MATOMO_URL ?? '',
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? '',
} as const;
