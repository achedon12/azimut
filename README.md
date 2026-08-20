# Azimut

Un jeu de géographie quotidien. Une silhouette de pays, six essais, et à chaque
proposition la **distance** et le **cap** qui vous séparent de la réponse.

**→ [azimut.leoderoin.fr](https://azimut.leoderoin.fr)**

Le même pays pour tout le monde, chaque jour, sans compte et sans publicité.

---

## Ce que c'est techniquement

Un site **entièrement statique**. Pas de base de données, pas d'API, pas de
session. Le pays du jour est déduit de la date par une permutation
déterministe, calculée dans le navigateur : deux joueurs à l'autre bout du
monde tombent sur le même pays sans qu'aucun serveur n'ait à le leur dire.

Les essais vivent dans le `localStorage` et n'en sortent jamais.

| | |
|---|---|
| Cadre | Next.js 16, App Router, `output: 'export'` |
| Styles | Tailwind CSS v4, thème clair/sombre/système |
| Langues | français, anglais, espagnol, allemand — slugs traduits |
| Données | Natural Earth 110m (domaine public), simplifié à la construction |
| Production | une image nginx de 26 Mo, sans privilèges, en lecture seule |

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3004
```

Ou dans Docker, pour retrouver la version de Node de la production :

```bash
docker compose -p azimut -f docker-compose.dev.yml up -d --build
```

## Vérifier

```bash
npm run check        # typecheck, lint, build
```

`npm run build` régénère au passage `nginx/redirects.conf` depuis
`src/i18n/routes.ts`, puis élague `out/404/` et `out/_not-found/` — deux URL
qui répondraient 200 et que Google compte comme des erreurs.

## Mettre en production

```bash
cp .env.example .env         # puis renseigner NEXT_PUBLIC_SITE_URL
docker compose -p azimut up -d --build
```

⚠️ Les variables `NEXT_PUBLIC_*` sont **inlinées à la construction**. Les passer
au démarrage du conteneur n'a aucun effet : une `NEXT_PUBLIC_SITE_URL` fausse
donne un site qui s'affiche parfaitement et se référence sur le mauvais domaine.

Le conteneur écoute sur `127.0.0.1:3007` et attend un proxy inverse devant lui
pour le TLS.

## Régénérer la table des pays

```bash
npm run countries    # scripts/build-countries.mts -> src/data/countries.ts
```

Le script projette chaque pays dans un carré de 100 unités, écarte les
territoires trop éloignés de la masse principale — la Guyane pour la France,
par exemple — et adapte la simplification à la taille du pays. Chaque silhouette
sort centrée sur (50, 50), ce que la CI vérifie.

## Structure

```
src/
  app/          routes (deux layouts racines : / et /[locale]/)
  components/   Radar, Console, GuessInput, StatsPanel…
  data/         countries.ts — GÉNÉRÉ, ne pas modifier à la main
  i18n/         dictionnaires et table des slugs traduits
  lib/          géodésie, tirage du jour, stockage, référencement
  views/        GameView, RulesView, AboutView
nginx/          configuration servie en production
scripts/        génération des pays, des redirections, des images de partage
```

## Licence

MIT — voir [LICENSE](LICENSE).

Les frontières viennent de [Natural Earth](https://www.naturalearthdata.com/),
dans le domaine public.
