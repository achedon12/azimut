# Référencement

État vérifié le 20 août 2026, sur l'export statique servi par le conteneur de
production.

## Scores Lighthouse

Mesurés sur le CONTENEUR de production, pas sur un serveur de fichiers : gzip et
en-têtes de cache changent tout, et c'est ce que PageSpeed Insights verra.

| Catégorie | Bureau | Mobile |
|---|---|---|
| Performance | **100** | 95 – 98 |
| Accessibilité | **100** | **100** |
| Bonnes pratiques | **100** | **100** |
| SEO | **100** | **100** |

Vérifié sur six pages : accueil, règles, archives, à propos, plus une page
anglaise et une allemande.

### Pourquoi la performance mobile plafonne sous 100

Le déficit vient ENTIÈREMENT du plus grand rendu (LCP) tel que Lighthouse le
*simule* sur un profil 4G lente avec un processeur quatre fois ralenti. La
valeur OBSERVÉE est de 59 ms : la page peint immédiatement.

Deux expériences délimitent le problème :

- retirer le préchargement de la police mono, qui ne sert qu'aux chiffres et
  disputait la bande passante à la police de texte : 95 → 99 sur l'accueil ;
- retirer TOUTE police web : 99, LCP 2,1 s. Le plafond n'est donc pas la
  typographie — il tient au TTFB simulé (452 ms) et au poids du jeu lui-même,
  qui embarque les 168 pays pour pouvoir calculer la partie sans serveur.

Trois pistes ont été essayées et écartées, mesures à l'appui : `font-display:
optional` (96, le blocage initial retarde le premier rendu), retirer aussi le
préchargement de la police de texte (95, le premier rendu passe de 0,8 à 1,4 s),
et réduire le CSS (déjà à 100 sur `unused-css-rules`).

Ce qui a été retenu : sous-ensemble des polices aux graisses 400–700 et au latin
utilisé (−23 % et −34 %), cibles navigateurs modernes pour supprimer les
polyfills, et préchargement de la seule police de texte.

## Ce qui est en place

**17 pages** : 4 langues × (jeu, règles, archives, à propos), plus `404.html`.

Les parties passées vivent sur l'accueil, en paramètre `?d=AAAA-MM-JJ`. Pas de
route par jour : elles se compteraient par milliers au fil des ans, pour des
pages au contenu quasi identique. La canonique de l'accueil les rassemble.

- `<title>` de 13 à 38 caractères, description de 130 à 167 ;
- canonique sur chaque page, en forme **avec barre finale** — `trailingSlash:
  true` l'impose, et une canonique qui s'en écarte déclare une URL que le
  serveur redirige ;
- 5 `hreflang` par page (4 langues + `x-default`). React les sérialise en
  `hrefLang` : c'est correct, les noms d'attributs HTML sont insensibles à la
  casse ;
- Open Graph et Twitter complets, avec une image de partage **par langue** ;
- données structurées : `WebSite` + `Person` + `VideoGame` liés par `@id` sur
  les accueils, `BreadcrumbList` sur les 8 pages annexes ;
- `sitemap.xml` servi en `application/xml`, `robots.txt`, `manifest.webmanifest`.

## Pièges déjà rencontrés

**Le sitemap ne doit pas déclarer `alternates`.** Ils ajoutent des
`xhtml:link`, et Chrome désactive son visualiseur XML dès qu'un document
contient l'espace de noms XHTML : le plan s'affiche alors en texte brut, ou se
télécharge. Les `hreflang` sont déjà dans le `<head>` de chaque page.

**Un bloc `types { }` en nginx REMPLACE toute la table MIME du contexte** au
lieu de l'étendre. Posé au niveau du serveur, il fait perdre à `.xml` son type
et le sitemap part en téléchargement. Il est donc porté par la seule
`location = /sitemap.xml`.

**Un `add_header` dans un `location` annule tous ceux du serveur.** D'où
`security-headers.conf`, inclus dans chaque bloc qui pose un en-tête. Sans ça,
les cinq en-têtes de sécurité disparaissent des pages HTML.

**`out/404/` et `out/_not-found/` répondent 200.** `next build` les écrit à côté
de `404.html`, et ce sont des URL crawlables que Google compte comme des « soft
404 ». `scripts/prune-export.mts` les retire ; la CI vérifie qu'ils ne
reviennent pas.

**Le `^~` sur `/_next/static/` est obligatoire.** Sans lui, nginx continue
d'évaluer les locations en expression régulière — qui l'emportent sur un
préfixe simple — et les polices `.woff2` tombent dans la règle des 30 jours au
lieu d'un an.

**Le contraste se casse en silence.** `text-fg-muted/70` sur un gris déjà sourd
donne 3:1 en thème clair. Toute modification de couleur exige un passage
Lighthouse avant d'être considérée comme faite.

## Contenu

L'accueil ne contenait que **66 mots indexables** : tout le reste du jeu est
produit par le navigateur, et une page aussi maigre ne se positionne sur rien.
Le bloc `Intro`, sous le jeu, la porte à 211 mots — et sert aussi de réponse à
un visiteur qui fait défiler avant de jouer.

## Restant à faire

- vérification de la propriété dans Google Search Console une fois le DNS en
  place ;
- lien retour depuis `jeux.leoderoin.fr` et depuis les deux autres jeux.
