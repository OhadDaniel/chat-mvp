import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const UPLOAD_URL_TTL_SECONDS = 60;

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
      // Keep presigned PUTs plain: don't add CRC checksum params a browser/curl
      // upload can't reproduce, which S3 would otherwise reject.
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
    this.bucket = configService.getOrThrow<string>('AVATAR_BUCKET');
    this.publicBaseUrl = configService.getOrThrow<string>(
      'AVATAR_PUBLIC_BASE_URL',
    );
  }

  presignUpload(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.client, command, {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
    });
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  /** The public CloudFront URL for a stored object — resolved once at upload. */
  srcUrlFor(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }
}
