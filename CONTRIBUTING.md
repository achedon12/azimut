# Contribuer

Merci d'être passé. Ce projet est petit et le restera : ça rend les
contributions plus faciles à relire, et les refus plus faciles à expliquer.

## Les trois contraintes

Elles ne sont pas négociables, et la plupart des idées refusées le sont parce
qu'elles en cassent une :

1. **Une partie par jour, la même pour tout le monde.** Le jour est calé sur
   l'heure de Paris. Les jours passés se rejouent depuis `/archives/`, mais ils
   ne comptent PAS dans la série : une série qu'on rattrape en enchaînant les
   archives ne mesure plus l'assiduité. Pas de mode entraînement infini, qui
   viderait le rituel.
2. **Aucun serveur.** Pas de base, pas d'API, pas de compte, pas de classement.
   Tout se calcule dans le navigateur à partir de la date.
3. **Quatre langues, toujours.** Un texte ajouté dans un seul dictionnaire fait
   échouer `npm run typecheck` — c'est voulu.

## Avant d'ouvrir une PR

```bash
npm run check
```

Puis, selon ce que tu as touché :

- **du texte** → les quatre dictionnaires (`src/i18n/dictionaries/`). `fr.ts`
  est la référence : les autres sont typés d'après lui ;
- **une page** → entrée dans `src/i18n/routes.ts`, dossier de route nommé
  d'après le slug **français**, et entrée dans `src/app/sitemap.ts` ;
- **l'affichage** → une capture en clair **et** en sombre. Les deux thèmes sont
  conçus, pas inversés l'un de l'autre ;
- **les couleurs** → relance Lighthouse. Le contraste se casse discrètement :
  une opacité en moins sur un gris déjà sourd suffit à passer sous 4.5:1, et ça
  ne se voit pas à l'œil ;
- **nginx** → construis l'image et vérifie les en-têtes réellement servis. Un
  `add_header` dans un `location` **annule** ceux du serveur ; c'est pour ça que
  chaque bloc inclut `security-headers.conf`.

## Ce qui se refuse d'avance

- un classement, un profil, une connexion ;
- une police, un script ou une image chargés depuis un autre domaine — la CSP
  n'autorise que `'self'` ;
- une dépendance de plus pour ce que dix lignes font déjà ;
- des commentaires qui redisent le code. On commente ce qui **casserait** si on
  l'ignorait, pas ce que la ligne dit déjà.

## Signaler un bug de partie

Précise la **date** et le **numéro de partie** (en haut à droite). Sans eux, un
bug de tirage ne se rejoue pas.

## Sécurité

Voir [SECURITY.md](SECURITY.md). Jamais dans une issue publique.
