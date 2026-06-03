import type { Request, Response, NextFunction } from 'express'
import { makeError } from '../errors'
import { USERS } from '../store'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  const user = USERS.find(u => u.id === token)

  if (!user) {
    next(makeError(401, 'UNAUTHORIZED', 'Missing or invalid token'))
    return
  }

  req.user = user
  next()
}
