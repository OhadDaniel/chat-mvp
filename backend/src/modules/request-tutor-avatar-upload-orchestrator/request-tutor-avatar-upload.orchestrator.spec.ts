import { RequestTutorAvatarUploadOrchestrator } from './request-tutor-avatar-upload.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StorageService } from '../storage/storage.service';

describe('RequestTutorAvatarUploadOrchestrator', () => {
  let conversations: jest.Mocked<
    Pick<ConversationsService, 'assertTutorOwner'>
  >;
  let storage: jest.Mocked<Pick<StorageService, 'presignUpload'>>;
  let orchestrator: RequestTutorAvatarUploadOrchestrator;

  beforeEach(() => {
    conversations = {
      assertTutorOwner: jest.fn().mockResolvedValue(undefined),
    };
    storage = {
      presignUpload: jest
        .fn()
        .mockResolvedValue({ url: 'https://s3', fields: { key: 'tutors/x' } }),
    };
    orchestrator = new RequestTutorAvatarUploadOrchestrator(
      conversations as unknown as ConversationsService,
      storage as unknown as StorageService,
    );
  });

  it('checks ownership, then returns a presigned upload for the tutor key', async () => {
    const result = await orchestrator.execute('tutor-1', 'user-1', {
      contentType: 'image/png',
    });

    expect(conversations.assertTutorOwner).toHaveBeenCalledWith(
      'tutor-1',
      'user-1',
    );
    expect(storage.presignUpload).toHaveBeenCalledWith(
      'tutors/tutor-1/avatar',
      'image/png',
    );
    expect(result).toEqual({ url: 'https://s3', fields: { key: 'tutors/x' } });
  });

  it('does not presign when the tutor is not owned', async () => {
    conversations.assertTutorOwner.mockRejectedValue(new Error('not owner'));

    await expect(
      orchestrator.execute('tutor-1', 'user-1', { contentType: 'image/png' }),
    ).rejects.toThrow('not owner');
    expect(storage.presignUpload).not.toHaveBeenCalled();
  });
});
