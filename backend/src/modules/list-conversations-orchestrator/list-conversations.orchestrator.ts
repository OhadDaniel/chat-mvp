import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import type { GetConversationsResponse } from '../conversations/conversations.types';

@Injectable()
export class ListConversationsOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  run(userId: string, search?: string): Promise<GetConversationsResponse> {
    return this.conversationsService.list(userId, search);
  }
}
