# Politique de sécurité

## Signaler une faille

**N'ouvre pas d'issue publique pour une faille de sécurité.** Une issue est
visible de tous, y compris de qui voudrait l'exploiter avant le correctif.

Deux canaux :

- l'onglet **Security → Report a vulnerability** de ce dépôt (avis de sécurité
  privé, canal préféré) ;
- à défaut, un courriel à **contact@leoderoin.fr** avec `[sécurité]` en objet.

Merci d'inclure de quoi reproduire : URL concernée, comportement observé,
comportement attendu, et l'impact que tu estimes.

Réponse sous 7 jours. Ce projet est maintenu sur du temps libre : la correction
peut prendre plus longtemps que l'accusé de réception.

## Périmètre

Azimut est **entièrement statique** : pas de base de données, pas d'API, pas de
session, pas de formulaire. La partie du jour est calculée dans le navigateur à
partir de la date, et les essais ne quittent jamais la machine du joueur. La
surface d'attaque se limite donc à :

- la **politique de sécurité du contenu** et les en-têtes servis par nginx
  (`nginx/security-headers.conf.template`) ;
- la **configuration du conteneur** (utilisateur non privilégié, système de
  fichiers en lecture seule, `no-new-privileges`) ;
- les **dépendances** de construction.

Connaître le pays du jour à l'avance n'est pas une faille : la table des pays
et l'algorithme de tirage sont publics et livrés au navigateur. C'est un jeu
sans classement — rien ne dépend de la confidentialité de la réponse.

## Versions maintenues

Seule la version en ligne sur https://azimut.leoderoin.fr l'est.
