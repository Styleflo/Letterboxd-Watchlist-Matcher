# Letterboxd Watchlist Matcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Trouvez les films que vous et vos amis avez vraiment envie de regarder ensemble!  
**Letterboxd Watchlist Matcher** compare les watchlists de plusieurs profils Letterboxd pour trouver les films en commun, qu'ils soient partagés par l'ensemble du groupe ou par une partie de vos amis.

*Lire dans d'autres langues : [English](README.md).*

---

## Fonctionnalités
_Toue la logique est faite par moi, le frontend et les visuels sont fait par ia_

- **Intersection multi-utilisateurs** : Ajoutez 2 profils Letterboxd ou plus pour analyser et croiser leurs watchlists respectives.
- **Résultats par niveaux (Tiers)** : Affichez les films partagés par tous les participants, ainsi que ceux partagés par des sous-groupes (par exemple 3 amis sur 4).
- **Interface sombre inspirée de Letterboxd** : Design moderne et soigné développé avec React, Tailwind CSS et les icônes Lucide, respectant l'identité visuelle de Letterboxd. (fait par ia)
- **Détails interactifs des films** : Cliquez sur n'importe quel film pour consulter son synopsis, son année de sortie, son affiche, ses genres, sa durée et le lien direct vers sa fiche Letterboxd.

---

## Presentation

https://github.com/user-attachments/assets/d022ad82-e2fb-45f1-8543-323b2ded39fc

---

## Stack Technique

### Frontend
- **Framework** : React 18 avec TypeScript
- **Bundler & Outillage** : Vite
- **Styles** : Tailwind CSS
- **Icônes** : Lucide React
- **Tests** : Vitest + React Testing Library

### Backend
- **Framework** : FastAPI
- **Langage** : Python 3.10+
- **Récupération des données** : [letterboxdpy](https://github.com/nmcassa/letterboxdpy)
- **Validation des données** : Pydantic v2
- **Monitoring** : Sentry SDK

---

## Installation et Lancement Local

### Prérequis
- **Node.js** (v18 ou supérieur) & **npm**
- **Python** (3.10 ou supérieur)

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-nom-utilisateur/letterboxd-app.git
cd letterboxd-app
```

### 2. Configuration du Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
pip install -r requirements.txt
```

Lancer le serveur de développement FastAPI :
```bash
uvicorn api.index:app --reload --port 8000
```
L'API sera accessible sur `http://localhost:8000` (documentation interactive Swagger disponible sur `http://localhost:8000/api/docs`).

### 3. Configuration du Frontend
Dans un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```
L'application web sera disponible sur `http://localhost:5173`.

---

## Lancer les Tests

### Tests unitaires et d'intégration Frontend
```bash
cd frontend
npm test
```
Pour exécuter les tests en continu (mode watch) :
```bash
npm run test:watch
```

---

## Déploiement

Le projet est préconfiguré pour un déploiement multi-services sur **Vercel** via le fichier [`vercel.json`](vercel.json) :
- Les routes `/api/*` sont prises en charge par le service backend FastAPI.
- Toutes les autres routes sont servies par l'application frontend Vite.

---

## Crédits

Ce projet s'appuie sur la bibliothèque open-source suivante :
- **[letterboxdpy](https://github.com/nmcassa/letterboxdpy)** par [nmcassa](https://github.com/nmcassa) — une API et bibliothèque Python non-officielle pour Letterboxd qui permet d'extraire les données des watchlists et les informations des films.

---

## Licence

Ce projet est sous licence [MIT](LICENSE).
