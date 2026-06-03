import type { Request, Response, NextFunction } from 'express'
import { loginOrchestrator } from './login.orchestrator'

export function loginController(req: Request, res: Response, next: NextFunction): void {
  try {
    const result = loginOrchestrator(req.body)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
