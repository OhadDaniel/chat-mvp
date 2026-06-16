import { randomUUID } from 'node:crypto';

/** Maps an accepted avatar content-type to the file extension we store it under. */
export const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** The content-types a client may request a presigned avatar upload for. */
export const ALLOWED_AVATAR_CONTENT_TYPES: string[] =
  Object.keys(EXT_BY_CONTENT_TYPE);

/**
 * Build the storage key for a user's avatar. The userId prefix is what lets us
 * prove ownership later (see `isOwnedAvatarKey`); the random UUID makes every
 * upload a fresh object so caches never serve a stale image.
 */
export function buildAvatarKey(userId: string, contentType: string): string {
  const ext = EXT_BY_CONTENT_TYPE[contentType];
  return `avatars/${userId}/${randomUUID()}.${ext}`;
}

/** True when the key lives under this user's avatar prefix — i.e. they own it. */
export function isOwnedAvatarKey(userId: string, key: string): boolean {
  return key.startsWith(`avatars/${userId}/`);
}
