import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';
import {
  COUNT_USERS,
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_ID,
  INSERT_USER,
} from './users.queries';
import type { User, UserRow } from './users.types';

/**
 * Postgres store for users. Deliberately dumb: no hashing, no
 * uniqueness logic, no normalization — that stays in UsersService.
 * SQL lives in users.queries.ts; this class only runs it and maps rows.
 * NOT exported from UsersModule.
 */
@Injectable()
export class UsersRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(FIND_USER_BY_ID, [id]);
    return result.rows[0] && rowToUser(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(FIND_USER_BY_EMAIL, [email]);
    return result.rows[0] && rowToUser(result.rows[0]);
  }

  async insert(user: User): Promise<User> {
    await this.pool.query(INSERT_USER, [
      user.id,
      user.email,
      user.name,
      user.avatarInitials,
      user.passwordHash,
    ]);
    return user;
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(COUNT_USERS);
    return Number(result.rows[0]?.count ?? 0);
  }
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarInitials: row.avatar_initials,
    passwordHash: row.password_hash,
  };
}
