import { Injectable } from '@nestjs/common';
import type { User } from '../users/users.types';
import type { CreateConversationResponse } from '../conversations/conversations.types';
import type { CreateConversationDto } from '../conversations/dto/create-conversation.request.dto';
import { CreateConversationOrchestrator } from '../create-conversation-orchestrator/create-conversation.orchestrator';
import { CreateGroupOrchestrator } from '../create-group-orchestrator/create-group.orchestrator';
import { CreateAssistantConversationOrchestrator } from '../create-assistant-conversation-orchestrator/create-assistant-conversation.orchestrator';

@Injectable()
export class CreateConversationRouterOrchestrator {
  constructor(
    private readonly createDirectConversationOrchestrator: CreateConversationOrchestrator,
    private readonly createGroupOrchestrator: CreateGroupOrchestrator,
    private readonly createAssistantConversationOrchestrator: CreateAssistantConversationOrchestrator,
  ) {}

  execute(
    user: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    if (dto.type === 'group') {
      return this.createGroupOrchestrator.execute(
        user,
        dto.name!,
        dto.participantIds!,
      );
    }
    if (dto.type === 'assistant') {
      return this.createAssistantConversationOrchestrator.execute(user);
    }
    return this.createDirectConversationOrchestrator.execute(
      user,
      dto.participantId!,
    );
  }
}
