import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { StorageProvider, FileEntry } from './storage-service';

export interface AzureConfig {
    connectionString: string;
    containerName: string;
}

export class AzureBlobService implements StorageProvider {
    private containerClient: ContainerClient;

    constructor(config: AzureConfig) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
        this.containerClient = blobServiceClient.getContainerClient(config.containerName);
    }

    async connect(): Promise<void> {
        await this.testConnection();
    }

    async testConnection(): Promise<boolean> {
        try {
            return await this.containerClient.exists();
        } catch (error) {
            console.error('Azure Connection Error:', error);
            return false;
        }
    }

    async list(path: string): Promise<FileEntry[]> {
        // Azure doesn't use leading slashes for prefixes usually
        const prefix = path.startsWith('/') ? path.slice(1) : path;

        try {
            const files: FileEntry[] = [];

            // List blobs
            // Note: Azure listing can be hierarchical or flat. Flat is default.
            // To mimic directory structure, we might need 'byHierarchy' but that's specialized.
            // For now, let's do a flat list and filter by prefix manually if needed, 
            // or rely on Azure's prefix filtering.

            for await (const blob of this.containerClient.listBlobsFlat({ prefix: prefix })) {
                files.push({
                    name: blob.name,
                    type: '-',
                    size: blob.properties.contentLength || 0,
                    modifyTime: blob.properties.lastModified,
                });
            }

            return files;
        } catch (error) {
            console.error('Azure List Error:', error);
            throw error;
        }
    }
}
