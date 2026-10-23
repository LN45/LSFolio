# LSFolio

Apprendre la **Langue des Signes Française (LSF)** en vidéo, un signe à la fois.

LSFolio est une application web installable (PWA) qui propose environ 500 signes filmés, rangés par thèmes, avec des favoris, un suivi de progression et des quiz. Elle fonctionne sur téléphone comme sur ordinateur, et reste utilisable hors ligne pour les vidéos déjà regardées.

👉 Version en ligne : https://ln45.github.io/LSFolio/

---

## Ce que fait l'application

### Parcourir les signes
- **Accueil** : un *signe du jour* (le même pour tout le monde une journée donnée), la liste des thèmes et le nombre de signes connus au total.
- **Recherche** : un champ de recherche tolérant aux accents et aux ligatures (« soeur » trouve « Sœur »).
- **Thèmes** : 18 thèmes (salutations, famille, émotions, couleurs, nourriture, animaux, transports, école, bibliothèque…), chacun avec sa couleur, son emoji et une barre de progression. Les signes non classés vont dans « Autres mots ».

### Regarder un signe
- La vidéo se lit automatiquement, en boucle et sans le son.
- Boutons **Rejouer**, **Pause / Lecture** et **🐢 Ralenti** (vitesse ×0,5). Le ralenti est mémorisé d'un signe à l'autre et d'une visite à l'autre.
- Navigation vers le signe **précédent / suivant** du même thème.
- Chaque vidéo affiche son **crédit** (auteur et licence) quand la licence l'exige.

### Favoris et progression
- **♡ Favoris** : on ajoute un signe à ses favoris depuis sa page ; la page *Favoris* les regroupe.
- **Vu / connu** : un signe est marqué « vu » dès qu'on ouvre sa page. On peut le cocher « Je connais ce signe » à la main, ou il passe automatiquement en « connu » après **3 bonnes réponses d'affilée** au quiz.

### Quiz
- Une vidéo s'affiche, il faut retrouver le bon mot parmi **4 propositions** ; une partie compte **10 questions**.
- On peut réviser **tous les signes**, **ses favoris** ou **un thème**.
- Les signes ratés ou jamais interrogés reviennent en priorité (avec une part de hasard).
- Les mauvaises réponses proposées viennent d'abord du même thème, pour rendre le quiz plus exigeant.

### Données personnelles
Favoris et progression sont enregistrés **uniquement dans le navigateur** (IndexedDB). Aucun compte, aucun serveur : rien n'est envoyé sur internet, mais les données ne se synchronisent pas d'un appareil à l'autre.

### Installation et hors ligne
- Sur Chrome / Edge, un bouton **Installer** permet d'ajouter LSFolio comme une application. Sur iPhone : *Partager → Sur l'écran d'accueil*.
- L'application elle-même (HTML, JS, CSS, icônes) est disponible hors ligne.
- Chaque vidéo regardée est gardée en cache (jusqu'à 300 vidéos, environ 1 Mo chacune) et peut donc être revue sans connexion.

---

## Origine des vidéos

Les vidéos proviennent du projet [Lingua Libre](https://lingualibre.org/) et sont hébergées sur [Wikimedia Commons](https://commons.wikimedia.org/) (fichiers `LL-Q33302 (fsl)-…`, Q33302 étant l'identifiant Wikidata de la LSF). Elles sont sous licences libres (CC0, CC BY, CC BY-SA). Le nom de la personne qui signe et la licence sont affichés sous chaque vidéo avec un lien vers la page Commons du fichier.

---

## Installation technique

### Prérequis
- [Node.js](https://nodejs.org/) **24** (version utilisée pour la publication) et npm.
- Git.

### Récupérer et lancer le projet

```bash
git clone https://github.com/LN45/LSFolio.git
cd LSFolio
npm install
npm run dev
```

Le serveur de développement affiche l'adresse à ouvrir, de la forme `http://localhost:5173/LSFolio/` (le chemin `/LSFolio/` est imposé par la configuration, voir plus bas).

### Scripts npm

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement Vite avec rechargement à chaud. |
| `npm run build` | Vérification des types (`vue-tsc`) puis construction de la version de production dans `dist/`. |
| `npm run preview` | Sert localement le contenu de `dist/` pour tester la version construite (service worker compris). |
| `npm run type-check` | Vérification des types TypeScript seule. |
| `npm run import-videos` | Réimporte la liste des vidéos depuis Wikimedia Commons (voir ci-dessous). |
| `npm run generate-pwa-assets` | Régénère les icônes PWA de `public/` à partir de `public/logo.svg`. |

> Le service worker n'est actif qu'en production : pour tester le hors ligne ou l'installation, utiliser `npm run build` puis `npm run preview`.

### Technologies

- **[Vue 3](https://vuejs.org/)** (Composition API, `<script setup>`) et **TypeScript**
- **[Vue Router](https://router.vuejs.org/)** en mode *hash* (`#/signe/bonjour`) : GitHub Pages ne sait pas rediriger les URL inconnues vers `index.html`, le `#` garantit qu'un lien partagé s'ouvre toujours.
- **[Vite](https://vite.dev/)** pour le développement et la construction.
- **[Dexie](https://dexie.org/)** pour la base IndexedDB locale (favoris et progression).
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** + **Workbox** pour le manifeste et le service worker.

### Organisation du code

```
├── .github/workflows/deploy.yml   Publication automatique sur GitHub Pages
├── public/                        Logo et icônes PWA
├── scripts/import-videos.mjs      Import des vidéos depuis Wikimedia Commons
├── pwa-assets.config.ts           Configuration de la génération des icônes
├── vite.config.ts                 Configuration Vite et manifeste PWA
└── src/
    ├── main.ts / App.vue          Point d'entrée et mise en page générale
    ├── sw.ts                      Service worker (cache de l'appli et des vidéos)
    ├── router/                    Routes de l'application
    ├── views/                     Pages : accueil, thème, signe, favoris, quiz, page introuvable
    ├── components/                Lecteur vidéo, crédit de la vidéo, pastilles d'état d'un signe
    ├── composables/               Favoris, progression, installation PWA, titre de page, requêtes Dexie réactives
    ├── data/
    │   ├── videos-commons.json    Liste des vidéos (générée par le script d'import)
    │   ├── themes.ts              Thèmes et classement des signes par thème
    │   ├── signes.ts              Assemblage vidéos + thèmes
    │   └── catalogue.ts           Recherche, signe du jour, accès aux signes et thèmes
    ├── db/                        Schéma de la base IndexedDB (Dexie)
    ├── quiz/creerQuiz.ts          Tirage des questions et des mauvaises réponses
    └── styles/main.css            Styles globaux
```

### Pages (routes)

| URL | Page |
| --- | --- |
| `#/` | Accueil : recherche, signe du jour, thèmes |
| `#/theme/:themeId` | Liste des signes d'un thème |
| `#/signe/:signeId` | Vidéo et actions sur un signe |
| `#/favoris` | Mes favoris |
| `#/quiz` | Choix du quiz |
| `#/quiz/:source` | Quiz (`tous`, `favoris` ou un identifiant de thème) |

### Mettre à jour les vidéos

```bash
npm run import-videos
```

Le script interroge l'API de Wikimedia Commons, liste tous les fichiers `LL-Q33302 (fsl)-*.webm` et réécrit `src/data/videos-commons.json`. Au passage il :
- corrige quelques coquilles connues dans les titres ;
- écarte les enregistrements de test, les doublons numérotés et les signes au sens incertain (titres avec « ? ») ;
- quand un même mot est signé par plusieurs personnes, garde la vidéo à la licence la moins contraignante (CC0 > domaine public > CC BY > CC BY-SA).

Les nouveaux signes arrivent dans « Autres mots ». Pour les ranger dans un thème, ajouter leur identifiant dans `classement` de [src/data/themes.ts](src/data/themes.ts).

### Données locales (IndexedDB)

Base `lsfolio`, deux tables :
- `favoris` : `signeId`, `ajouteLe` ;
- `progression` : `signeId`, `vuLe`, `connu`, et pour le quiz `reussites`, `echecs`, `serie` (bonnes réponses d'affilée).

Seuls les champs indexés sont déclarés dans le schéma : ajouter un champ non indexé ne demande pas de nouvelle version de la base.

### Cache des vidéos

Les navigateurs lisent les vidéos par morceaux (requêtes `Range`, réponses 206), qu'on ne peut pas mettre en cache telles quelles. Le service worker ([src/sw.ts](src/sw.ts)) télécharge donc chaque vidéo **en entier une seule fois**, la garde dans le cache `lsfolio-videos-v1`, puis découpe lui-même les morceaux demandés. Au-delà de 300 vidéos, les plus anciennes sont supprimées.

### Publication

Chaque `push` sur `main` déclenche le workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) : `npm ci`, `npm run build`, puis publication de `dist/` sur **GitHub Pages**. Le workflow peut aussi être lancé à la main depuis l'onglet *Actions*.

Pré-requis côté GitHub (une seule fois) : *Settings → Pages → Source : GitHub Actions*.

L'application est servie sous `/LSFolio/` (option `base` de [vite.config.ts](vite.config.ts)). Si le dépôt change de nom, ou pour un hébergement à la racine d'un domaine, adapter cette valeur.

### Icônes

Les icônes PWA de `public/` sont générées à partir de `public/logo.svg` avec `npm run generate-pwa-assets`. Les icônes *maskable* (Android) et Apple ont un fond violet `#5b4bdb` car le système les recadre.
