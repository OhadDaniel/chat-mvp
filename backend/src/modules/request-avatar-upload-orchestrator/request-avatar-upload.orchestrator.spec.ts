import type { StorageService } from '../storage/storage.service';
import { RequestAvatarUploadOrchestrator } from './request-avatar-upload.orchestrator';

describe('RequestAvatarUploadOrchestrator', () => {
  it('builds a user-scoped key and presigns an upload for the requested content-type', async () => {
    const presignUpload = jest.fn(() => Promise.resolve('https://s3/upload'));
    const orchestrator = new RequestAvatarUploadOrchestrator({
      presignUpload,
    } as unknown as StorageService);

    const result = await orchestrator.run('user-1', {
      contentType: 'image/png',
    });

    // the key is scoped to the user (ownership) and ends with the mapped extension
    expect(result.key).toMatch(/^avatars\/user-1\/[0-9a-f-]+\.png$/);
    expect(presignUpload).toHaveBeenCalledWith(result.key, 'image/png');
    expect(result.uploadUrl).toBe('https://s3/upload');
  });
});
