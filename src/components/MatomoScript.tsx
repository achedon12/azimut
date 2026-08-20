import { MATOMO } from '@/lib/site';

/**
 * Mesure d'audience Matomo — branchée seulement si elle est configurée.
 *
 * Les constantes existaient déjà dans `site.ts` mais n'étaient utilisées nulle
 * part : il n'y avait aucune mesure. Des variables qui ne servent à rien
 * laissent croire que c'est en place.
 *
 * Sans cookie et en respectant « Do Not Track » : ce site n'a ni compte ni
 * publicité, il n'a donc aucune raison de suivre quiconque d'une visite à
 * l'autre — et c'est ce qui lui évite un bandeau de consentement.
 *
 * ⚠️ L'origine doit aussi figurer dans la CSP, via `__MATOMO_HOST__` dans
 * `nginx/security-headers.conf.template`. Sans elle, le navigateur bloque le
 * script sans rien dire dans la page.
 */
export function MatomoScript() {
    if (!MATOMO.url || !MATOMO.siteId) return null;

    const origin = MATOMO.url.replace(/\/$/, '');
    const snippet = `var _paq=window._paq=window._paq||[];_paq.push(['disableCookies']);_paq.push(['setDoNotTrack',true]);_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u='${origin}/';_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','${MATOMO.siteId}']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`;

    return <script dangerouslySetInnerHTML={{ __html: snippet }} />;
}
