import { AppException } from '../../../common/errors/app.exception';

export class UserNotFoundError extends AppException {
  constructor(message = 'User not found') {
    super(404, 'USER_NOT_FOUND', message);
  }
}
