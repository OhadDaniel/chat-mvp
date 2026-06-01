import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth.handlers'
import { conversationsHandlers } from './handlers/conversations.handlers'
import { messagesHandlers } from './handlers/messages.handlers'

export const server = setupServer(
  ...authHandlers,
  ...conversationsHandlers,
  ...messagesHandlers,
)
