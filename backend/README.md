# Chat MVP — Express REST API

Week 3 backend for FellowshipChat MVP.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (nodemon) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run unit + e2e tests |

Copy `.env.example` to `.env` and set `ACCESS_TOKEN_SECRET` before running.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | | Login with name + password; returns JWT |
| GET | `/conversations` | required | List conversations; optional `?search=` |
| POST | `/conversations` | required | Create conversation; 409 if already exists |
| PATCH | `/conversations/:id` | required | Toggle pin (`{ pinned: boolean }`) |
| GET | `/conversations/:id/messages` | required | Messages with cursor pagination |
| POST | `/conversations/:id/messages` | required | Send a message |
