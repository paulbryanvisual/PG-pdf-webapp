import { S3Client, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3';
import { StorageProvider, FileEntry } from './storage-service';

export interface S3Config {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    endpoint?: string; // Optional for MinIO, DigitalOcean, etc.
}

export class S3Service implements StorageProvider {
    private client: S3Client;
    private bucket: string;

    constructor(config: S3Config) {
        this.bucket = config.bucket;
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            endpoint: config.endpoint,
            forcePathStyle: !!config.endpoint, // Required for MinIO
        });
    }

    async connect(): Promise<void> {
        // S3 client is stateless, but we can verify credentials here
        await this.testConnection();
    }

    async testConnection(): Promise<boolean> {
        try {
            // Try to head the bucket to verify access
            await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
            return true;
        } catch (error) {
            console.error('S3 Connection Error:', error);
            return false;
        }
    }

    async list(path: string): Promise<FileEntry[]> {
        // S3 prefixes don't start with /
        const prefix = path.startsWith('/') ? path.slice(1) : path;

        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucket,
                Prefix: prefix,
                Delimiter: '/', // To mimic directory structure
            });

            const response = await this.client.send(command);

            const files: FileEntry[] = [];

            // Directories (CommonPrefixes)
            if (response.CommonPrefixes) {
                response.CommonPrefixes.forEach(p => {
                    if (p.Prefix) {
                        files.push({
                            name: p.Prefix.replace(prefix, '').replace('/', ''), // Get relative name
                            type: 'd',
                            size: 0,
                            modifyTime: new Date(),
                        });
                    }
                });
            }

            // Files (Contents)
            if (response.Contents) {
                response.Contents.forEach(o => {
                    // detailed filtering to avoid showing the folder itself as a file
                    if (o.Key && o.Key !== prefix && !o.Key.endsWith('/')) {
                        files.push({
                            name: o.Key.replace(prefix, ''),
                            type: '-',
                            size: o.Size || 0,
                            modifyTime: o.LastModified || new Date(),
                        });
                    }
                });
            }

            return files;
        } catch (error) {
            console.error('S3 List Error:', error);
            throw error;
        }
    }
}
