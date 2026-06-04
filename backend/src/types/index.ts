export type User = {
  id: string
  name: string
  avatarInitials: string
}

export type Conversation = {
  id: string
  participants: User[]
  lastMessage: {
    content: string
    sentAt: string
    senderId: string
  } | null
  lastMessageAt: string | null
  pinnedAt: string | null
}

export type Message = {
  id: string
  conversationId: string
  sender: User
  content: string
  sentAt: string
  status: 'sent'
}



declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export type AuthenticatedRequest = import('express').Request & {
  user: User
}
