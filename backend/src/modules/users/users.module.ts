import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { UserMongo, UserSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
