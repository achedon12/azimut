import type { NextConfig } from 'next';
import { version } from './package.json';

const nextConfig: NextConfig = {
    env: { NEXT_PUBLIC_APP_VERSION: version },
    // Le jeu est entièrement client : aucune donnée serveur, aucune API. Next
    // produit donc du HTML complet par langue, servi tel quel par nginx.
    //
    // ⚠️ Ce mode DÉSACTIVE `headers()` : la CSP vit dans nginx, pas ici.
    output: 'export',
    trailingSlash: true,
    poweredByHeader: false,
    images: { unoptimized: true },
    experimental: { inlineCss: true, globalNotFound: true },
};

export default nextConfig;
