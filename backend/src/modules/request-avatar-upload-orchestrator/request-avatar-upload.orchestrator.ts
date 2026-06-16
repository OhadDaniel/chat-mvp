import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { buildAvatarKey } from '../storage/storage.helpers';
import type { RequestAvatarUploadDto } from '../users/dto/request-avatar-upload.dto';

export type RequestAvatarUploadResponse = {
  uploadUrl: string;
  key: string;
};

@Injectable()
export class RequestAvatarUploadOrchestrator {
  constructor(private readonly storage: StorageService) {}

  async run(
    userId: string,
    dto: RequestAvatarUploadDto,
  ): Promise<RequestAvatarUploadResponse> {
    // contentType is already validated against ALLOWED_AVATAR_CONTENT_TYPES by the DTO.
    const key = buildAvatarKey(userId, dto.contentType);
    const uploadUrl = await this.storage.presignUpload(key, dto.contentType);
    return { uploadUrl, key };
  }
}
