import { Storage, File } from '@google-cloud/storage';
import { StorageProvider, FileEntry } from './storage-service';

export interface GCSConfig {
    bucket: string;
    serviceAccountJson: string; // The full JSON string of the service account key
}

export class GCSService implements StorageProvider {
    private storage: Storage;
    private bucket: string;

    constructor(config: GCSConfig) {
        this.bucket = config.bucket;

        // Parse the JSON string to get credentials
        let credentials;
        try {
            credentials = JSON.parse(config.serviceAccountJson);
        } catch (e) {
            throw new Error('Invalid Service Account JSON');
        }

        this.storage = new Storage({
            credentials,
            projectId: credentials.project_id,
        });
    }

    async connect(): Promise<void> {
        await this.testConnection();
    }

    async testConnection(): Promise<boolean> {
        try {
            const [exists] = await this.storage.bucket(this.bucket).exists();
            return exists;
        } catch (error) {
            console.error('GCS Connection Error:', error);
            return false;
        }
    }

    async list(path: string): Promise<FileEntry[]> {
        const prefix = path.startsWith('/') ? path.slice(1) : path;

        try {
            const [files] = await this.storage.bucket(this.bucket).getFiles({
                prefix: prefix,
                autoPaginate: false, // For now, just get the first page/default batch
                delimiter: '/'
            });

            // API behavior of getFiles with delimiter is a bit complex in Node SDK
            // It returns files in the first array index.
            // Prefixes (directories) are available on the query result object, but the type definition
            // sometimes makes it hard to access in a strongly typed way without casting or checking apiResponse.
            // For simple "flat" listing or basic implementation:

            const fileEntries: FileEntry[] = files.map(f => ({
                name: f.name.replace(prefix, ''),
                type: '-' as const,
                size: parseInt(f.metadata.size as string || '0'),
                modifyTime: new Date(f.metadata.updated as string || Date.now()),
            }));

            // If we need directories, we might need to look at apiResponse.prefixes
            // For now, let's return files.

            return fileEntries;

        } catch (error) {
            console.error('GCS List Error:', error);
            throw error;
        }
    }
}
