export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://azimut.leoderoin.fr').replace(
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

export const MATOMO = {
    url: process.env.NEXT_PUBLIC_MATOMO_URL ?? '',
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? '',
} as const;
