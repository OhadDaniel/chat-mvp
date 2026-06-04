import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from './app'

beforeEach(() => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret'
})

describe('API e2e', () => {
  it('rejects a raw user id used as bearer token', async () => {
    const res = await request(app)
      .get('/conversations')
      .set('Authorization', 'Bearer user-2')

    expect(res.status).toBe(401)
  })

  it('login returns JWT and protects conversations', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ name: 'Ohad Daniel', password: 'any' })

    expect(login.status).toBe(200)
    expect(login.body.token).not.toBe(login.body.user.id)

    const list = await request(app)
      .get('/conversations')
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(list.status).toBe(200)
    expect(Array.isArray(list.body.conversations)).toBe(true)
  })
})
