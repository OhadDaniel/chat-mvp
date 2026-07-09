import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { authenticate } from './auth'
import type { Request, Response, NextFunction } from 'express'

const SECRET = 'test-secret'

beforeEach(() => {
  process.env.ACCESS_TOKEN_SECRET = SECRET
})

function makeReq(authHeader?: string): Request {
  return {
    headers: { authorization: authHeader },
  } as unknown as Request
}

const res = {} as Response

describe('authenticate middleware', () => {
  it('calls next with 401 when no token is provided', () => {
    const next = vi.fn()
    authenticate(makeReq(), res, next as NextFunction)
    expect(next).toHaveBeenCalledOnce()
    expect(next.mock.calls[0][0].status).toBe(401)
  })

  it('calls next with 401 when bearer token is a raw user id', () => {
    const next = vi.fn()
    authenticate(makeReq('Bearer user-2'), res, next as NextFunction)
    expect(next).toHaveBeenCalledOnce()
    expect(next.mock.calls[0][0].status).toBe(401)
  })

  it('calls next with 401 when token is tampered', () => {
    const next = vi.fn()
    authenticate(makeReq('Bearer tampered.token.here'), res, next as NextFunction)
    expect(next).toHaveBeenCalledOnce()
    expect(next.mock.calls[0][0].status).toBe(401)
  })

  it('calls next with 401 when token has unknown userId', () => {
    const token = jwt.sign({ id: 'user-999' }, SECRET)
    const next = vi.fn()
    authenticate(makeReq(`Bearer ${token}`), res, next as NextFunction)
    expect(next).toHaveBeenCalledOnce()
    expect(next.mock.calls[0][0].status).toBe(401)
  })

  it('sets req.user and calls next() with no error when token is valid', () => {
    const token = jwt.sign({ id: 'user-1' }, SECRET)
    const req = makeReq(`Bearer ${token}`)
    const next = vi.fn()
    authenticate(req, res, next as NextFunction)
    expect(next).toHaveBeenCalledWith()
    expect((req as Request & { user: { id: string } }).user.id).toBe('user-1')
  })
})
