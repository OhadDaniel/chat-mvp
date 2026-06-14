import { Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import type { User } from '../../../users/users.types';
import { UsersService } from '../../../users/users.service';
import { ConversationsService } from '../../conversations.service';
import type { CreateConversationResponse } from '../../conversations.types';
import type { CreateConversationDto } from '../../dto/create-conversation.dto';

/**
 * POST /conversations — the cross-entity step lives here: confirm the
 * other participant exists (UsersService, 404), then delegate the pair
 * rules + insert to ConversationsService.
 */
@Injectable()
export class CreateConversationOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async run(
    currentUser: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    const participant = await this.usersService.findById(dto.participantId);
    if (!participant) {
      throw new AppException(404, 'USER_NOT_FOUND', 'Participant not found');
    }

    return this.conversationsService.create(currentUser.id, participant.id);
  }
}
