# FellowshipChat MVP

A frontend chat application built with React + TypeScript + Tailwind CSS.  
Runs fully in the browser against a mock API (MSW) — ready to connect to a real backend in Week 3.

---

## Features

- **Auth** — login with name and password, session persisted in localStorage
- **Conversations** — list all conversations, search by participant name, pin/unpin
- **Messages** — view messages per conversation, send with optimistic update, auto-scroll
- **Logout** — clears session and returns to login

---

## Main Components

| Feature | Components |
|---|---|
| Auth | `LoginScreen` · `LoginForm` · `LoginCard` |
| Conversations | `ConversationSidebar` · `ConversationList` · `SearchBar` · `ConversationItem` |
| Messages | `MessagesPanel` · `MessageList` · `Bubble` · `MessageComposer` |
| App | `AppLayout` · `Toast` |

---

## Architecture

```
Browser
  └── React App
        ├── Auth          →  apiClient  →  MSW /auth/login
        ├── Conversations →  apiClient  →  MSW /conversations
        └── Messages      →  apiClient  →  MSW /conversations/:id/messages
                                                    ↕
                                               seed.ts (mock data)
```

---

## API Contract

All endpoints, request/response shapes, and error codes are documented in [`API_CONTRACT.md`](./API_CONTRACT.md).

---

## Stack

React 19 · TypeScript · Tailwind CSS v4 · Vite · MSW v2 · Vitest

---

## Run locally

```bash
npm install
npm run dev
```
