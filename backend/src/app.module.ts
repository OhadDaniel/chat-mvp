import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { UsersModule } from './modules/users/users.module';

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
