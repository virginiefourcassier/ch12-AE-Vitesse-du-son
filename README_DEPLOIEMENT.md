# TP vitesse du son — Version hors Éléa

## Publier sur GitHub Pages

Publier **uniquement** `index.html`, les dossiers `images/`, `signaux/` et `donnees/`. Ne jamais publier `administration/` (contient le corrigé côté professeur).

La navigation et les documents fonctionnent dès la publication. Les 6 signaux numériques réels sont lus depuis `signaux/` : toutes les acquisitions sont à 22,2 °C. La distance inconnue (copie de 70 cm) n’est pas utilisée.

## Scores : ATTENTION

URL du déploiement de notation renseignée dans index.html le 11 octobre 2026. **Ne pas utiliser avant test de bout en bout** (réception, note, tentative et authentification). Pour vérifier la notation :
1. Créer un Google Sheet privé réservé aux scores, et un onglet `Scores` avec colonnes Horodatage / Identifiant / Classe / Tentative / Points / Maximum / Réponses / Reçu.
2. Copier le contenu du fichier `administration/Code_Apps_Script_NOTATION_PRIVE.gs` dans le projet Apps Script lié à ce Google Sheet.
3. Le `SPREADSHEET_ID` est déjà configuré pour le Google Sheet privé des scores créé dans votre Drive.
4. Déployer comme application web exécutée par le compte enseignant, en contrôlant les droits d’accès selon la politique de l’établissement.
5. URL `/exec` déjà reportée dans `CONFIG.scoresUrl` du fichier `index.html`.
6. Tester avec un identifiant fictif ; vérifier le retour de reçu et l’ajout d’une ligne.

**Attention :** sans authentification d’élèves, l’identifiant et les résultats soumis peuvent être usurpés. Ne pas utiliser les scores comme preuve d’identité ou pour une note officielle sans contrôle supplémentaire. Le score est calculé côté serveur, sans envoyer les corrigés au navigateur, mais le serveur peut recevoir des demandes automatiques non autorisées ; prévoir des restrictions ou un contrôle enseignant. La banque numérique d’origine a été exportée, mais les tirages aléatoires Moodle et les tests Genially ne sont pas reproduits intégralement.

## Mesures du groupe GitHub

La saisie collective ne fonctionne pas tant que le Google Form dédié et la synchronisation des deux feuilles professeur/élèves ne sont pas validés. Les deux groupes pédagogiques sont séparés pour la collecte, même s’ils exploitent les mêmes acquisitions du bureau. `CONFIG.formUrl` doit rester vide jusque-là.

## Comparaison avec Éléa

Voir `PLAN_MODIFICATIONS_ELEA.md`. Ne pas supprimer les activités existantes sans sauvegarde préalable.

## Vérifications

Certaines images externes et animations intégrées (Genially, H5P, SCORM) ne peuvent pas être reproduites fidèlement à partir du HTML seul ; leurs contenus et scores sont à vérifier en ouvrant les activités d'origine. Le livre Moodle est inclus dans l’onglet Documents. Pour les tests numériques, le texte, les images récupérables et les tolérances de correction proviennent du MBZ, mais la sélection exacte par tirage Moodle doit être contrôlée avant de parler de version équivalente.

## Création du Google Forms mesures

Depuis le Google Sheet PROF MESURES, ouvrir Extensions → Apps Script, coller le script privé `administration/Code_Apps_Script_FORMULAIRE_MESURES_PRIVE.gs`, exécuter `installerUneFois`. Après autorisation, l’onglet `Paramètres GitHub` contient le lien élèves. Copier cette URL dans `CONFIG.formUrl` du HTML. Le script synchronise le professeur et la seule synthèse élèves sans publier les mesures individuelles. Un test complet avec une mesure fictive doit être fait avant diffusion.
