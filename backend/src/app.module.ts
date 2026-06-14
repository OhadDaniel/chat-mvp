import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthControllerModule } from './modules/auth/auth.controller.module';
import { ConversationsControllerModule } from './modules/conversations/conversations.controller.module';
import { MessagesControllerModule } from './modules/messages/messages.controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      // tests inject their own env and must not inherit the local .env
      ignoreEnvFile: process.env.NODE_ENV === 'test',
    }),
    // Service modules first, in FK/seed order (users → conversations →
    // messages): each service seeds demo data in onModuleInit, and Nest
    // runs those hooks in module-resolution order.
    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
    // Controller modules wire endpoints to their orchestrators.
    AuthControllerModule,
    ConversationsControllerModule,
    MessagesControllerModule,
  ],
})
export class AppModule {}
