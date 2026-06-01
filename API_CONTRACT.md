# API Contract — Chat MVP

> Designed in Week 2 (frontend). Backend implements this contract in Week 3.  
> All requests require `Authorization: Bearer <token>` except `POST /auth/login`.  
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

### `POST /auth/login`

Mock login — choose a user identity, receive a token.

**Request body**
```ts
{
  userId: string   // one of the seeded user IDs
}
```

**Response `200`**
```ts
{
  token: string
  user: User
}
```

**Response `404`**
```ts
{ error: 'USER_NOT_FOUND' }
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

### `DELETE /conversations/:id/messages/:messageId`

Delete a message. Only the message author can delete their own messages — the backend enforces this via the auth token.

**Response `204`** — no body

**Response `403`**
```ts
{ error: 'NOT_MESSAGE_AUTHOR' }
```

**Response `404`**
```ts
{ error: 'MESSAGE_NOT_FOUND' }
```

---

## 4. Shared Types

```ts
type User = {
  id: string
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
  error: string   // machine-readable error code (screaming snake case)
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
