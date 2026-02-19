export interface FileEntry {
    name: string;
    type: 'd' | '-' | 'l'; // directory, file, link (cloud storage usually just has objects, but 'd' for prefixes)
    size: number;
    modifyTime: Date;
}

export interface StorageConfig {
    provider: 's3' | 'gcs' | 'azure';
    [key: string]: any;
}

export interface StorageProvider {
    connect(): Promise<void>;
    list(path: string): Promise<FileEntry[]>;
    testConnection(): Promise<boolean>;
}
