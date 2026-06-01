<div align="center">
  <img src="public/beanthere-logo.png" alt="Bean There Logo" width="200" />

  <h1>Bean There — Frontend</h1>

  <p>Vue 3 single-page application for the Bean There café discovery platform.<br/>Browse local cafés, submit reviews, and manage your profile and favorites.</p>

  <p>
    <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Pinia-3.x-FFD859?style=flat-square&logo=pinia&logoColor=black" />
    <img src="https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square&logo=axios&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-≥18-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  </p>
</div>

---

## Overview

The frontend is a **Vue 3** SPA built with Vite. It communicates with the Django backend at `http://127.0.0.1:8000` via Axios and manages global state with Pinia. Styling is done entirely with **Tailwind CSS**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Build Tool | [Vite 6.x](https://vitejs.dev/) |
| State Management | [Pinia](https://pinia.vuejs.org/) |
| Routing | [Vue Router 4](https://router.vuejs.org/) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Icons | [Lucide Vue Next](https://lucide.dev/) |

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/home` | `HomePage.vue` | Landing page with café directory, search, reviews, and feedback form |
| `/login` | `LoginPage.vue` | Login form |
| `/signup` | `SignUp.vue` | Registration form |
| `/profile` | `UserProfile.vue` | User dashboard with info, favorites, and settings tabs |
| `/tinatangi` | `Tinatangi.vue` | Tinatangi Café detail page |
| `/someday-brews` | `Somedays.vue` | Someday Brews detail page |
| `/he-brews-she-bakes` | `HBSB.vue` | He Brews She Bakes detail page |
| `/but-first-coffee` | `BFC.vue` | But First Coffee detail page |

---

## Project Structure

```
Frontend/
├── public/                  # Static images (café photos, logos)
├── src/
│   ├── assets/              # CSS and SVG assets
│   ├── components/
│   │   ├── LoginPage.vue    # Login form
│   │   ├── UserInfo.vue     # Profile info tab
│   │   ├── Favorites.vue    # Favorites tab
│   │   ├── Settings.vue     # Profile settings tab (edit bio & photo)
│   │   └── Search.vue       # Search component
│   ├── views/
│   │   ├── HomePage.vue     # Main landing page
│   │   ├── UserProfile.vue  # Profile page with sidebar tabs
│   │   ├── SignUp.vue       # Registration page
│   │   ├── Tinatangi.vue    # Tinatangi Café page
│   │   ├── Somedays.vue     # Someday Brews page
│   │   ├── HBSB.vue         # He Brews She Bakes page
│   │   └── BFC.vue          # But First Coffee page
│   ├── stores/
│   │   ├── user.js          # User auth and profile state (Pinia)
│   │   └── cafefavorites.js # Favorites state (Pinia)
│   ├── plugins/
│   │   └── auth.js          # Axios interceptor for 401 handling
│   ├── router.js            # Vue Router configuration
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (bundled with Node.js)
- The **Backend** must be running at `http://127.0.0.1:8000`

### Setup

**1. Navigate to the frontend folder**

```bash
cd Frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

### Production Build

**Build for production**

```bash
npm run build
```

**Preview the production build locally**

```bash
npm run preview
```

---

## Development Team

| Name | Role |
|---|---|
| Princess Gwenn A. Destura | Backend Developer |
| Christina M. Esico | Frontend Developer |
| Angel Vhea P. Melindo | Backend Developer |
| Ma. Criselda S. Perdito | Frontend Developer |

---

<div align="center">
  <sub>De La Salle University – Dasmariñas &nbsp;·&nbsp; S-ITCS227 Application Development and Emerging Technologies</sub>
</div>
