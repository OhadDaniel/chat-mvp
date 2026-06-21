import type { ConversationsService } from '../conversations/conversations.service';
import type { StorageService } from '../storage/storage.service';
import { RequestGroupAvatarUploadOrchestrator } from './request-group-avatar-upload.orchestrator';

describe('RequestGroupAvatarUploadOrchestrator', () => {
  it('checks the caller is the creator, then presigns the derived group key', async () => {
    const assertGroupOwner = jest.fn(() => Promise.resolve());
    const presignUpload = jest.fn(() =>
      Promise.resolve({ url: 'https://s3/up', fields: { key: 'k' } }),
    );
    const orchestrator = new RequestGroupAvatarUploadOrchestrator(
      { assertGroupOwner } as unknown as ConversationsService,
      { presignUpload } as unknown as StorageService,
    );

    const result = await orchestrator.execute('conv-g', 'user-1', {
      contentType: 'image/png',
    });

    expect(assertGroupOwner).toHaveBeenCalledWith('conv-g', 'user-1');
    expect(presignUpload).toHaveBeenCalledWith(
      'groups/conv-g/avatar',
      'image/png',
    );
    expect(result).toEqual({ url: 'https://s3/up', fields: { key: 'k' } });
  });

  it('never presigns when the caller is not the creator', async () => {
    const assertGroupOwner = jest.fn(() =>
      Promise.reject(Object.assign(new Error('no'), { code: 'NOT_GROUP_OWNER' })),
    );
    const presignUpload = jest.fn();
    const orchestrator = new RequestGroupAvatarUploadOrchestrator(
      { assertGroupOwner } as unknown as ConversationsService,
      { presignUpload } as unknown as StorageService,
    );

    await expect(
      orchestrator.execute('conv-g', 'user-9', { contentType: 'image/png' }),
    ).rejects.toMatchObject({ code: 'NOT_GROUP_OWNER' });
    expect(presignUpload).not.toHaveBeenCalled();
  });
});
