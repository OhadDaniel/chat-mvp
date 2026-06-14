import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MessagesController } from './messages.controller';
import { GetMessagesOrchestratorModule } from './orchestrators/get-messages/get-messages.orchestrator.module';
import { CreateMessageOrchestratorModule } from './orchestrators/create-message/create-message.orchestrator.module';

@Module({
  imports: [
    AuthModule, // JWT guard pipeline
    GetMessagesOrchestratorModule,
    CreateMessageOrchestratorModule,
  ],
  controllers: [MessagesController],
})
export class MessagesControllerModule {}
