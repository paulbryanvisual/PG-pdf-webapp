'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';

// Mock data — will be replaced with Supabase queries
const stats = [
    { icon: '📄', value: '1,247', label: 'PDFs Processed' },
    { icon: '📑', value: '8,391', label: 'Pages Tagged' },
    { icon: '🖼️', value: '2,156', label: 'Images Described' },
    { icon: '✅', value: '96.3%', label: 'Accessibility Rate' },
];

const recentJobs = [
    { id: '1', name: 'Syllabi Batch Upload', files: 150, processed: 150, status: 'completed', date: '2 hours ago', credits: 210 },
    { id: '2', name: 'Annual Report.pdf', files: 1, processed: 1, status: 'completed', date: '5 hours ago', credits: 3 },
    { id: '3', name: 'FTP Auto-Sync', files: 12, processed: 8, status: 'processing', date: 'Running...', credits: 16 },
    { id: '4', name: 'HR Policies.zip', files: 25, processed: 0, status: 'pending', date: 'Queued', credits: 0 },
];

const statusBadge = (status: string) => {
    const badges: Record<string, string> = {
        completed: 'badge badge-success',
        processing: 'badge badge-primary',
        pending: 'badge badge-warning',
        failed: 'badge badge-error',
    };
    return badges[status] || 'badge';
};

export default function DashboardPage() {
    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back. Here&apos;s your PDF accessibility overview.</p>
            </div>

            {/* Stats Grid */}
            <div className={styles['stats-grid']}>
                {stats.map((stat, i) => (
                    <div key={i} className="card stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles['stat-icon']}>{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Jobs */}
            <div className={styles['jobs-section']}>
                <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Recent Jobs</h2>
                    <Link href="/jobs" className="btn btn-sm btn-ghost">View All →</Link>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className={styles['jobs-table']}>
                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Credits</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentJobs.map(job => (
                                <tr key={job.id}>
                                    <td className={styles['job-name']}>{job.name}</td>
                                    <td>
                                        <div className={styles['job-progress']}>
                                            <div className="progress-bar" style={{ width: 80 }}>
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${(job.processed / job.files) * 100}%` }}
                                                />
                                            </div>
                                            <span className={styles['job-progress-text']}>
                                                {job.processed}/{job.files}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={statusBadge(job.status)}>
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>{job.credits > 0 ? job.credits : '—'}</td>
                                    <td style={{ color: 'var(--text-tertiary)' }}>{job.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Quick Actions</h2>
            </div>
            <div className={styles['quick-actions']}>
                <Link href="/upload" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>📤</div>
                    <div className={styles['action-label']}>Upload PDFs</div>
                    <div className={styles['action-desc']}>Single, batch, or ZIP</div>
                </Link>
                <Link href="/alt-text" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>🖼️</div>
                    <div className={styles['action-label']}>Review Alt Text</div>
                    <div className={styles['action-desc']}>3 pending reviews</div>
                </Link>
                <Link href="/connections" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>☁️</div>
                    <div className={styles['action-label']}>Connect Storage</div>
                    <div className={styles['action-desc']}>Drive, Dropbox, FTP</div>
                </Link>
                <Link href="/billing" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>💳</div>
                    <div className={styles['action-label']}>Buy Credits</div>
                    <div className={styles['action-desc']}>47 remaining</div>
                </Link>
            </div>
        </div>
    );
}
