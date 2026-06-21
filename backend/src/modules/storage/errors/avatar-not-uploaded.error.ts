import { AppException } from '../../../common/errors/app.exception';

export class AvatarNotUploadedError extends AppException {
  constructor() {
    super(
      400,
      'AVATAR_NOT_UPLOADED',
      'No uploaded image was found for this key',
    );
  }
}
