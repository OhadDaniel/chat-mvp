import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AppException } from '../common/errors/app.exception';
import { SEED_USER_PASSWORD, SEED_USERS } from '../database/seed-data';
import { UsersRepository } from './users.repository';
import { initialsOf, type CreateUserInput, type User } from './users.types';

/**
 * Owns the users domain: password hashing, email uniqueness,
 * normalization. The ONLY door into user data for other modules —
 * UsersModule exports this service, never the repository.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  private readonly saltRounds: number;

  constructor(
    private readonly usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    this.saltRounds = configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10;
  }

  async onModuleInit(): Promise<void> {
    await this.seedDemoUsers();
  }

  async create(input: CreateUserInput): Promise<User> {
    const email = normalizeEmail(input.email);

    if (await this.usersRepository.findByEmail(email)) {
      throw new AppException(
        409,
        'EMAIL_ALREADY_EXISTS',
        'A user with this email already exists',
      );
    }

    return this.insertUser(randomUUID(), email, input.name, input.password);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(normalizeEmail(email));
  }

  findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  private async insertUser(
    id: string,
    email: string,
    name: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, this.saltRounds);
    const trimmedName = name.trim();

    return this.usersRepository.insert({
      id,
      email,
      name: trimmedName,
      avatarInitials: initialsOf(trimmedName),
      passwordHash,
    });
  }

  /**
   * Stable demo accounts so the seeded conversations keep making
   * sense and cross-user 403s are testable. Data lives in seed-data.ts.
   */
  private async seedDemoUsers(): Promise<void> {
    if ((await this.usersRepository.count()) > 0) {
      return;
    }

    for (const { id, email, name } of SEED_USERS) {
      await this.insertUser(id, email, name, SEED_USER_PASSWORD);
    }
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
