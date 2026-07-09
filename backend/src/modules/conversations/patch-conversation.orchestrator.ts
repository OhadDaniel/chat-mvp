import { z } from 'zod'
import { makeError } from '../../errors'
import { assertParticipant } from '../../lib/authz'
import { validate } from '../../lib/validate'
import { findById, updatePinned } from './conversations.repository'
import type { PatchConversationResponse } from './conversations.types'

const patchConversationSchema = z.object({
  pinned: z.boolean(),
})

export function patchConversationOrchestrator(
  id: string,
  userId: string,
  body: unknown
): PatchConversationResponse {
  const { pinned } = validate(patchConversationSchema, body)
  const existing = findById(id)

  if (!existing) {
    throw makeError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found')
  }

  assertParticipant(existing, userId)

  const conversation = updatePinned(id, pinned)!
  return { conversation }
}
