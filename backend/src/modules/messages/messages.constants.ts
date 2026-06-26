import type { UserProfile } from '../users/users.types';

export const ASSISTANT_SENDER_ID = 'assistant';

export const ASSISTANT_AVATAR_URL = '/maxwell-avatar.png';

export const ASSISTANT_PROFILE: UserProfile = {
  id: ASSISTANT_SENDER_ID,
  name: 'Maxwell',
  avatarInitials: 'M',
  avatarUrl: ASSISTANT_AVATAR_URL,
};
