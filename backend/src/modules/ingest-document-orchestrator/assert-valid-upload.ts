import { extname } from 'node:path';
import { InvalidDocumentError } from '../documents/errors/invalid-document.error';
import { ALLOWED_EXTENSIONS, MAX_FILE_BYTES } from './ingest-document.constants';
import type { UploadedDocumentFile } from './ingest-document.types';

export function assertValidUpload(
  file: UploadedDocumentFile | undefined,
): asserts file is UploadedDocumentFile {
  if (!file) {
    throw new InvalidDocumentError('A document file is required');
  }
  const extension = extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new InvalidDocumentError(
      `Only ${ALLOWED_EXTENSIONS.join(', ')} files are supported`,
    );
  }
  if (file.size === 0) {
    throw new InvalidDocumentError('The document is empty');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new InvalidDocumentError('The document is too large');
  }
}
