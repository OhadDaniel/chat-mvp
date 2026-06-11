import { Inject, Injectable } from '@nestjs/common'
import { Pool } from 'pg'
import { PG_POOL } from '../database/database.constants'
import type { User } from './entities/user.entity'

/**
 * Postgres implementation of the users store. Still deliberately dumb:
 * no hashing, no uniqueness logic, no normalization — that stays in
 * UsersService. Same public methods as the in-memory version it
 * replaced; only the insides changed. NOT exported from UsersModule.
 *
 * All queries are parameterized ($1, $2…) — values never get
 * concatenated into SQL, so injection is structurally impossible.
 */
@Injectable()
export class UsersRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      `SELECT id, email, name, avatar_initials, password_hash
         FROM users
        WHERE id = $1`,
      [id],
    )
    return result.rows[0] && rowToUser(result.rows[0])
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      `SELECT id, email, name, avatar_initials, password_hash
         FROM users
        WHERE email = $1`,
      [email],
    )
    return result.rows[0] && rowToUser(result.rows[0])
  }

  async insert(user: User): Promise<User> {
    await this.pool.query(
      `INSERT INTO users (id, email, name, avatar_initials, password_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, user.email, user.name, user.avatarInitials, user.passwordHash],
    )
    return user
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT count(*) AS count FROM users',
    )
    return Number(result.rows[0]?.count ?? 0)
  }
}

/** Raw row shape (snake_case, as Postgres returns it). */
type UserRow = {
  id: string
  email: string
  name: string
  avatar_initials: string
  password_hash: string
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarInitials: row.avatar_initials,
    passwordHash: row.password_hash,
  }
}
