'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [displayName, setDisplayName] = useState('Bryan Paul');
    const [defaultProvider, setDefaultProvider] = useState('gemini');
    const [defaultHandling, setDefaultHandling] = useState('replace');
    const [autoReview, setAutoReview] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account and processing preferences.</p>
            </div>

            {/* Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 600 }}>
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Profile</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Display Name</label>
                            <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input className="input" value="bryan@example.com" disabled style={{ opacity: 0.6 }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                Email cannot be changed. Contact support for assistance.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Processing Defaults */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Processing Defaults</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Default AI Provider</label>
                            <select className="select" value={defaultProvider} onChange={e => setDefaultProvider(e.target.value)}>
                                <option value="gemini">Google Gemini</option>
                                <option value="claude">Anthropic Claude</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Default File Handling</label>
                            <select className="select" value={defaultHandling} onChange={e => setDefaultHandling(e.target.value)}>
                                <option value="replace">Replace original file</option>
                                <option value="rename_old">Keep original (rename to _original)</option>
                                <option value="rename_new">Save as new file (_accessible)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Auto-approve known images</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    Automatically approve alt text for images already in your library
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={autoReview}
                                onChange={e => setAutoReview(e.target.checked)}
                                style={{ width: 44, height: 24, accentColor: 'var(--brand-primary)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email notifications</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    Get notified when jobs complete or schedules run
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailNotifs}
                                onChange={e => setEmailNotifs(e.target.checked)}
                                style={{ width: 44, height: 24, accentColor: 'var(--brand-primary)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>API Keys (Optional)</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                        By default, PrettyGrandPDF uses our shared AI service. You can optionally provide your own API keys to use your own accounts.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Gemini API Key</label>
                            <input className="input" type="password" placeholder="AIza..." />
                        </div>
                        <div>
                            <label className="label">Anthropic API Key</label>
                            <input className="input" type="password" placeholder="sk-ant-..." />
                        </div>
                    </div>
                </div>

                {/* Save */}
                <button className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-end' }}>
                    Save Settings
                </button>
            </div>
        </div>
    );
}
