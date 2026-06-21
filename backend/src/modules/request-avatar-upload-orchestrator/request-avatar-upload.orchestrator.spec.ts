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

    // one fixed, user-scoped key (idempotent — a new upload overwrites it)
    expect(result.key).toBe('avatars/user-1/avatar');
    expect(presignUpload).toHaveBeenCalledWith(result.key, 'image/png');
    expect(result.url).toBe('https://s3/upload');
    expect(result.fields).toEqual({ key: 'k' });
  });
});
