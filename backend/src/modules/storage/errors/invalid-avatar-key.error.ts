import { AppException } from '../../../common/errors/app.exception';

export class InvalidAvatarKeyError extends AppException {
  constructor() {
    super(
      400,
      'INVALID_AVATAR_KEY',
      'Avatar key does not belong to this user',
    );
  }
}
