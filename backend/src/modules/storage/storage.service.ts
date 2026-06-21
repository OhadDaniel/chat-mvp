import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AVATAR_MAX_BYTES } from './storage.helpers';

const UPLOAD_URL_TTL_SECONDS = 60;

export type PresignedUpload = {
  url: string;
  fields: Record<string, string>;
};

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(configService: ConfigService) {
    this.client = new S3Client({
      region: configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      // Keep presigned uploads plain: don't add CRC checksum params a browser
      // upload can't reproduce, which S3 would otherwise reject.
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
    this.bucket = configService.getOrThrow<string>('AVATAR_BUCKET');
    this.publicBaseUrl = configService.getOrThrow<string>(
      'AVATAR_PUBLIC_BASE_URL',
    );
  }

  /**
   * A presigned POST (not PUT): its signed policy carries a content-length-range
   * condition, so S3 itself rejects an upload larger than AVATAR_MAX_BYTES.
   */
  presignUpload(key: string, contentType: string): Promise<PresignedUpload> {
    return createPresignedPost(this.client, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [['content-length-range', 1, AVATAR_MAX_BYTES]],
      Fields: { 'Content-Type': contentType },
      Expires: UPLOAD_URL_TTL_SECONDS,
    });
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  /**
   * Does an object actually live at this key? A metadata-only HeadObject:
   * S3 answers 404 (NotFound) when the upload never landed, which lets us
   * reject a claimed avatar before persisting a URL that points at nothing.
   */
  async objectExists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (error) {
      if (isNotFound(error)) {
        return false;
      }
      throw error;
    }
  }

  /**
   * The public CloudFront URL for a stored object, resolved once at upload.
   * The `?v` cache-buster lets a new upload show immediately even though the
   * object key is fixed (the avatar always overwrites the same key).
   */
  srcUrlFor(key: string): string {
    return `${this.publicBaseUrl}/${key}?v=${Date.now()}`;
  }
}

/** HeadObject signals a missing object as a 404 / NotFound error. */
function isNotFound(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const { name, $metadata } = error as {
    name?: string;
    $metadata?: { httpStatusCode?: number };
  };
  return name === 'NotFound' || $metadata?.httpStatusCode === 404;
}
