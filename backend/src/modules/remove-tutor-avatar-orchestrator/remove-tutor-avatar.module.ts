import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { RemoveTutorAvatarOrchestrator } from './remove-tutor-avatar.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [RemoveTutorAvatarOrchestrator],
  exports: [RemoveTutorAvatarOrchestrator],
})
export class RemoveTutorAvatarModule {}
