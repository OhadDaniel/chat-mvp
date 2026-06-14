import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../../conversations.service';
import type { GetConversationsResponse } from '../../conversations.types';

/** GET /conversations — single service today, wrapped for a uniform layer. */
@Injectable()
export class ListConversationsOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  run(userId: string, search?: string): Promise<GetConversationsResponse> {
    return this.conversationsService.list(userId, search);
  }
}
