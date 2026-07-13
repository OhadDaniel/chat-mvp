import { AppException } from '../../../common/errors/app.exception';

export class InvalidChunkError extends AppException {
  constructor(message: string) {
    super(400, 'INVALID_CHUNK', message);
  }
}
