import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { buildAvatarKey } from '../storage/storage.helpers';
import type { RequestAvatarUploadDto } from '../users/dto/request-avatar-upload.request.dto';
import type { RequestAvatarUploadResponse } from '../users/dto/request-avatar-upload.response.dto';

@Injectable()
export class RequestAvatarUploadOrchestrator {
  constructor(private readonly storage: StorageService) {}

  async execute(
    userId: string,
    dto: RequestAvatarUploadDto,
  ): Promise<RequestAvatarUploadResponse> {
    // contentType is already validated against ALLOWED_AVATAR_CONTENT_TYPES by the DTO.
    // The key is derived server-side and baked into the presigned POST fields,
    // so the client uploads to it without ever seeing or sending it back.
    const key = buildAvatarKey(userId);
    const { url, fields } = await this.storage.presignUpload(
      key,
      dto.contentType,
    );
    return { url, fields };
  }
}
