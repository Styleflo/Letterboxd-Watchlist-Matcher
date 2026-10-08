# Letterboxd Watchlist Matcher 🎬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Find the movies you and your friends actually want to watch together!  
**Letterboxd Watchlist Matcher** compares watchlists across multiple Letterboxd profiles to find films in common, whether shared by everyone or across subsets of your group.

*Read this in other languages: [Français](REAMDME.fr.md).*

---

## ✨ Features

- **Multi-User Watchlist Intersection**: Add 2 or more Letterboxd usernames to scan and intersect their watchlists.
- **Tiered Matching**: View films shared across all participants, as well as films shared by subsets of users (e.g. 3 of 4 friends).
- **Graceful Account Validation**: Real-time alerts and visual badges for non-existent or private profiles, allowing seamless comparison of valid accounts without breaking the scan.
- **Letterboxd-Inspired Dark UI**: Modern, sleek interface built with React, Tailwind CSS, and Lucide icons matching the Letterboxd aesthetic.
- **Detailed Movie Previews**: Click any movie card to inspect synopses, release years, posters, genres, runtimes, and direct links to Letterboxd pages.
- **Fast & Responsive**: Python FastAPI backend powered by asynchronous fetching alongside a Vite-powered React single-page app.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Data Fetching / Scraping**: [letterboxdpy](https://github.com/nmcassa/letterboxdpy)
- **Data Validation**: Pydantic v2
- **Monitoring**: Sentry SDK

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later) & **npm**
- **Python** (3.10 or later)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/letterboxd-app.git
cd letterboxd-app
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the FastAPI development server:
```bash
uvicorn api.index:app --reload --port 8000
```
The API will be available at `http://localhost:8000` (interactive documentation at `http://localhost:8000/api/docs`).

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🧪 Running Tests

### Frontend Unit & Integration Tests
```bash
cd frontend
npm test
```
To run tests in watch mode:
```bash
npm run test:watch
```

---

## ☁️ Deployment

The repository is pre-configured for multi-service deployment on **Vercel** via [`vercel.json`](vercel.json):
- `/api/*` routes are handled by the FastAPI backend service.
- All other routes are served by the Vite frontend build.

---

## 👏 Credits

This project relies on the following open-source library:
- **[letterboxdpy](https://github.com/nmcassa/letterboxdpy)** by [nmcassa](https://github.com/nmcassa) — an unofficial Letterboxd Python API and scraping client that powers our watchlist extraction and movie data fetching.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
