import type { Avatar, UserProfile } from '../users/users.types';



export type LastMessage = {
  content: string;
  sentAt: string;
  senderId: string;
};



type ConversationBase = {
  id: string;
  participants: UserProfile[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

export type DirectConversation = ConversationBase & { type: 'direct' };

export type GroupConversation = ConversationBase & {
  type: 'group';
  name: string;
  createdBy: string;
  avatarUrl: string | null;
};

export type AssistantConversation = ConversationBase & { type: 'assistant' };

export type Conversation =
  | DirectConversation
  | GroupConversation
  | AssistantConversation;



export type GetConversationsResponse = {
  conversations: Conversation[];
};

export type CreateConversationResponse = {
  conversation: Conversation;
};

export type PatchConversationResponse = {
  conversation: Conversation;
};



type StoredConversationBase = {
  id: string;
  participantIds: string[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

export type StoredDirectConversation = StoredConversationBase & {
  type: 'direct';
};

export type StoredGroupConversation = StoredConversationBase & {
  type: 'group';
  name: string;
  createdBy: string;
  avatar: Avatar | null;
};

export type StoredAssistantConversation = StoredConversationBase & {
  type: 'assistant';
};

export type StoredConversation =
  | StoredDirectConversation
  | StoredGroupConversation
  | StoredAssistantConversation;


export type LastMessageSnapshot = {
  content: string;
  sentAt: Date;
  senderId: string;
};
