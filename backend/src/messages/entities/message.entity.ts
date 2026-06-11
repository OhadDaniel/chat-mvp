import type { PublicUser } from '../../users/entities/user.entity'

/** API shape — frozen since week 3. */
export type Message = {
  id: string
  conversationId: string
  sender: PublicUser
  content: string
  sentAt: string
  status: 'sent'
}
