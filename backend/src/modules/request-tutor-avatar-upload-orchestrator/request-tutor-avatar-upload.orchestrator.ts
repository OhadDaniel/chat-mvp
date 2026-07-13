import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { StorageService } from '../storage/storage.service';
import { buildTutorAvatarKey } from '../storage/storage.helpers';
import type { RequestTutorAvatarUploadDto } from '../conversations/dto/request-tutor-avatar-upload.request.dto';
import type { RequestTutorAvatarUploadResponse } from '../conversations/dto/request-tutor-avatar-upload.response.dto';

@Injectable()
export class RequestTutorAvatarUploadOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly storage: StorageService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    dto: RequestTutorAvatarUploadDto,
  ): Promise<RequestTutorAvatarUploadResponse> {
    await this.conversationsService.assertTutorOwner(conversationId, userId);
    const key = buildTutorAvatarKey(conversationId);
    const { url, fields } = await this.storage.presignUpload(
      key,
      dto.contentType,
    );
    return { url, fields };
  }
}
