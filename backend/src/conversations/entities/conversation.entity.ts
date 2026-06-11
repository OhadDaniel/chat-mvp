import type { PublicUser } from '../../users/entities/user.entity';

export type LastMessage = {
  content: string;
  sentAt: string;
  senderId: string;
};

export type Conversation = {
  id: string;
  participants: PublicUser[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};
