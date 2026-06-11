import type { Conversation } from './entities/conversation.entity';

/** Response envelopes — identical to the week-3 contract. */

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export type CreateConversationResponse = {
  conversation: Conversation;
};

export type PatchConversationResponse = {
  conversation: Conversation;
};
