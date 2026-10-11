# Installation du système de notes CH12 (Google Apps Script)

Les deux onglets de destination existent déjà dans le fichier privé :
- **Exercices numériques** : note sur 5 ;
- **Présentation des résultats** : note sur 5.

## Étape 1 — Installer le code (une seule fois)

1. Ouvrir le Google Sheets privé du professeur.
2. Menu **Extensions > Apps Script**.
3. Faire une copie de sauvegarde de l'ancien **Code.gs** si vous souhaitez le conserver.
4. Remplacer l'ancien code du projet lié au fichier par le contenu de `professeur_apps_script/Code.gs` (ne pas garder deux fonctions `doPost` ou `onOpen`).
5. **Enregistrer** le projet.

## Étape 2 — Déployer

1. **Déployer > Gérer les déploiements**.
2. Sélectionner le déploiement existant de l'application Web, puis **Modifier**.
3. Choisir **Nouvelle version** et déployer en tant que propriétaire ; accès aux destinataires requis pour que les élèves puissent transmettre les résultats.
4. Copier et conserver l'URL se terminant par `/exec`. Si elle change, il faudra aussi modifier la configuration `CONFIG.scoresUrl` du HTML GitHub.
5. **Avertir ChatGPT que le déploiement est terminé** pour autoriser `scoresV2Enabled:true` dans le HTML. Tant que cette option reste `false`, les boutons d'envoi ne transmettent rien.

## 🧹 Nettoyage des résultats, réservé au professeur

1. Actualiser le Google Sheets après l'installation du script.
2. Le menu **🧹 Effacer les résultats** apparaît en haut.
3. Choisir l'activité à effacer ou les deux, puis confirmer **Oui**.
4. Une option séparée peut également vider l'ancien onglet `Scores`.
5. Les en-têtes sont toujours conservés ; aucune suppression n'est lancée automatiquement.

## Tests

- Effectuer d'abord un essai avec l'identifiant `TEST-PROF`.
- Vérifier le reçu dans le navigateur et l'ajout d'une unique ligne au bon onglet.
- Ne jamais cliquer plusieurs fois sans vérifier la présence de la tentative dans le Google Sheets.
- Les anciens résultats de l'onglet `Scores` ne sont pas convertis automatiquement.

**Attention** : les retards mesurés par réticule sont fournis par le navigateur ; le serveur vérifie le calcul numérique mais n'a pas accès à un signal temporel de référence indépendant. Ne pas utiliser ce score comme vérification infaillible du positionnement des réticules.
