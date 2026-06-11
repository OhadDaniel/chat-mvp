import { Injectable } from '@nestjs/common'
import type { User } from './entities/user.entity'

/**
 * In-memory store for users. Deliberately dumb: no hashing,
 * no uniqueness rules, no normalization — that is the service's job.
 * NOT exported from UsersModule: only UsersService may touch it.
 * Next week this class is swapped for a Mongo implementation.
 */
@Injectable()
export class UsersRepository {
  private readonly users: User[] = []

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  insert(user: User): User {
    this.users.push(user)
    return user
  }

  count(): number {
    return this.users.length
  }
}
