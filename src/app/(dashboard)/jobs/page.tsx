'use client';

import Link from 'next/link';

// Mock data
const mockJobs = [
    { id: '1', name: 'Syllabi Batch Upload', source: 'upload', files: 150, processed: 150, failed: 0, status: 'completed', credits: 210, created: 'Feb 15, 2026 2:30 PM', time: '12m 45s' },
    { id: '2', name: 'Annual Report.pdf', source: 'upload', files: 1, processed: 1, failed: 0, status: 'completed', credits: 3, created: 'Feb 15, 2026 10:15 AM', time: '28s' },
    { id: '3', name: 'FTP Auto-Sync', source: 'ftp', files: 12, processed: 8, failed: 1, status: 'processing', credits: 16, created: 'Feb 15, 2026 4:00 PM', time: '—' },
    { id: '4', name: 'HR Policies.zip', source: 'upload', files: 25, processed: 0, failed: 0, status: 'pending', credits: 0, created: 'Feb 15, 2026 4:30 PM', time: '—' },
    { id: '5', name: 'Course Catalog Drive Sync', source: 'google_drive', files: 45, processed: 45, failed: 2, status: 'completed', credits: 67, created: 'Feb 14, 2026 6:00 AM', time: '8m 12s' },
];

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        completed: 'badge badge-success',
        processing: 'badge badge-primary',
        pending: 'badge badge-warning',
        failed: 'badge badge-error',
    };
    return map[status] || 'badge';
};

const sourceIcon = (source: string) => {
    const map: Record<string, string> = {
        upload: '📤',
        ftp: '🖥️',
        google_drive: '📁',
        dropbox: '📦',
        s3: '🪣',
    };
    return map[source] || '📄';
};

export default function JobsPage() {
    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Jobs</h1>
                    <p className="page-subtitle">All PDF processing jobs and their status.</p>
                </div>
                <Link href="/upload" className="btn btn-primary">📤 New Upload</Link>
            </div>

            {/* Jobs Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Source', 'Job', 'Files', 'Progress', 'Status', 'Credits', 'Duration', 'Created'].map(h => (
                                <th key={h} style={{ textAlign: h === 'Credits' || h === 'Files' ? 'right' : 'left', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockJobs.map(job => (
                            <tr key={job.id} style={{ cursor: 'pointer' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)', fontSize: '1.25rem' }}>
                                    {sourceIcon(job.source)}
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{job.name}</div>
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)', textAlign: 'right', fontSize: '0.875rem' }}>
                                    {job.files}
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className="progress-bar" style={{ width: 80 }}>
                                            <div className="progress-bar-fill" style={{ width: `${(job.processed / job.files) * 100}%` }} />
                                        </div>
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                            {job.processed}/{job.files}
                                            {job.failed > 0 && <span style={{ color: 'var(--brand-error)' }}> ({job.failed} failed)</span>}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)' }}>
                                    <span className={statusBadge(job.status)}>
                                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600 }}>
                                    {job.credits > 0 ? job.credits : '—'}
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                    {job.time}
                                </td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-default)', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                    {job.created}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
