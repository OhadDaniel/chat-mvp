import type { Request, Response, NextFunction } from 'express'
import type { GetConversationsQuery } from './conversations.types'
import { getConversations } from './get-conversations.orchestrator'
import { createConversationOrchestrator } from './create-conversation.orchestrator'
import { patchConversationOrchestrator } from './patch-conversation.orchestrator'

export function getConversationsController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { search } = req.query as GetConversationsQuery
    const result = getConversations(req.user!.id, search)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export function createConversationController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const result = createConversationOrchestrator(req.user!.id, req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export function patchConversationController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = req.params.id as string
    const result = patchConversationOrchestrator(id, req.user!.id, req.body)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
