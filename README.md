<div align="center">
  <img src="Frontend/public/beanthere-logo.png" alt="Bean There Logo" width="200" />

  <h1>Bean There</h1>

  <p>A café discovery and review web application for exploring local coffee shops<br/>in Dasmariñas, Cavite — browse, review, and save your favorite cafés.</p>

  <p>
    <img src="https://img.shields.io/badge/Django-5.0.6-092E20?style=flat-square&logo=django&logoColor=white" />
    <img src="https://img.shields.io/badge/DRF-3.16.0-ff1709?style=flat-square&logo=django&logoColor=white" />
    <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  </p>
</div>

---

## Overview

**Bean There** is a full-stack web application that celebrates the café culture of Dasmariñas, Cavite. It helps users discover and support local coffee shops by providing a directory of featured cafés, user-submitted reviews with star ratings, a favorites system, and personal profile management.

The project is split into two independent applications:

| Folder | Description |
|---|---|
| [`Backend/`](Backend/) | Django REST API — handles authentication, cafés, reviews, and favorites |
| [`Frontend/`](Frontend/) | Vue 3 SPA — the user-facing interface |

---

## Features

- **Café Directory** — Browse Tinatangi Café, Someday Brews, He Brews She Bakes, and But First Coffee with dedicated pages for each
- **Search** — Filter cafés by name in real time
- **Reviews & Ratings** — Submit and view star-rated feedback for any café
- **Favorites** — Save and manage your favorite cafés per user account
- **Authentication** — Register, log in, and log out with token-based auth
- **User Profile** — View and edit bio and profile picture

---

## Project Structure

```
BeanThere/
├── Backend/               # Django REST API
│   ├── Bean_There/        # Project settings and URLs
│   ├── accounts/          # User registration, login, profile
│   ├── cafe/              # Café models and endpoints
│   ├── review/            # Reviews and ratings
│   ├── favorite/          # Favorites per user
│   ├── manage.py
│   └── Pipfile
├── Frontend/              # Vue 3 SPA
│   ├── public/            # Static images and assets
│   ├── src/
│   │   ├── views/         # Page-level components
│   │   ├── components/    # Reusable UI components
│   │   ├── stores/        # Pinia state management
│   │   ├── plugins/       # Auth interceptor
│   │   └── router.js      # Vue Router
│   ├── index.html
│   └── package.json
└── bean-there.code-workspace
```

---

## Getting Started

See the individual setup guides:

- [Backend Setup](Backend/README.md)
- [Frontend Setup](Frontend/README.md)

Both servers must be running at the same time for the app to work. The backend runs on `http://127.0.0.1:8000` and the frontend on `http://localhost:5173`.

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
