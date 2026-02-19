import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { FtpService, FtpConfig } from '@/lib/services/ftp-service';
import { S3Service, S3Config } from '@/lib/services/s3-service';
import { GCSService, GCSConfig } from '@/lib/services/gcs-service';
import { AzureBlobService, AzureConfig } from '@/lib/services/azure-service';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, ...config } = body;

    let isConnected = false;
    let label = '';
    // Clean config for database (remove undefineds, etc)
    let dbConfig = {};

    try {
        if (provider === 'ftp') {
            const ftpConfig: FtpConfig = {
                host: config.host,
                port: parseInt(config.port),
                user: config.user,
                password: config.password,
                protocol: config.protocol as 'ftp' | 'sftp',
            };
            const service = new FtpService(ftpConfig);
            isConnected = await service.testConnection();
            label = `${config.protocol.toUpperCase()} - ${config.host}`;
            dbConfig = ftpConfig;

        } else if (provider === 's3') {
            const s3Config: S3Config = {
                bucket: config.bucket,
                region: config.region,
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                endpoint: config.endpoint || undefined,
            };
            const service = new S3Service(s3Config);
            isConnected = await service.testConnection();
            label = `S3 - ${config.bucket}`;
            dbConfig = { ...s3Config };

        } else if (provider === 'gcs') {
            const gcsConfig: GCSConfig = {
                bucket: config.bucket,
                serviceAccountJson: config.serviceAccountJson,
            };
            const service = new GCSService(gcsConfig);
            isConnected = await service.testConnection();
            label = `GCS - ${config.bucket}`;
            // Store just what's needed. Ideally encrypt serviceAccountJson.
            dbConfig = { ...gcsConfig };

        } else if (provider === 'azure') {
            const azureConfig: AzureConfig = {
                connectionString: config.connectionString,
                containerName: config.containerName,
            };
            const service = new AzureBlobService(azureConfig);
            isConnected = await service.testConnection();
            label = `Azure - ${config.containerName}`;
            dbConfig = { ...azureConfig };

        } else {
            return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
        }
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: `Connection failed: ${err.message}` }, { status: 400 });
    }

    if (!isConnected) {
        return NextResponse.json({ error: 'Failed to verify connection. Check credentials.' }, { status: 400 });
    }

    // 2. Save to Database
    const { data, error } = await supabase
        .from('cloud_connections')
        .insert({
            profile_id: user.id,
            provider,
            label,
            config: dbConfig,
            last_used_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, connection: data });
}
