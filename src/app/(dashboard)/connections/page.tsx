'use client';

import { useState } from 'react';

type ConnectionProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'ftp' | 's3' | 'box';

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
    box: { icon: '📋', name: 'Box', desc: 'Connect to your Box enterprise account' },
};

const mockConnections: Connection[] = [
    { id: '1', provider: 'ftp', label: 'Main Website (etamu.edu)', is_active: true, last_synced_at: '2 hours ago' },
    { id: '2', provider: 'google_drive', label: 'Department Shared Drive', is_active: true, last_synced_at: '1 day ago' },
];

export default function ConnectionsPage() {
    const [connections, setConnections] = useState(mockConnections);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ConnectionProvider | null>(null);

    // FTP form state
    const [ftpHost, setFtpHost] = useState('');
    const [ftpPort, setFtpPort] = useState('22');
    const [ftpUser, setFtpUser] = useState('');
    const [ftpPath, setFtpPath] = useState('/public_html/documents/');
    const [ftpProtocol, setFtpProtocol] = useState<'sftp' | 'ftp'>('sftp');

    const handleConnect = () => {
        if (selectedProvider === 'ftp' && ftpHost) {
            setConnections(prev => [...prev, {
                id: `${Date.now()}`,
                provider: 'ftp',
                label: `${ftpProtocol.toUpperCase()} — ${ftpHost}`,
                is_active: true,
                last_synced_at: null,
            }]);
            setShowAddModal(false);
            setSelectedProvider(null);
        } else if (selectedProvider && selectedProvider !== 'ftp') {
            // OAuth flow would go here
            alert(`OAuth flow for ${providerInfo[selectedProvider].name} will be implemented with the backend!`);
        }
    };

    const handleDisconnect = (id: string) => {
        setConnections(prev => prev.filter(c => c.id !== id));
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
            {connections.length > 0 && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Active Connections</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {connections.map(conn => {
                            const info = providerInfo[conn.provider];
                            return (
                                <div key={conn.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{conn.label}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                            {info.name} &bull; {conn.last_synced_at ? `Last synced: ${conn.last_synced_at}` : 'Never synced'}
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

                    {selectedProvider === 'ftp' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Protocol</label>
                                <select className="select" value={ftpProtocol} onChange={e => setFtpProtocol(e.target.value as 'sftp' | 'ftp')}>
                                    <option value="sftp">SFTP (Recommended)</option>
                                    <option value="ftp">FTP</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Host</label>
                                <input className="input" placeholder="ftp.example.com" value={ftpHost} onChange={e => setFtpHost(e.target.value)} />
                            </div>
                            <div>
                                <label className="label">Port</label>
                                <input className="input" type="number" value={ftpPort} onChange={e => setFtpPort(e.target.value)} />
                            </div>
                            <div>
                                <label className="label">Username</label>
                                <input className="input" placeholder="your-username" value={ftpUser} onChange={e => setFtpUser(e.target.value)} />
                            </div>
                            <div>
                                <label className="label">Remote Path</label>
                                <input className="input" placeholder="/public_html/documents/" value={ftpPath} onChange={e => setFtpPath(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Click Connect to start the OAuth authorization flow with {selectedProvider && providerInfo[selectedProvider].name}.
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                        <button className="btn btn-primary" onClick={handleConnect}>
                            🔗 Connect
                        </button>
                        <button className="btn btn-ghost" onClick={() => { setShowAddModal(false); setSelectedProvider(null); }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
