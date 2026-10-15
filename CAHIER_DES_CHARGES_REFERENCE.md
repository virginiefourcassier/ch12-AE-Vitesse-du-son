# Référence pour les futurs HTML pédagogiques de Virginie Fourcassier

Cahier des charges demandé le 15 octobre 2026. À lire avant de recréer une activité à partir de ce modèle. Les nouvelles consignes explicites de l’enseignante prévalent. Ne pas transposer les paramètres propres à la vitesse du son à un autre chapitre sans les adapter.

## Source de vérité et méthode
- Modèle : dépôt virginiefourcassier/ch12-AE-Vitesse-du-son, fichier index.html, version de référence 8da547859329a61ecc23f7288ad4af43b1ab8e45 (blob 878c6084829e26e6bfaa0bdc39b649522ad5b776). Relire la version actuelle avant toute modification.
- Conserver les formulations, notations, images originales, liens, barèmes et contraintes validés. Ne jamais inventer un document reçu ou un test réussi.
- Un cahier des charges n’est pas une preuve que chaque fonction est opérationnelle : distinguer comportement du code, test local et réception réellement confirmée.
- Pour une nouvelle activité, réutiliser structure et principes, adapter contenu, données, identifiants et destinations de transmission. Ne pas réutiliser automatiquement les adresses de collecte de ce TP.
- Modifier directement le dépôt quand cela est demandé. Pas de HTML ni ZIP à télécharger sans nouvelle demande. Si un script à copier-coller est demandé, fournir sa version entière.
- Une instruction informatique à la fois lorsque l’enseignante doit agir. Réduire au minimum les manipulations des élèves.

## Présentation et navigation
- Français, niveau Seconde, lycée Pierre de Fermat à Toulouse ; signature « Virginie Fourcassier · Lycée Pierre de Fermat · Toulouse ».
- Police principale : Comic Sans MS, puis Arial, sans-serif ; corps 16 px, interligne 1,55. Formules : Cambria/Georgia/serif, environ 1,1 rem.
- Fond général #edf3f8 ; texte #1b314a ; bandeau dégradé #133d67 vers #3178ac ; titres #1b5586.
- Conteneur central de largeur maximale 1120 px ; panneaux blancs avec bord #dbe4ee, coins arrondis 15 px, ombre discrète, marge intérieure 26 px (14 px sur petit écran).
- Navigation supérieure fixe au défilement, accès direct aux onglets, état actif bleu #205f98 et texte blanc. Boutons précédent/suivant juste après le contenu, pas repoussés artificiellement au bas d’un écran de hauteur fixe.
- Modèle actuel : Accueil ; Histoire ; Documents ; Enregistrements LatisPro ; Notre expérience ; Résultats de la classe ; Présentation des résultats expérimentaux ; Évaluations ; Conclusion.
- Cartes courtes, objectifs et points essentiels dans des encadrés ; pas de gros boutons roses occupant inutilement la page. Ressources sous forme de vrais boutons/liens cliquables compacts.
- Images responsives, proportions conservées, légendes proches, texte alternatif utile ; chargement différé approprié.
- Disposition adaptée au mobile : colonnes empilées, boutons accessibles, pas de défilement horizontal inutile. Conserver un contraste lisible.
- Correction pédagogique : vert #00B050 sur jaune #FFFF00. Distinguer visuellement aide, essai à reprendre, correction et confirmation de réception.
- Retours dynamiques annoncés avec aria-live ; boutons de navigation désactivés aux extrémités ; sections masquées réellement cachées.
- Les tutoriels/vidéos externes ne sont chargés qu’au clic : ne pas déclencher une ressource ou une demande de mot de passe en ouvrant Documents.
- Dans les consignes destinées aux élèves hors Éléa, éviter les références techniques à Moodle et les détails de fonctionnement informatique inutiles.

## Progression pédagogique
- Introduction brève et contextualisée, objectif concret, progression du phénomène à la mesure puis au calcul et à l’interprétation.
- Documents en cinq étapes navigables : 1 Comprendre ; 2 Lire les signaux ; 3 Préparer le montage ; 4 Mesurer ; 5 Comparer.
- Présenter une notion avant de l’utiliser ; texte bref, schéma exact et légendé, exemple résolu, puis petite vérification et feedback explicatif.
- Réduire la charge de lecture ; information utile au voisinage de l’illustration ; possibilité de revenir aux documents pendant l’expérience.
- Les petits QCM de Documents ne sont pas notés. Ils vérifient une compréhension précise, avec distracteurs plausibles, sans ambiguïté scientifique.
- Ne pas promettre une conformité universelle « aux neurosciences ». Concevoir avec des principes explicitables : segmentation, guidage initial, articulation texte-image, rappel actif, feedback, autonomie progressive.
- Conserver les images créées/fournies par l’enseignante aux endroits liés à leur fonction. Ne pas remplacer systématiquement ces images par de nouvelles créations.

## Exigences scientifiques validées pour ce TP
- Distinguer date t et durée Δt ; célérité v = D/Δt, jamais v = D/t si t désigne une date.
- D en mètres, Δt en secondes pour v en m·s⁻¹. Si le retard est saisi en ms : v = 1000 D/Δt_ms.
- Le microphone convertit des variations de pression de l’air en signal électrique. Ne pas affirmer que la tension est proportionnelle à l’intensité sonore.
- Employer « représentation temporelle du signal » dans les explications, plutôt que « graphique » lorsque c’est la notion enseignée.
- Définition générale : une représentation temporelle représente l’évolution d’une grandeur physique au cours du temps ; la date t est en abscisse, sur l’axe horizontal. L’ordonnée n’est pas nécessairement une tension.
- Présenter ensuite le cas particulier : dans cette expérience, l’ordonnée est la tension U et chaque point associe une date à la tension mesurée.
- Placer cette définition dans Documents, partie 1, après la chaîne de mesure et avant le premier QCM.
- Illustration de lecture des axes : point P à t = 2,0 ms et U = 1,0 V, traits de projection vers les axes. Valeurs illustratives, non issues d’une mesure revendiquée.
- QCM sous la définition : « Quelle grandeur lit-on sur l’axe horizontal d’une représentation temporelle ? » Réponses : « La date t » / « La tension U ». Feedback conforme.
- Mesurer le retard avec deux variations correspondantes des signaux, pas obligatoirement les débuts. Exemple : les dates du premier pic vers le bas de chaque signal. Ne pas imposer les « plus grands sommets ».
- QCM sur le retard : relever les dates des premiers pics vers le bas sur chacun des signaux, et non leurs tensions. Δt = t₂ − t₁.
- Introduction courte validée : « Un clap, deux microphones… Une distance à mesurer, une durée à déterminer : quelle est la célérité du son dans l’air ? »
- Température 22,2 °C : au début de l’onglet Enregistrements LatisPro, pas à la fin d’Accueil.
- D est mesurée physiquement entre les microphones ; Δt est déterminée sur la représentation temporelle à l’écran. Les distinguer explicitement par texte et illustration.
- Exemple résolu : D = 0,680 m ; dates 1,20 ms et 3,20 ms ; Δt = 2,00 ms ; v = 3,40 × 10² m·s⁻¹.
- « Un écart avec la valeur de référence ne signifie absolument pas que l’expérience est ratée. » Examiner unités, distance, réticules, incertitudes et conditions.
- Écart relatif : |v_exp − v_ref| / v_ref × 100 %. Facultatif selon la progression ; ne remplace pas l’incertitude et ne suffit pas, seul, à décider de la compatibilité.
- Référence de célérité adaptée à la température et au milieu.
- Chiffres significatifs : produit/quotient au nombre de chiffres significatifs de la donnée qui en a le moins ; somme/différence au nombre de décimales de la donnée qui en a le moins, après mise dans la même unité. Éviter les arrondis intermédiaires.
- Protocole d’écriture de ce TP : incertitude-type arrondie par excès à un chiffre significatif ; moyenne au même rang ; bornes calculées avec ces valeurs arrondies, même unité/rang. u(moyenne) = s/√n pour des mesures indépendantes.
- Présenter ±u et l’encadrement comme une convention de présentation pédagogique, sans prétendre garantir que la valeur vraie est dans l’intervalle ni lui attribuer une probabilité universelle.

## Images et ressources du modèle
- images/document_1.png : chaîne clap → microphone → signal électrique, dans Comprendre.
- images/moodle_015.jpg : montage original (deux micros, distance, ordinateur et retard) ; le d de l’image correspond au D de l’activité. Le nom de fichier n’a pas à devenir une référence à Moodle dans le cours.
- images/clap_photo.png : représentation temporelle réelle LatisPro, pour lire les signaux.
- Exemple de mesure : montage et schéma temporel côte à côte, empilés sur mobile.
- Ne pas réinsérer sans correction l’ancienne infographie document_2.png qui associait tension et intensité sonore.
- Histoire : documents et images de Léonard de Vinci, Newton, Derham, Laplace, Colladon (mesure dans l’eau, lac Léman), Jules Verne. Vérifier historiquement toute nouvelle affirmation.

## Entraînement et collecte des mesures
- Les enregistrements LatisPro sont des données réelles fournies, pas des courbes inventées présentées comme réelles.
- Axe temporel étalonné automatiquement à partir des données numériques ; changement d’enregistrement efface les anciens réticules ; zoom temporel et bouton de remise à zéro.
- Sur une image fixe d’exercice, étalonnage manuel par deux graduations et durée connue, puis deux variations correspondantes. Ne pas confondre cette méthode avec l’étalonnage automatique des fichiers numériques.
- Notre expérience : chaque binôme renseigne uniquement ses mesures prises pendant l’expérience au bureau, pas toutes les valeurs de la classe ni celles de l’entraînement.
- Champs : classe, numéro de binôme, D en m, retard en ms ; accepter virgule ou point, nombres seuls ; validation des valeurs.
- Résultats collectifs : protéger les données individuelles ; ne pas exposer un tableur privé de notes ou des identités d’élèves dans le dépôt public.
- Statistiques : moyenne, écart-type expérimental, incertitude-type de la moyenne ; ne pas arrondir prématurément.
- Le HTML actuel prévoit une synthèse collective après rassemblement/vérification des mesures : ne pas annoncer un affichage collectif automatisé si l’intégration n’est pas mise en place et testée.

## Évaluations et réception des notes
- Quatre activités /5 pour un total /20 : Genially histoire ; Genially coup de tonnerre ; cinq exercices numériques ; présentation des résultats avec incertitude.
- NOM suivi du prénom (ex. MARTIN Léa) et classe, saisis une fois puis synchronisés dans les évaluations ; même identité partout. Ne pas demander aux élèves de fabriquer eux-mêmes un identifiant technique.
- Cinq exercices : deux célérités, deux distances et un retard, ordre aléatoire ; nombres décimaux seuls avec point/virgule, unité indiquée ; écriture scientifique non exigée pour la saisie de ces exercices.
- Deux Genially SCORM locaux sous scorm/history et scorm/thunder ; conserver le mécanisme de remontée des scores et l’accès à la fin après une mauvaise réponse. Vérifier les deux branches, sans conclure à partir du seul parcours parfait.
- SCORM 1.2, export Score/Points, Dynamic SCORM désactivé pour ces activités notées.
- Tentative identifiée techniquement, réception dédoublonnée, éviter les envois répétés pendant une vérification.
- Un envoi demandé ou une note locale n’est pas une réception confirmée : confirmation explicite du serveur et reçu distinct.
- Conserver les boutons de vérification qui n’envoient pas une seconde tentative.
- Correction accessible après envoi et délai prévu (5 s pour les exercices/présentation dans le code actuel). Si la réception n’est pas confirmée, le dire explicitement ; harmoniser les consignes avant toute évolution, car certaines phrases anciennes du HTML parlent encore d’une correction uniquement après confirmation.
- Ne pas effacer les données de collecte originales : garder Scores et créer/utiliser une Synthèse des notes séparée.
- Synthèse enseignante : tri par classe puis ordre alphabétique des noms, quatre notes /5 et total /20 ; meilleure note par élève et activité. À vérifier dans le tableur, ce réglage n’étant pas porté par le HTML seul.
- Configuration de réception actuelle dans CONFIG ; code serveur dans les dossiers professeur_apps_script et synthese_eleves_apps_script. Pour une nouvelle activité, vérifier déploiement, barème et schéma avant connexion ; ne pas écraser la collecte de ce TP.

## Vérification et publication
- Contrôler contenu, unités, schémas, images, boutons, feedbacks, navigation et affichage mobile.
- Ne pas modifier la remontée des scores à l’occasion d’une simple retouche pédagogique sans nécessité.
- Vérifier les traitements d’envoi et de confirmation sans transmettre de fausses notes sous une identité réelle.
- Après écriture GitHub, distinguer « enregistré dans le dépôt » et « publié sur le site ».
- Consulter le résultat GitHub Actions puis ouvrir le site et vérifier visiblement le texte modifié. Ne pas annoncer une publication réussie sur la seule base du commit.
- Incident du 14 octobre : build réussi, déploiement expiré après dix minutes, relance bloquée en file ; nouveau commit 8da54785 ayant déclenché une publication réussie (#58). Cause profonde non établie. Le site a été contrôlé avec définition générale et QCM sur l’abscisse.
- Ne pas simplement multiplier les relances ni attribuer sans preuve le problème au HTML ou à une panne générale de GitHub.
