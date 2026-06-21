/** The content-types a client may request a presigned avatar upload for. */
export const ALLOWED_AVATAR_CONTENT_TYPES: string[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

/** Hard upper bound on an avatar upload, enforced by S3 via the presigned POST policy. */
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

/**
 * One fixed object per user, derived server-side from the userId: a new upload
 * overwrites it in place, so the bucket never accumulates stale copies and the
 * upload is idempotent. Because the key is derived (never sent by the client),
 * there is nothing to validate ownership of.
 */
export function buildAvatarKey(userId: string): string {
  return `avatars/${userId}/avatar`;
}
