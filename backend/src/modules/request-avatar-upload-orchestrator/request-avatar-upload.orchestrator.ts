import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { buildAvatarKey } from '../storage/storage.helpers';
import type { RequestAvatarUploadDto } from '../users/dto/request-avatar-upload.request.dto';
import type { RequestAvatarUploadResponse } from '../users/dto/request-avatar-upload.response.dto';

@Injectable()
export class RequestAvatarUploadOrchestrator {
  constructor(private readonly storage: StorageService) {}

  async run(
    userId: string,
    dto: RequestAvatarUploadDto,
  ): Promise<RequestAvatarUploadResponse> {
    // contentType is already validated against ALLOWED_AVATAR_CONTENT_TYPES by the DTO.
    const key = buildAvatarKey(userId);
    const { url, fields } = await this.storage.presignUpload(
      key,
      dto.contentType,
    );
    return { url, fields, key };
  }
}
