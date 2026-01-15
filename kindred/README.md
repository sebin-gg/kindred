## Kindred – Community Impact Journal & Title Generator

Kindred is a web app that helps everyday volunteers **see, track, and celebrate their impact** across multiple community areas like Environment, Education, Social Work, Healthcare, Animal Welfare, and Disaster Relief.

Instead of traditional “points-only” dashboards, Kindred:
- Lets people **journal real actions** they take in their community
- Converts those actions into **track-specific points** stored in MongoDB
- Uses the top 3 impact areas to generate an **evolving, narrative title** (e.g. _“Community Wisdom Weaver”_) that updates when the user chooses
- Provides a **community view** so users can explore other profiles and interests

This README is written for a **hackathon jury** to quickly understand the concept, architecture, and what is technically interesting about the project.

---

## Problem & Vision

### The problem
- Volunteering and small acts of kindness are **hard to measure**.
- People often feel like “what I do doesn’t really count” because impact tools are:
  - Too focused on organizations, not individuals
  - Too numeric (points, badges) and not **story-driven**
  - Not connected to any persistent identity or profile

### The Kindred approach
- Treat every user as a **“local hero”** with:
  - A living **impact journal** (what they did, when, and in which area)
  - A set of **tracks** (Environment, Education, etc.) whose points reflect activity
  - A **title** that combines their three strongest tracks into human, shareable language
- Make the system **forgiving and playful**:
  - Titles only change when the user clicks **“Generate new title”**, so it feels intentional
  - Titles are written in friendly, narrative style instead of gamified buzzwords

---

## High‑Level Features

- **Authentication**
  - Register / login with email and password (`/api/auth/register`, `/api/auth/login`)
  - JWT-based auth stored client-side in `localStorage`, handled via `AuthContext`

- **Hero Journal**
  - Log actions with a **category** (one of the 6 tracks) and a short description
  - Saves entries in MongoDB as `JournalEntry` documents
  - Each new entry automatically **adds points** to the matching track for that user
  - Entries are displayed as a timeline of cards

- **My Hero Space**
  - Fetches the user’s track data from MongoDB (`/api/users/tracks`)
  - Visualises per-track points (“Environment 1250 pts”, etc.)
  - Shows a **current title** generated from the three highest‑scoring tracks
  - Title generation uses a **hard‑coded matrix of combination titles** for all 3-track combos
  - Title only changes when the user clicks **“Generate new title”**

- **Profile Settings**
  - Name, location, bio, interests, and community visibility
  - Can be wired to backend `/api/users/profile` endpoints (MVP currently focuses on journal + tracks)

- **Community Page**
  - Browse mock community members (or later: real profiles)
  - Filter by **location** and **interest area**
  - Open a modal to see a “mini profile” with interests, bio, and (dummy) email

---

## Architecture Overview

### Frontend
- **Stack**
  - React 19 + Vite
  - React Router DOM for routing
  - Context API for authentication state
- **Key folders**
  - `src/pages`
    - `HomePage.jsx` – entry screen + navigation to major areas
    - `AuthPage.jsx` – login / register UI
    - `CommunityPage.jsx` – community explorer with filters and modal
  - `src/components`
    - `MyHeroSpace.jsx` – track stats + title area
    - `HeroJournal.jsx` – journal screen (form + timeline)
    - `ActionForm.jsx`, `JournalTimeline.jsx`, `cards/JournalEntryCard.jsx`
    - `TrackStatsSection.jsx`, `CurrentTitleCard.jsx`, `Nav.jsx`
  - `src/data/titles.js`
    - Single‑track title ladders per category
    - `combinationTitles` – a predefined matrix of titles for **every combination of three tracks**
    - `getCurrentTitle(tracks)` – picks top 3 tracks by points and returns the best‑matching title
  - `src/services/api.js`
    - `authAPI`, `userAPI`, `journalAPI`, `communityAPI`
    - Uses `VITE_API_URL` environment variable so frontend can be deployed separately from backend

### Backend
- **Stack**
  - Node.js + Express
  - MongoDB + Mongoose
  - JWT for authentication
- **Entry**
  - `kindred-backend/server.js`
    - Loads environment with `dotenv`
    - Connects to MongoDB with robust error logging + timeouts
    - CORS configured for both `localhost` and a hosted frontend URL
    - Mounts route modules under `/api`
- **Models**
  - `User`
    - Email, password (bcrypt‑hashed), name, location, bio, interests
    - `tracks`: array of `{ name, points }` for the 6 categories
    - `isCommunityVisible`, `currentTitle`, timestamps
    - Instance method `comparePassword` for login
  - `JournalEntry`
    - `userId` (ref to `User`)
    - `content`, `category`, `pointsEarned`, timestamps
- **Routes**
  - `routes/auth.js`
    - `POST /register` – creates user with zeroed tracks
    - `POST /login` – verifies password and returns JWT + user info
  - `routes/users.js`
    - `GET /profile` / `PUT /profile`
    - `GET /tracks` – used by frontend for My Hero Space and Hero Journal
    - `PUT /tracks/:trackName` – update specific track points
  - `routes/journal.js`
    - `POST /entries` – saves journal entry and **adds +10 points** to the corresponding track
    - `GET /entries` – returns current user’s entries, newest first
    - `DELETE /entries/:entryId`
  - `middleware/auth.js`
    - `authenticateToken` reads `Authorization: Bearer <token>` and rejects invalid / missing tokens

---

## Data Flow: From Action → Points → Title

1. **User logs an action** in `HeroJournal`  
   - Chooses a category (e.g. “Environment”)  
   - Writes a short description  
   - `journalAPI.createEntry(content, category)` sends it to `/api/journal/entries`

2. **Backend creates the entry & updates points**
   - `JournalEntry` is saved in MongoDB
   - Finds the matching track in `User.tracks` and increments `points` (+10 by default)
   - Returns the created entry to the frontend

3. **Frontend refreshes tracks**
   - After a successful entry, `HeroJournal` calls `userAPI.getTracks()` again
   - `MyHeroSpace` reads the same `/tracks` data so the **points always match MongoDB**

4. **User generates a new title (explicit action)**
   - In `MyHeroSpace`, clicking **“Generate new title”**:
     - Sorts tracks by points (desc)
     - Passes them to `getCurrentTitle(tracks)`  
       - If a 3‑track combination match exists, pick a title based on total points  
       - Otherwise, fall back to per‑track ladders
     - Saves the title to `localStorage` and renders it

The result: adding a journal entry **feels like it moves something real** (points + future title), but the narrative identity only changes when the user asks for it.

---

## Running Locally

### Prerequisites
- Node.js (LTS)
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Backend

```bash
cd Kindred/kindred/kindred-backend
npm install
```

Create a `.env` file (or adjust existing one):

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/kindred
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev   # nodemon
```

### 2. Frontend

```bash
cd Kindred/kindred
npm install
```

Create a `.env` file (optional – defaults to localhost):

```bash
VITE_API_URL=http://localhost:5000/api
```

Run the app:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Deployment Summary

For detailed steps, see `QUICK_DEPLOY.md` and `DEPLOYMENT_GUIDE.md`.  
In short:
- **MongoDB** → MongoDB Atlas (free tier)
- **Backend** → Railway (Node.js web service using `server.js`)
- **Frontend** → Vercel (Vite React app, API URL via `VITE_API_URL`)

---

## What’s Interesting Technically

- **Title generation engine**
  - Deterministic, explainable mapping from **top 3 tracks + total points** → human‑readable identity
  - All combinations of three tracks covered via `combinationTitles` for hackathon‑friendly clarity
- **Separation of concerns**
  - Points and journal are always the **source of truth** in MongoDB
  - Title calculation is purely deterministic and stateless on the frontend
- **User‑centric UX decisions**
  - Title does **not** auto‑change on every action → user retains a sense of control
  - Community page designed to be easily replaced with real backend data later

---

## Possible Next Steps

- Real‑time community feed based on latest journal entries  
- Public “hero card” that can be shared outside the app  
- Streaks and reflection prompts (e.g. “What did this action mean to you?”)  
- Organization‑level dashboards that aggregate individual tracks

---

Thanks for reviewing Kindred. The goal is simple:  
