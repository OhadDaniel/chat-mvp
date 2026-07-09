import { z } from 'zod'
import { makeError } from '../../errors'
import { validate } from '../../lib/validate'
import { findById as findUserById } from '../auth/auth.service'
import { existsBetween, create } from './conversations.service'
import type { CreateConversationResponse } from './conversations.types'

const createConversationSchema = z.object({
  participantId: z.string().min(1, 'participantId is required'),
})

export function createConversationOrchestrator(
  currentUserId: string,
  body: unknown
): CreateConversationResponse {
  const { participantId } = validate(createConversationSchema, body)

  const currentUser = findUserById(currentUserId)
  const participant = findUserById(participantId)

  if (!participant) {
    throw makeError(404, 'USER_NOT_FOUND', 'Participant not found')
  }

  if (existsBetween(currentUserId, participantId)) {
    throw makeError(409, 'CONVERSATION_ALREADY_EXISTS', 'A conversation with this user already exists')
  }

  const conversation = create([currentUser!, participant])
  return { conversation }
}
