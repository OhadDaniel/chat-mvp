import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SEED_USER_PASSWORD, SEED_USERS } from '../mongo/seed-data';
import { UsersRepository } from './users.repository';
import { EmailAlreadyExistsError } from './errors/email-already-exists.error';
import { UserNotFoundError } from './errors/user-not-found.error';
import { splitName } from './users.helpers';
import {
  type Avatar,
  type CreateUserInput,
  type UpdateProfileInput,
  type User,
} from './users.types';


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
      throw new EmailAlreadyExistsError();
    }

    const { firstName, lastName } = splitName(input.name);
    return this.insertUser(
      randomUUID(),
      email,
      firstName,
      lastName,
      input.password,
    );
  }


  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(normalizeEmail(email));
  }


  findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }

  /** Batch lookup — used to join participants/senders onto a read. */
  findByIds(ids: string[]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  /** The whole directory — used to populate the new-conversation pickers. */
  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<User> {
    const fields: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>> = {};

    if (input.firstName !== undefined) {
      fields.firstName = input.firstName;
    }
    if (input.lastName !== undefined) {
      fields.lastName = input.lastName;
    }
    if (input.email !== undefined) {
      const email = normalizeEmail(input.email);
      const existing = await this.usersRepository.findByEmail(email);
      if (existing && existing.id !== userId) {
        throw new EmailAlreadyExistsError();
      }
      fields.email = email;
    }

    return this.applyUpdate(userId, fields);
  }

  setAvatar(userId: string, avatar: Avatar | null): Promise<User> {
    return this.applyUpdate(userId, { avatar });
  }

  /** Persist a partial update, or 404 if the user no longer exists. */
  private async applyUpdate(
    userId: string,
    fields: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'avatar'>>,
  ): Promise<User> {
    const user = await this.usersRepository.update(userId, fields);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }


  private async insertUser(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    return this.usersRepository.insert({
      id,
      email,
      firstName,
      lastName,
      passwordHash,
      avatar: null,
    });
  }


  private async seedDemoUsers(): Promise<void> {
    if ((await this.usersRepository.count()) > 0) {
      return;
    }

    for (const { id, email, firstName, lastName } of SEED_USERS) {
      await this.insertUser(id, email, firstName, lastName, SEED_USER_PASSWORD);
    }
  }
}


function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
