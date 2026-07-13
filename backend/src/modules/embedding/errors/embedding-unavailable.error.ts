import { AppException } from '../../../common/errors/app.exception';

export class EmbeddingUnavailableError extends AppException {
  constructor() {
    super(503, 'EMBEDDING_UNAVAILABLE', 'Embeddings are not configured');
  }
}
