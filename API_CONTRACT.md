# API Contract — Chat MVP

> Designed in Week 2 (frontend). Implemented by the NestJS backend (Week 4).  
> All requests require `Authorization: Bearer <token>` except `POST /auth/signup` and `POST /auth/login`.  
> All timestamps are ISO 8601 strings. All IDs are strings (UUIDs).

---

## Table of Contents

1. [Auth](#1-auth)
2. [Conversations](#2-conversations)
3. [Messages](#3-messages)
4. [Shared Types](#4-shared-types)
5. [Error Format](#5-error-format)
6. [Change Log](#6-change-log)

---

## 1. Auth

### `POST /auth/signup`

Create a new account and receive a JWT immediately.

**Request body**
```ts
{
  email: string     // valid email
  password: string  // 8–72 characters
  name: string      // display name, max 80 chars
}
```

**Response `201`**
```ts
{
  token: string
  user: User
}
```

**Response `409`**
```ts
{ error: { code: 'EMAIL_ALREADY_EXISTS', message: string } }
```

---

### `POST /auth/login`

Authenticate with email and password.

**Request body**
```ts
{
  email: string
  password: string  // any non-empty string; wrong credentials return 401
}
```

**Response `200`**
```ts
{
  token: string
  user: User
}
```

**Response `401`**
```ts
{ error: { code: 'INVALID_CREDENTIALS', message: string } }
```

---

### `GET /me`

Return the currently authenticated user. Used by the frontend to restore the session after a page refresh.

**Headers:** `Authorization: Bearer <token>` (required)

**Response `200`**
```ts
{
  user: User
}
```

**Response `401`**
```ts
{ error: { code: 'UNAUTHORIZED', message: string } }
```

---

## 2. Conversations

### `GET /conversations`

Returns all conversations the authenticated user is part of, sorted by `lastMessageAt` descending. Pinned conversations are flagged with `pinnedAt` — the client sorts them first (ordered by `pinnedAt` ascending, so earliest pin = top).

**Query params**
```ts
{
  search?: string   // filter by participant name (case-insensitive, partial match)
}
```

**Response `200`**
```ts
{
  conversations: Conversation[]
}
```

---

### `PATCH /conversations/:id`

Toggle a conversation as pinned/unpinned.

**Request body**
```ts
{
  pinned: boolean
}
```

**Response `200`**
```ts
{
  conversation: Conversation   // updated conversation
}
```

**Response `404`**
```ts
{ error: 'CONVERSATION_NOT_FOUND' }
```

---

## 3. Messages

### `GET /conversations/:id/messages`

Returns messages for a conversation, paginated with a cursor (newest-first).

**Query params**
```ts
{
  cursor?: string   // ID of the oldest message already loaded; omit for first page
  limit?: number    // default 30, max 50
}
```

**Response `200`**
```ts
{
  messages: Message[]      // ordered oldest → newest
  nextCursor: string | null  // null = no more pages
}
```

**Response `404`**
```ts
{ error: 'CONVERSATION_NOT_FOUND' }
```

---

### `POST /conversations/:id/messages`

Send a new message. The frontend applies an optimistic update before this resolves — on failure the optimistic message is rolled back.

**Request body**
```ts
{
  content: string   // non-empty, max 2000 chars
}
```

**Response `201`**
```ts
{
  message: Message   // the persisted message with a real ID and timestamp
}
```

**Response `400`**
```ts
{ error: 'CONTENT_REQUIRED' | 'CONTENT_TOO_LONG' }
```

**Response `404`**
```ts
{ error: 'CONVERSATION_NOT_FOUND' }
```

---


## 4. Shared Types

```ts
type User = {
  id: string
  email: string
  name: string
  avatarInitials: string   // e.g. "OD" — derived from name, used as avatar fallback
}

type Conversation = {
  id: string
  participants: User[]     // includes the current user
  lastMessage: {
    content: string
    sentAt: string
    senderId: string
  } | null
  lastMessageAt: string | null
  pinnedAt: string | null  // null = not pinned; ISO timestamp = pinned (used for order)
  unreadCount: number
}

type MessageStatus = 'sending' | 'sent' | 'failed'

type Message = {
  id: string
  conversationId: string
  sender: User
  content: string
  sentAt: string
  status: MessageStatus    // 'sent' from server; 'sending'/'failed' are client-only states
}
```

> **Note on `status`:** The server always returns `sent`. The values `sending` and `failed` are assigned client-side by `useMessages` during optimistic updates. Week 3 backend never needs to handle these values.

---

## 5. Error Format

All error responses follow this shape:

```ts
{
  error: {
    code: string      // machine-readable error code (screaming snake case)
    message: string   // human-readable description
    details?: unknown // optional, e.g. validation errors array
  }
}
```

HTTP status codes used:

| Code | Meaning |
|------|---------|
| 200  | OK |
| 201  | Created |
| 204  | No Content |
| 400  | Bad Request |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (authenticated but not allowed) |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 6. Change Log

| Date | Change |
|------|--------|
| 2026-05-27 | Initial contract defined (Week 2) |
| 2026-06-03 | Login changed from `userId` to `name` + `password` |
| 2026-06-03 | Error shape changed from `{ error: string }` to `{ error: { code, message, details? } }` |
| 2026-06-03 | `DELETE /conversations/:id/messages/:messageId` removed |
| 2026-06-03 | `POST /conversations` added |
| 2026-06-10 | Week 4 auth: `POST /auth/signup`, `GET /me`; login uses `email` + `password`; `User` includes `email` |
| 2026-06-29 | Conversation creation unified: `POST /conversations` takes a discriminated `type` (`direct` \| `group` \| `assistant`); removed `POST /conversations/groups` and `POST /conversations/assistant` |
| 2026-06-29 | Assistant reply stream moved to `GET /conversations/:id/assistant` (SSE via Nest `@Sse`); send the user message via `POST /conversations/:id/messages` first |
