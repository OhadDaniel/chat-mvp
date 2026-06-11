/**
 * Demo data for development — DATA ONLY, no logic.
 * Each service owns its seeding logic and reads its rows from here.
 * Seeds only fire on a completely empty database (services check count()).
 */

export const SEED_USER_PASSWORD = 'Password123!';

type SeedUser = {
  id: string;
  email: string;
  name: string;
};

type SeedConversation = {
  id: string;
  userAId: string;
  userBId: string;
  /** when set, the conversation is seeded as pinned this many days ago */
  pinnedDaysAgo?: number;
};

type SeedMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  minutesAgo: number;
  content: string;
};

export const SEED_USERS: readonly SeedUser[] = [
  { id: 'user-1', email: 'ohad@chat.dev', name: 'Ohad Daniel' },
  { id: 'user-2', email: 'alice@chat.dev', name: 'Alice Levi' },
  { id: 'user-3', email: 'ben@chat.dev', name: 'Ben Katz' },
  { id: 'user-4', email: 'clara@chat.dev', name: 'Clara Green' },
];

export const SEED_CONVERSATIONS: readonly SeedConversation[] = [
  { id: 'conv-1', userAId: 'user-1', userBId: 'user-2', pinnedDaysAgo: 1 },
  { id: 'conv-2', userAId: 'user-1', userBId: 'user-3' },
  { id: 'conv-3', userAId: 'user-1', userBId: 'user-4' },
];

export const SEED_MESSAGES: readonly SeedMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    minutesAgo: 10,
    content: 'Hey! are we still on for the review at 3pm?',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    minutesAgo: 8,
    content: "Yes, definitely! I'll send the doc link beforehand",
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    minutesAgo: 2,
    content: 'sounds good, see you then!',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'user-1',
    minutesAgo: 30,
    content: 'Just pushed the hotfix branch',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'user-3',
    minutesAgo: 18,
    content: 'did you push the fix?',
  },
  {
    id: 'msg-6',
    conversationId: 'conv-3',
    senderId: 'user-4',
    minutesAgo: 60,
    content: 'let me check the spec',
  },
];

export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
