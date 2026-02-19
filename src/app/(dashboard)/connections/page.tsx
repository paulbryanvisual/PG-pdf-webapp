'use client';

import { useState, useEffect } from 'react';

type ConnectionProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'ftp' | 's3' | 'gcs' | 'azure' | 'box';

interface Connection {
    id: string;
    provider: ConnectionProvider;
    label: string;
    is_active: boolean;
    last_synced_at: string | null;
}

const providerInfo: Record<ConnectionProvider, { icon: string; name: string; desc: string }> = {
    google_drive: { icon: '📁', name: 'Google Drive', desc: 'Connect your Google Drive to pull PDFs directly' },
    dropbox: { icon: '📦', name: 'Dropbox', desc: 'Sync PDFs from your Dropbox folders' },
    onedrive: { icon: '☁️', name: 'OneDrive', desc: 'Access PDFs in your Microsoft OneDrive' },
    ftp: { icon: '🖥️', name: 'FTP / SFTP', desc: 'Connect to your web hosting server via FTP or SFTP' },
    s3: { icon: '🪣', name: 'AWS S3', desc: 'Pull PDFs from Amazon S3 buckets' },
    gcs: { icon: '🔷', name: 'Google Cloud Storage', desc: 'Pull PDFs from GCS buckets' },
    azure: { icon: '🟦', name: 'Azure Blob Storage', desc: 'Pull PDFs from Azure containers' },
    box: { icon: '📋', name: 'Box', desc: 'Connect to your Box enterprise account' },
};


const mockConnections: Connection[] = [
    { id: '1', provider: 'ftp', label: 'Main Website (etamu.edu)', is_active: true, last_synced_at: '2 hours ago' },
    { id: '2', provider: 'google_drive', label: 'Department Shared Drive', is_active: true, last_synced_at: '1 day ago' },
];

export default function ConnectionsPage() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ConnectionProvider | null>(null);

    // S3 form state
    const [s3Bucket, setS3Bucket] = useState('');
    const [s3Region, setS3Region] = useState('us-east-1');
    const [s3AccessKey, setS3AccessKey] = useState('');
    const [s3SecretKey, setS3SecretKey] = useState('');
    const [s3Endpoint, setS3Endpoint] = useState(''); // Optional

    // GCS form state
    const [gcsBucket, setGcsBucket] = useState('');
    const [gcsServiceAccount, setGcsServiceAccount] = useState('');

    // Azure form state
    const [azureContainer, setAzureContainer] = useState('');
    const [azureConnectionString, setAzureConnectionString] = useState('');

    // FTP form state
    const [ftpHost, setFtpHost] = useState('');
    const [ftpPort, setFtpPort] = useState('22');
    const [ftpUser, setFtpUser] = useState('');
    const [ftpPassword, setFtpPassword] = useState('');
    const [ftpPath, setFtpPath] = useState('/public_html/documents/');
    const [ftpProtocol, setFtpProtocol] = useState<'sftp' | 'ftp'>('sftp');
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const res = await fetch('/api/connections');
            const data = await res.json();
            if (data.connections) {
                setConnections(data.connections);
            }
        } catch (error) {
            console.error('Failed to fetch connections', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setErrorMsg(null);
        setIsConnecting(true);
        try {
            let body = {};

            if (selectedProvider === 'ftp') {
                if (!ftpHost || !ftpUser || !ftpPassword) {
                    throw new Error('Please fill in all required fields');
                }
                body = {
                    provider: 'ftp',
                    protocol: ftpProtocol,
                    host: ftpHost,
                    port: ftpPort,
                    user: ftpUser,
                    password: ftpPassword,
                    path: ftpPath
                };
            } else if (selectedProvider === 's3') {
                if (!s3Bucket || !s3Region || !s3AccessKey || !s3SecretKey) {
                    throw new Error('Please fill in all required fields (Bucket, Region, Access Key, Secret Key)');
                }
                body = {
                    provider: 's3',
                    bucket: s3Bucket,
                    region: s3Region,
                    accessKeyId: s3AccessKey,
                    secretAccessKey: s3SecretKey,
                    endpoint: s3Endpoint
                };
            } else if (selectedProvider === 'gcs') {
                if (!gcsBucket || !gcsServiceAccount) {
                    throw new Error('Please fill in all required fields (Bucket, Service Account JSON)');
                }
                // Basic validation of JSON
                try {
                    JSON.parse(gcsServiceAccount);
                } catch (e) {
                    throw new Error('Service Account must be valid JSON');
                }

                body = {
                    provider: 'gcs',
                    bucket: gcsBucket,
                    serviceAccountJson: gcsServiceAccount,
                };
            } else if (selectedProvider === 'azure') {
                if (!azureContainer || !azureConnectionString) {
                    throw new Error('Please fill in all required fields (Container Name, Connection String)');
                }
                body = {
                    provider: 'azure',
                    containerName: azureContainer,
                    connectionString: azureConnectionString,
                };
            } else {
                // OAuth flow would go here
                throw new Error(`OAuth flow for ${providerInfo[selectedProvider!].name} will be implemented with the backend!`);
            }

            const res = await fetch('/api/connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to connect');
            }

            setConnections(prev => [data.connection, ...prev]);
            setShowAddModal(false);
            setSelectedProvider(null);

            // Reset forms
            setFtpHost(''); setFtpUser(''); setFtpPassword(''); setFtpPath('/public_html/documents/');
            setS3Bucket(''); setS3AccessKey(''); setS3SecretKey(''); setS3Endpoint('');
            setGcsBucket(''); setGcsServiceAccount('');
            setAzureContainer(''); setAzureConnectionString('');
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async (id: string) => {
        // Optimistic update
        setConnections(prev => prev.filter(c => c.id !== id));

        try {
            const res = await fetch(`/api/connections/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                console.error('Failed to delete connection');
                // Revert if failed (optional, but good UX)
                fetchConnections();
            }
        } catch (error) {
            console.error('Failed to disconnect', error);
            fetchConnections();
        }
    };

    const renderForm = () => {
        switch (selectedProvider) {
            case 'ftp':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Protocol</label>
                                <select className="select" value={ftpProtocol} onChange={e => setFtpProtocol(e.target.value as 'sftp' | 'ftp')}>
                                    <option value="sftp">SFTP</option>
                                    <option value="ftp">FTP</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Port</label>
                                <input className="input" type="number" value={ftpPort} onChange={e => setFtpPort(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="label">Host</label>
                            <input className="input" placeholder="ftp.example.com" value={ftpHost} onChange={e => setFtpHost(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Username</label>
                            <input className="input" placeholder="your-username" value={ftpUser} onChange={e => setFtpUser(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input className="input" type="password" placeholder="••••••••" value={ftpPassword} onChange={e => setFtpPassword(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Remote Path</label>
                            <input className="input" placeholder="/public_html/documents/" value={ftpPath} onChange={e => setFtpPath(e.target.value)} />
                        </div>
                    </div>
                );
            case 's3':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                            Supports AWS S3, MinIO, DigitalOcean Spaces, Wasabi, etc.
                        </div>
                        <div>
                            <label className="label">Bucket Name</label>
                            <input className="input" placeholder="my-pdf-bucket" value={s3Bucket} onChange={e => setS3Bucket(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Region</label>
                            <input className="input" placeholder="us-east-1" value={s3Region} onChange={e => setS3Region(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Access Key ID</label>
                            <input className="input" placeholder="AKIA..." value={s3AccessKey} onChange={e => setS3AccessKey(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Secret Access Key</label>
                            <input className="input" type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" value={s3SecretKey} onChange={e => setS3SecretKey(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Custom Endpoint (Optional)</label>
                            <input className="input" placeholder="https://nyc3.digitaloceanspaces.com" value={s3Endpoint} onChange={e => setS3Endpoint(e.target.value)} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                Leave blank for standard AWS S3. Required for compatible services.
                            </div>
                        </div>
                    </div>
                );
            case 'gcs':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                            Use a Service Account with <b>Storage Object Admin</b> permissions.
                        </div>
                        <div>
                            <label className="label">Bucket Name</label>
                            <input className="input" placeholder="my-gcs-bucket" value={gcsBucket} onChange={e => setGcsBucket(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Service Account JSON</label>
                            <textarea
                                className="input"
                                rows={6}
                                placeholder='{"type": "service_account", "project_id": "..."}'
                                value={gcsServiceAccount}
                                onChange={e => setGcsServiceAccount(e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                            />
                        </div>
                    </div>
                );
            case 'azure':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                            Use the <b>Connection String</b> from your Storage Account Access Keys.
                        </div>
                        <div>
                            <label className="label">Container Name</label>
                            <input className="input" placeholder="my-container" value={azureContainer} onChange={e => setAzureContainer(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Connection String</label>
                            <textarea
                                className="input"
                                rows={4}
                                placeholder="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
                                value={azureConnectionString}
                                onChange={e => setAzureConnectionString(e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                        Click Connect to start the OAuth authorization flow with {selectedProvider && providerInfo[selectedProvider].name}.
                    </p>
                );
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Cloud Connections</h1>
                <p className="page-subtitle">
                    Connect cloud storage services and web hosting servers to automatically pull and process PDFs.
                </p>
            </div>

            {/* Existing Connections */}
            {loading ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading connections...</div>
            ) : connections.length > 0 ? (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Active Connections</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {connections.map(conn => {
                            const info = providerInfo[conn.provider] || { icon: '❓', name: 'Unknown', desc: '' };
                            return (
                                <div key={conn.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{conn.label}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                            {info.name} &bull; {conn.last_synced_at ? `Last synced: ${new Date(conn.last_synced_at).toLocaleString()}` : 'Never synced'}
                                        </div>
                                    </div>
                                    <span className="badge badge-success">Connected</span>
                                    <button className="btn btn-sm btn-secondary">Sync Now</button>
                                    <button className="btn btn-sm btn-ghost" onClick={() => handleDisconnect(conn.id)}>Disconnect</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No active connections. Add one below.
                </div>
            )}

            {/* Add Connection */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Add Connection</h2>

            {!showAddModal ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                    {(Object.entries(providerInfo) as [ConnectionProvider, typeof providerInfo[ConnectionProvider]][]).map(([key, info]) => (
                        <button
                            key={key}
                            className="card"
                            onClick={() => { setSelectedProvider(key); setShowAddModal(true); }}
                            style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-6)', border: 'none', background: 'var(--bg-elevated)' }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{info.icon}</div>
                            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 'var(--space-1)' }}>{info.name}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{info.desc}</div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ maxWidth: 500 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {selectedProvider && providerInfo[selectedProvider].icon} Connect {selectedProvider && providerInfo[selectedProvider].name}
                    </h3>

                    {renderForm()}

                    {errorMsg && (
                        <div style={{ color: 'var(--text-error)', fontSize: '0.875rem', background: 'var(--bg-error-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-4)' }}>
                            {errorMsg}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                        <button className="btn btn-primary" onClick={handleConnect} disabled={isConnecting}>
                            {isConnecting ? 'Testing Connection...' : '🔗 Connect'}
                        </button>
                        <button className="btn btn-ghost" onClick={() => { setShowAddModal(false); setSelectedProvider(null); }} disabled={isConnecting}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
