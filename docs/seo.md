# Référencement

État vérifié le 20 août 2026, sur l'export statique servi par le conteneur de
production.

## Scores Lighthouse

| Catégorie | Score |
|---|---|
| Performance | 99 |
| Accessibilité | 100 |
| Bonnes pratiques | 100 |
| SEO | 100 |

Relancer après tout changement de mise en page, de police, de couleur ou de
configuration nginx :

```bash
docker compose -p azimut up -d --build
npx lighthouse@12 http://127.0.0.1:3007/ --preset=desktop --view
```

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
