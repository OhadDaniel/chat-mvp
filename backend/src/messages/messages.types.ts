import type { Message } from './entities/message.entity'

/** Response envelopes — identical to the week-3 contract. */

export type GetMessagesResponse = {
  messages: Message[]
  nextCursor: string | null
}

export type CreateMessageResponse = {
  message: Message
}
