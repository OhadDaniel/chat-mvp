import type { PublicUser } from '../../users/entities/user.entity'

/**
 * The API shape — frozen since week 3 so the FE keeps working.
 * Storage looks nothing like this (canonical pair columns, lastMessage
 * derived from the messages table); translating between the two is the
 * conversations module's private business.
 */
export type LastMessage = {
  content: string
  sentAt: string
  senderId: string
}

export type Conversation = {
  id: string
  participants: PublicUser[]
  lastMessage: LastMessage | null
  lastMessageAt: string | null
  pinnedAt: string | null
}
