'use client';

import { useState } from 'react';

// Mock schedule data
interface Schedule {
    id: string;
    connection_label: string;
    remote_path: string;
    file_handling: 'replace' | 'rename_old' | 'rename_new';
    cron_schedule: string;
    is_active: boolean;
    last_run_at: string | null;
    files_processed: number;
}

const mockSchedules: Schedule[] = [
    {
        id: '1',
        connection_label: 'Main Website (etamu.edu)',
        remote_path: '/public_html/documents/',
        file_handling: 'replace',
        cron_schedule: '0 * * * *',
        is_active: true,
        last_run_at: '35 minutes ago',
        files_processed: 847,
    },
];

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
    const [showNew, setShowNew] = useState(false);
    const [newPath, setNewPath] = useState('/public_html/documents/');
    const [newHandling, setNewHandling] = useState<'replace' | 'rename_old' | 'rename_new'>('replace');
    const [newRenamePattern, setNewRenamePattern] = useState('{name}_accessible.{ext}');
    const [newFrequency, setNewFrequency] = useState('hourly');

    const handleCreate = () => {
        setSchedules(prev => [...prev, {
            id: `${Date.now()}`,
            connection_label: 'Pending connection...',
            remote_path: newPath,
            file_handling: newHandling,
            cron_schedule: newFrequency === 'hourly' ? '0 * * * *' : newFrequency === 'daily' ? '0 6 * * *' : '0 6 * * 1',
            is_active: true,
            last_run_at: null,
            files_processed: 0,
        }]);
        setShowNew(false);
    };

    const toggleActive = (id: string) => {
        setSchedules(prev => prev.map(s =>
            s.id === id ? { ...s, is_active: !s.is_active } : s
        ));
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">Auto-Process Schedules</h1>
                    <p className="page-subtitle">
                        Automatically scan connected servers for PDFs, process them, and upload the accessible versions back.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNew(true)}>
                    ➕ New Schedule
                </button>
            </div>

            {/* New Schedule Form */}
            {showNew && (
                <div className="card" style={{ maxWidth: 500, marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Create Schedule</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Connection</label>
                            <select className="select">
                                <option>Main Website (etamu.edu) — FTP</option>
                                <option>Department Shared Drive — Google Drive</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Remote Path to Monitor</label>
                            <input className="input" placeholder="/public_html/documents/" value={newPath} onChange={e => setNewPath(e.target.value)} />
                        </div>

                        <div>
                            <label className="label">File Handling</label>
                            <select className="select" value={newHandling} onChange={e => setNewHandling(e.target.value as typeof newHandling)}>
                                <option value="replace">Replace original file</option>
                                <option value="rename_old">Keep original (rename to _original)</option>
                                <option value="rename_new">Save as new file (_accessible)</option>
                            </select>
                        </div>

                        {newHandling === 'rename_new' && (
                            <div>
                                <label className="label">Rename Pattern</label>
                                <input className="input" value={newRenamePattern} onChange={e => setNewRenamePattern(e.target.value)} />
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                    Example: report.pdf → report_accessible.pdf
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="label">Frequency</label>
                            <select className="select" value={newFrequency} onChange={e => setNewFrequency(e.target.value)}>
                                <option value="hourly">Every hour</option>
                                <option value="daily">Daily at 6 AM</option>
                                <option value="weekly">Weekly on Monday</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                        <button className="btn btn-primary" onClick={handleCreate}>Create Schedule</button>
                        <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Existing Schedules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {schedules.map(schedule => (
                    <div key={schedule.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5)' }}>
                        <div style={{ fontSize: '2rem' }}>🔄</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 'var(--space-1)' }}>
                                {schedule.connection_label}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <span>📂 {schedule.remote_path}</span>
                                <span>🔧 {schedule.file_handling === 'replace' ? 'Replace' : schedule.file_handling === 'rename_old' ? 'Rename Old' : 'Rename New'}</span>
                                <span>⏰ {schedule.cron_schedule === '0 * * * *' ? 'Hourly' : schedule.cron_schedule === '0 6 * * *' ? 'Daily' : 'Weekly'}</span>
                                {schedule.last_run_at && <span>✅ Last run: {schedule.last_run_at}</span>}
                                <span>📄 {schedule.files_processed} processed</span>
                            </div>
                        </div>
                        <span className={`badge ${schedule.is_active ? 'badge-success' : 'badge-error'}`}>
                            {schedule.is_active ? 'Active' : 'Paused'}
                        </span>
                        <button className="btn btn-sm btn-secondary" onClick={() => toggleActive(schedule.id)}>
                            {schedule.is_active ? '⏸ Pause' : '▶️ Resume'}
                        </button>
                        <button className="btn btn-sm btn-secondary">Run Now</button>
                    </div>
                ))}
            </div>

            {schedules.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔄</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>No schedules yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                        Connect a server and create a schedule to automatically process PDFs.
                    </p>
                </div>
            )}
        </div>
    );
}
