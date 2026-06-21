import { AppException } from '../../../common/errors/app.exception';

export class ConversationAlreadyExistsError extends AppException {
  constructor() {
    super(
      409,
      'CONVERSATION_ALREADY_EXISTS',
      'A conversation with this user already exists',
    );
  }
}
