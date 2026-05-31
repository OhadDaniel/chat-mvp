import type { User } from '@/features/user/types'
import type { Conversation } from '@/features/conversations/types/index'
import type { Message } from '@/features/messages/types'

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'user-1', name: 'Ohad Daniel',  avatarInitials: 'OD' },
  { id: 'user-2', name: 'Alice Levi',   avatarInitials: 'AL' },
  { id: 'user-3', name: 'Ben Katz',     avatarInitials: 'BK' },
  { id: 'user-4', name: 'Clara Green',  avatarInitials: 'CG' },
]



export type Store = {
  conversations: Conversation[]
  messages: Record<string, Message[]>  // keyed by conversationId
}

export const store: Store = {
  conversations: [
    {
      id: 'conv-1',
      participants: [USERS[0], USERS[1]],
      lastMessage: {
        content: 'sounds good, see you then!',
        sentAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        senderId: 'user-2',
      },
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      pinnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      unreadCount: 0,
    },
    {
      id: 'conv-2',
      participants: [USERS[0], USERS[2]],
      lastMessage: {
        content: 'did you push the fix?',
        sentAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        senderId: 'user-3',
      },
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      pinnedAt: null,
      unreadCount: 3,
    },
    {
      id: 'conv-3',
      participants: [USERS[0], USERS[3]],
      lastMessage: {
        content: 'let me check the spec',
        sentAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        senderId: 'user-4',
      },
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      pinnedAt: null,
      unreadCount: 0,
    },
  ],

  messages: {
    'conv-1': [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        sender: USERS[1],
        content: 'Hey! are we still on for the review at 3pm?',
        sentAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        status: 'sent',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        sender: USERS[0],
        content: "Yes, definitely! I'll send the doc link beforehand",
        sentAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        status: 'sent',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        sender: USERS[1],
        content: 'sounds good, see you then!',
        sentAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        status: 'sent',
      },
    ],
    'conv-2': [
      {
        id: 'msg-4',
        conversationId: 'conv-2',
        sender: USERS[0],
        content: 'Just pushed the hotfix branch',
        sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'sent',
      },
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        sender: USERS[2],
        content: 'did you push the fix?',
        sentAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        status: 'sent',
      },
    ],
    'conv-3': [
      {
        id: 'msg-6',
        conversationId: 'conv-3',
        sender: USERS[3],
        content: 'let me check the spec',
        sentAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        status: 'sent',
      },
    ],
  },
}
