import { IsIn } from 'class-validator';
import { ALLOWED_AVATAR_CONTENT_TYPES } from '../../storage/storage.helpers';

export class RequestAvatarUploadDto {
  @IsIn(ALLOWED_AVATAR_CONTENT_TYPES)
  contentType!: string;
}
