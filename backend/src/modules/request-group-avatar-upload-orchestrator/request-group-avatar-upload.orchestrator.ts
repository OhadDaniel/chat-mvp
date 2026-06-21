import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { StorageService } from '../storage/storage.service';
import { buildGroupAvatarKey } from '../storage/storage.helpers';
import type { RequestGroupAvatarUploadDto } from '../conversations/dto/request-group-avatar-upload.request.dto';
import type { RequestGroupAvatarUploadResponse } from '../conversations/dto/request-group-avatar-upload.response.dto';

@Injectable()
export class RequestGroupAvatarUploadOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly storage: StorageService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    dto: RequestGroupAvatarUploadDto,
  ): Promise<RequestGroupAvatarUploadResponse> {
    // Only the creator may upload a group photo. contentType is validated by the DTO.
    await this.conversationsService.assertGroupOwner(conversationId, userId);
    const key = buildGroupAvatarKey(conversationId);
    const { url, fields } = await this.storage.presignUpload(
      key,
      dto.contentType,
    );
    return { url, fields };
  }
}
