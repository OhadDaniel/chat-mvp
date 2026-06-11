import { randomUUID } from 'node:crypto'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { AppException } from '../common/errors/app.exception'
import { initialsOf, type User } from './entities/user.entity'
import { UsersRepository } from './users.repository'

export type CreateUserInput = {
  email: string
  name: string
  password: string
}

/**
 * Owns the users domain: password hashing, email uniqueness,
 * normalization. The ONLY door into user data for other modules —
 * UsersModule exports this service, never the repository.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  private readonly saltRounds: number

  constructor(
    private readonly usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    this.saltRounds = configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10
  }

  async onModuleInit(): Promise<void> {
    await this.seedDemoUsers()
  }

  async create(input: CreateUserInput): Promise<User> {
    const email = normalizeEmail(input.email)

    if (this.usersRepository.findByEmail(email)) {
      throw new AppException(
        409,
        'EMAIL_ALREADY_EXISTS',
        'A user with this email already exists',
      )
    }

    return this.insertUser(randomUUID(), email, input.name, input.password)
  }

  findByEmail(email: string): User | undefined {
    return this.usersRepository.findByEmail(normalizeEmail(email))
  }

  findById(id: string): User | undefined {
    return this.usersRepository.findById(id)
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash)
  }

  private async insertUser(
    id: string,
    email: string,
    name: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, this.saltRounds)
    const trimmedName = name.trim()

    return this.usersRepository.insert({
      id,
      email,
      name: trimmedName,
      avatarInitials: initialsOf(trimmedName),
      passwordHash,
    })
  }

  /**
   * Stable demo accounts (password: Password123!) so the seeded
   * conversations keep making sense and cross-user 403s are testable.
   * In-memory only — gone next week when Mongo lands.
   */
  private async seedDemoUsers(): Promise<void> {
    if (this.usersRepository.count() > 0) {
      return
    }

    const seeds: ReadonlyArray<[id: string, email: string, name: string]> = [
      ['user-1', 'ohad@chat.dev', 'Ohad Daniel'],
      ['user-2', 'alice@chat.dev', 'Alice Levi'],
      ['user-3', 'ben@chat.dev', 'Ben Katz'],
      ['user-4', 'clara@chat.dev', 'Clara Green'],
    ]

    for (const [id, email, name] of seeds) {
      await this.insertUser(id, email, name, 'Password123!')
    }
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
