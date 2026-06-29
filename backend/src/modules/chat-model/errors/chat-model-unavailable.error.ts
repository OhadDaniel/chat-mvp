import { AppException } from '../../../common/errors/app.exception';

export class ChatModelUnavailableError extends AppException {
  constructor() {
    super(503, 'CHAT_MODEL_UNAVAILABLE', 'The chat model is not configured');
  }
}
