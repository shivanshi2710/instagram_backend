# InstaGram Frontend

A modern Instagram-inspired frontend built with React + Vite, connected to the existing FastAPI backend.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Axios

## Getting Started

### Prerequisites

- Node.js 18+
- FastAPI backend running on `http://localhost:8000`

### Run the backend

```bash
cd ..
uvicorn app.main:app --reload
```

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies API requests to the backend, so no CORS changes are needed.

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Login with username & password |
| `/register` | Create a new account |
| `/` | Home feed (your posts) |
| `/create` | Create a new post with image upload |
| `/posts/:id/edit` | Update post caption, content, or image |
| `/search` | Search and follow users |
| `/profile/:username` | User profile with stats and posts grid |
| `/profile/edit` | Edit your profile |
| `/profile/:username/followers` | Followers list |
| `/profile/:username/following` | Following list |

## Features

- JWT authentication (token stored in localStorage)
- Automatic Bearer token on protected requests
- Dark / Light mode toggle
- Responsive layout (mobile, tablet, desktop)
- Image preview before upload
- Toast notifications and loading states
- Follow / unfollow users

## Project Structure

```
src/
├── api/           # Axios instance and API modules
├── components/    # Reusable UI, layout, posts, users
├── context/       # Auth, theme, toast providers
├── pages/         # Route pages
└── utils/         # JWT helpers, classnames
```

## Build for Production

```bash
npm run build
npm run preview
```

For production deployment, configure your web server to proxy `/login`, `/users`, `/posts`, and `/follow` to the FastAPI backend, or set up CORS on the backend.
