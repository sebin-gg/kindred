# Kindred

Kindred is a full-stack web app for tracking community impact. Volunteers log their work in a journal, earn points across six impact tracks, and unlock earned titles as their points grow. A shared directory lets people find other volunteers by location and interest.

## Features

- Email and password accounts secured with JWT (7 day expiry) and bcrypt password hashing
- Profiles with name, location, bio, interests, and a privacy toggle for community visibility
- Six impact tracks: Environment, Education, Social Work, Healthcare, Animal Welfare, and Disaster Relief
- Earned titles based on track points, including combination titles drawn from your top three tracks
- Journal entries worth 10 points each, credited to the chosen track
- Community directory of visible members with location and interest filters plus community stats
- Profile and settings pages

## Tech stack

- Frontend: React 19, Vite, React Router 7, plain CSS
- Backend: Express 5, MongoDB via Mongoose 9, JSON Web Tokens, bcryptjs, CORS, rate limiting
- Tooling: ESLint, gitleaks secret scanning via pre-commit hooks

## Prerequisites

- Node.js 18 or newer
- A running MongoDB instance (local or hosted)

The backend reads these environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | No | Connection string. Defaults to `mongodb://127.0.0.1:27017/kindred` |
| `JWT_SECRET` | Yes | Secret used to sign auth tokens |
| `PORT` | No | Backend port. Defaults to `5000` |
| `FRONTEND_URL` | No | Extra allowed origin for CORS in production |

The frontend reads one optional variable:

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No | Backend API base URL. Defaults to `http://localhost:5000/api` |

## Getting started

Clone the repository, then install dependencies separately for the backend and the frontend.

### Backend setup

```bash
cd kindred/kindred-backend
npm install
```

Create a `.env` file next to `server.js`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/kindred
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
```

Start the backend:

```bash
npm run dev     # nodemon, auto restarts
npm start       # plain node
```

The API runs on http://localhost:5000.

### Frontend setup

Open a second terminal:

```bash
cd kindred
npm install
npm run dev
```

The app runs on http://localhost:5173.

## Project layout

```text
kindred/
├── README.md            # This file
└── kindred/             # React + Vite frontend
    ├── index.html
    ├── pages/           # ProfileSettingsPage (routed at /profile by src/App.jsx)
    ├── components/
    │   └── settings/    # BasicInfoSection, InterestsSection, SaveBar, visibilitySection
    ├── src/
    │   ├── components/  # Nav, journal timeline, title card, hero space
    │   ├── context/     # AuthContext for login state
    │   ├── data/        # Title ladders per track
    │   ├── pages/       # Auth, Home, Community pages
    │   └── services/    # API client
    └── kindred-backend/ # Express API
        ├── server.js    # App entry point and route mounting
        ├── middleware/  # JWT auth guard
        ├── models/      # User and JournalEntry schemas
        └── routes/      # auth, users, journal, community
```

## API summary

Base URL: `http://localhost:5000/api`

### Auth (`/api/auth`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create an account and return a token |
| POST | `/auth/login` | Sign in and return a token |

### Users (`/api/users`, requires a bearer token)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/users/profile` | Get your profile |
| PUT | `/users/profile` | Update profile fields and visibility |
| GET | `/users/tracks` | Get your six tracks and points |
| PUT | `/users/tracks/:trackName` | Set points for one track |

### Journal (`/api/journal`, requires a bearer token)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/journal/entries` | Create an entry and add 10 points to its category |
| GET | `/journal/entries` | List your entries, newest first |
| DELETE | `/journal/entries/:entryId` | Delete one of your entries |

### Community (`/api/community`, public)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/community/members` | Visible members, filterable by `location` and `interest` query params |
| GET | `/community/members/:userId` | One visible member |
| GET | `/community/stats` | Member count plus distinct locations and interests |

### Health (`/api/health`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Returns `{ status: "Backend is running" }` |

Rate limiting applies globally at 300 requests per 15 minutes, and auth endpoints are limited to 20 requests per 15 minutes.

## Security

This repo uses [gitleaks](https://github.com/gitleaks/gitleaks) to scan every commit for secrets such as API keys, passwords, tokens, and private keys.

Install the hook locally:

```bash
pip install pre-commit
pre-commit install
```

Use `git commit --no-verify` only in emergencies. Regular commits should always be scanned.
