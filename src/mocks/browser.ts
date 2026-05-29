import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth.handlers'
import { conversationsHandlers } from './handlers/conversations.handlers'
import { messagesHandlers } from './handlers/messages.handlers'

export const worker = setupWorker(
  ...authHandlers,
  ...conversationsHandlers,
  ...messagesHandlers,
)
