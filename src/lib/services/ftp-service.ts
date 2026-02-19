import { Client as FtpClient } from 'basic-ftp';
import SftpClient from 'ssh2-sftp-client';
import { Readable } from 'stream';

export type FtpProtocol = 'ftp' | 'sftp';

export interface FtpConfig {
    host: string;
    port?: number;
    user: string;
    password?: string;
    secure?: boolean; // For FTPS
    protocol: FtpProtocol;
}

export interface FileEntry {
    name: string;
    type: 'd' | '-' | 'l'; // directory, file, link
    size: number;
    modifyTime: Date;
}

export class FtpService {
    private ftpClient: FtpClient | null = null;
    private sftpClient: SftpClient | null = null;

    constructor(private config: FtpConfig) { }

    async connect(): Promise<void> {
        if (this.config.protocol === 'ftp') {
            this.ftpClient = new FtpClient();
            // this.ftpClient.ftp.verbose = true;
            await this.ftpClient.access({
                host: this.config.host,
                port: this.config.port || 21,
                user: this.config.user,
                password: this.config.password,
                secure: this.config.secure,
            });
        } else {
            this.sftpClient = new SftpClient();
            await this.sftpClient.connect({
                host: this.config.host,
                port: this.config.port || 22,
                username: this.config.user,
                password: this.config.password,
                // privateKey: ... (feature for later)
            });
        }
    }

    async list(path: string): Promise<FileEntry[]> {
        if (this.config.protocol === 'ftp') {
            if (!this.ftpClient || this.ftpClient.closed) await this.connect();
            const list = await this.ftpClient!.list(path);
            return list.map(item => ({
                name: item.name,
                type: item.isDirectory ? 'd' : '-', // simplified
                size: item.size,
                modifyTime: item.modifiedAt || new Date(),
            }));
        } else {
            if (!this.sftpClient) await this.connect();
            const list = await this.sftpClient!.list(path);
            return list.map(item => ({
                name: item.name,
                type: item.type as 'd' | '-' | 'l',
                size: item.size,
                modifyTime: new Date(item.modifyTime),
            }));
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            return true;
        } catch (error) {
            console.error('FTP Connection Error:', error);
            return false;
        } finally {
            await this.disconnect();
        }
    }

    async disconnect(): Promise<void> {
        if (this.ftpClient) {
            this.ftpClient.close();
            this.ftpClient = null;
        }
        if (this.sftpClient) {
            await this.sftpClient.end();
            this.sftpClient = null;
        }
    }
}
