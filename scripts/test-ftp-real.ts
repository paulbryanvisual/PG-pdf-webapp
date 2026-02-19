// scripts/test-ftp-real.ts
import { FtpService } from '../src/lib/services/ftp-service';

async function main() {
    console.log('Testing SFTP connection to test.rebex.net...');

    // Public Read-Only SFTP Server
    const service = new FtpService({
        host: 'test.rebex.net',
        user: 'demo',
        password: 'password',
        protocol: 'sftp',
        port: 22
    });

    try {
        console.log('Connecting...');
        const startTime = Date.now();
        await service.connect();
        console.log(`Connected in ${Date.now() - startTime}ms`);

        console.log('Listing root directory...');
        const files = await service.list('/');
        console.log(`Found ${files.length} items.`);

        files.forEach(f => console.log(` - [${f.type}] ${f.name} (${f.size} bytes) - ${f.modifyTime}`));

        console.log('Disconnecting...');
        await service.disconnect();
        console.log('Verification Success!');
    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    }
}

main();
