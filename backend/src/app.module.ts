import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.validation';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      // tests inject their own env and must not inherit the local .env
      ignoreEnvFile: process.env.NODE_ENV === 'test',
    }),
    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
  ],
})
export class AppModule {}
