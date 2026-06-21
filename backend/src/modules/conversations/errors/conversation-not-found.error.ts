import { AppException } from '../../../common/errors/app.exception';

export class ConversationNotFoundError extends AppException {
  constructor() {
    super(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found');
  }
}
