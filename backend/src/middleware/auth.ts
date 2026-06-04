import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { makeError } from '../errors'
import { USERS } from '../store'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    next(makeError(401, 'UNAUTHORIZED', 'Missing token'))
    return
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string }
    const user = USERS.find(u => u.id === payload.id)

    if (!user) {
      next(makeError(401, 'UNAUTHORIZED', 'User not found'))
      return
    }

    req.user = user
    next()
  } catch {
    next(makeError(401, 'UNAUTHORIZED', 'Invalid or expired token'))
  }
}
