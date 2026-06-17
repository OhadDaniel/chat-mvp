import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMongo, type UserDocument } from './users.schema';
import type { User } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserMongo.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    const doc = await this.userModel.findById(id).lean<UserMongo | null>().exec();
    return doc ? mapDocToUser(doc) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const doc = await this.userModel
      .findOne({ email })
      .lean<UserMongo | null>()
      .exec();
    return doc ? mapDocToUser(doc) : undefined;
  }

  async insert(user: User): Promise<User> {
    await this.userModel.create({
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: user.passwordHash,
      avatar: user.avatar,
    });
    return user;
  }

  async update(
    id: string,
    fields: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'avatar'>>,
  ): Promise<User> {
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: fields }, { returnDocument: 'after' })
      .lean<UserMongo | null>()
      .exec();
    return mapDocToUser(doc as UserMongo);
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}

function mapDocToUser(doc: UserMongo): User {
  return {
    id: doc._id,
    email: doc.email,
    firstName: doc.firstName,
    lastName: doc.lastName,
    passwordHash: doc.passwordHash,
    avatar: doc.avatar ?? null,
  };
}
