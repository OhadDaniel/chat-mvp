/** The content-types a client may request a presigned avatar upload for. */
export const ALLOWED_AVATAR_CONTENT_TYPES: string[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

/** Hard upper bound on an avatar upload, enforced by S3 via the presigned POST policy. */
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

/**
 * One fixed object per user: a new upload overwrites it, so the bucket never
 * accumulates stale copies — the upload is idempotent. The userId prefix is
 * what proves ownership later (see `isOwnedAvatarKey`).
 */
export function buildAvatarKey(userId: string): string {
  return `avatars/${userId}/avatar`;
}

/** True when the key lives under this user's avatar prefix — i.e. they own it. */
export function isOwnedAvatarKey(userId: string, key: string): boolean {
  return key.startsWith(`avatars/${userId}/`);
}
