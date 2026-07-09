import type { Request, Response, NextFunction } from 'express'
import { getMessagesOrchestrator } from './get-messages.orchestrator'
import { createMessageOrchestrator } from './create-message.orchestrator'

export function getMessagesController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = req.params.id as string
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const result = getMessagesOrchestrator(id, req.user!.id, cursor, limit)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export function createMessageController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = req.params.id as string
    const result = createMessageOrchestrator(id, req.user!.id, req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}
