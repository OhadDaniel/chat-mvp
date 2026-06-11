# FellowshipChat MVP

A full-stack chat application: React + TypeScript + Tailwind CSS frontend, NestJS + PostgreSQL backend.

---

## Features

- **Auth** — signup and login with email + password; JWT stored in `localStorage`; session restored via `GET /me` on refresh
- **Conversations** — list all conversations, search by participant name, pin/unpin
- **Messages** — view messages per conversation, send with optimistic update, auto-scroll
- **Logout** — clears token and returns to login; expired tokens (401) redirect to login automatically

---

## Main Components

| Feature | Components |
|---|---|
| Auth | `AuthScreens` · `LoginScreen` · `SignupScreen` · `LogoutButton` |
| Conversations | `ConversationSidebar` · `ConversationList` · `SearchBar` · `ConversationItem` |
| Messages | `MessagesPanel` · `MessageList` · `Bubble` · `MessageComposer` |
| App | `AppLayout` · `Toast` |

---

## Architecture

```
Browser
  └── React App (Vite, port 5173)
        ├── Auth          →  apiClient  →  /api/auth/signup | login | /me
        ├── Conversations →  apiClient  →  /api/conversations
        └── Messages      →  apiClient  →  /api/conversations/:id/messages
                                                    ↕
                                          NestJS backend (port 3001)
                                                    ↕
                                               PostgreSQL
```

The Vite dev server proxies `/api` to `http://localhost:3001`.

---

## API Contract

All endpoints, request/response shapes, and error codes are documented in [`API_CONTRACT.md`](./API_CONTRACT.md).

---

## Stack

**Frontend:** React 19 · TypeScript · Tailwind CSS v4 · Vite · Vitest  
**Backend:** NestJS · PostgreSQL · JWT (Passport) · bcrypt · class-validator

---

## Run locally

**Frontend**

```bash
npm install
npm run dev
```

**Backend** (from `backend/`)

```bash
npm install
cp .env.example .env   # set ACCESS_TOKEN_SECRET and DATABASE_URL
npm run dev
```

Backend listens on `http://localhost:3001`. Start the backend before using the app.

---

## Tests

```bash
npm test              # frontend unit tests (Vitest)
cd backend && npm test && npm run test:e2e
```
