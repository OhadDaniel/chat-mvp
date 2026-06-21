import type { StorageService } from '../storage/storage.service';
import { RequestAvatarUploadOrchestrator } from './request-avatar-upload.orchestrator';

describe('RequestAvatarUploadOrchestrator', () => {
  it('builds a user-scoped key and presigns a POST upload for the requested content-type', async () => {
    const presignUpload = jest.fn(() =>
      Promise.resolve({ url: 'https://s3/upload', fields: { key: 'k' } }),
    );
    const orchestrator = new RequestAvatarUploadOrchestrator({
      presignUpload,
    } as unknown as StorageService);

    const result = await orchestrator.execute('user-1', {
      contentType: 'image/png',
    });

    // one fixed, user-scoped key (idempotent — a new upload overwrites it),
    // derived server-side and baked into the presigned POST, not returned
    expect(presignUpload).toHaveBeenCalledWith(
      'avatars/user-1/avatar',
      'image/png',
    );
    expect(result).toEqual({ url: 'https://s3/upload', fields: { key: 'k' } });
  });
});
