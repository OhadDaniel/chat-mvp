import { randomUUID } from 'node:crypto';
import { S3Client } from '@aws-sdk/client-s3';
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

  /**
   * The public CloudFront URL for a stored object. The avatar key is fixed and
   * overwritten in place, so a fresh `?v` token makes a new upload show
   * immediately instead of serving a cached copy of the previous one.
   */
  srcUrlFor(key: string): string {
    return `${this.publicBaseUrl}/${key}?v=${randomUUID()}`;
  }
}
