import { assertValidUpload } from './assert-valid-upload';
import { InvalidDocumentError } from '../documents/errors/invalid-document.error';
import { MAX_FILE_BYTES } from './ingest-document.constants';
import type { UploadedDocumentFile } from './ingest-document.types';

function buildFile(
  overrides: Partial<UploadedDocumentFile> = {},
): UploadedDocumentFile {
  return {
    originalname: 'notes.md',
    mimetype: 'text/markdown',
    size: 100,
    buffer: Buffer.from('hello'),
    ...overrides,
  };
}

describe('assertValidUpload', () => {
  it('accepts a valid .md file', () => {
    expect(() => assertValidUpload(buildFile())).not.toThrow();
  });

  it('accepts a valid .txt file', () => {
    expect(() =>
      assertValidUpload(buildFile({ originalname: 'doc.txt' })),
    ).not.toThrow();
  });

  it('rejects a missing file', () => {
    expect(() => assertValidUpload(undefined)).toThrow(InvalidDocumentError);
  });

  it('rejects an unsupported extension', () => {
    expect(() =>
      assertValidUpload(buildFile({ originalname: 'report.pdf' })),
    ).toThrow(InvalidDocumentError);
  });

  it('rejects an empty file', () => {
    expect(() => assertValidUpload(buildFile({ size: 0 }))).toThrow(
      InvalidDocumentError,
    );
  });

  it('rejects a file larger than the limit', () => {
    expect(() =>
      assertValidUpload(buildFile({ size: MAX_FILE_BYTES + 1 })),
    ).toThrow(InvalidDocumentError);
  });
});
