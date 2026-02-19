'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import ProcessingActivityChart from '@/components/dashboard/ProcessingActivityChart';
import AccessibilityScoreChart from '@/components/dashboard/AccessibilityScoreChart';
import ExportButton from '@/components/dashboard/ExportButton';
import { createBrowserClient } from '@supabase/ssr'; // Direct import since lib/supabase is lazy
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';

// Helper for badge styles
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
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Using the API route for aggregated stats
                const res = await fetch('/api/reports/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setActivity(data.activity);
                    setRecentJobs(data.recent);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Default values if no data
    const totalFiles = stats?.totalFiles || 0;
    const processedFiles = stats?.processedFiles || 0;
    const avgScore = stats?.avgScore || 0;
    // Mock other stats that might not be in basic job table yet
    const pagesTagged = Math.round(processedFiles * 12.5); // Estimate
    const imagesDescribed = Math.round(processedFiles * 3.2); // Estimate

    const statCards = [
        { icon: '📄', value: totalFiles.toLocaleString(), label: 'Files Uploaded' },
        { icon: '📑', value: processedFiles.toLocaleString(), label: 'Files Processed' }, // Changed label for clarity
        { icon: '🖼️', value: imagesDescribed.toLocaleString(), label: 'Images Described' },
        { icon: '✅', value: `${avgScore}%`, label: 'Avg. Score' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back. Here&apos;s your PDF accessibility overview.</p>
                </div>
                <ExportButton />
            </div>

            {/* Stats Grid */}
            <div className={styles['stats-grid']}>
                {statCards.map((stat, i) => (
                    <div key={i} className="card stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles['stat-icon']}>{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Processing Activity (7 Days)</h2>
                    <ProcessingActivityChart data={activity} />
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold mb-4">Accessibility Score</h2>
                    <AccessibilityScoreChart score={avgScore} />
                </div>
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
                            {recentJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        No recent jobs found. <Link href="/upload" className="link link-primary">Upload a PDF</Link> to get started.
                                    </td>
                                </tr>
                            ) : (
                                recentJobs.map((job: any) => (
                                    <tr key={job.id}>
                                        <td className={styles['job-name']}>{job.name}</td>
                                        <td>
                                            <div className={styles['job-progress']}>
                                                <div className="progress-bar" style={{ width: 80 }}>
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${job.total_files > 0 ? (job.processed_files / job.total_files) * 100 : 0}%` }}
                                                    />
                                                </div>
                                                <span className={styles['job-progress-text']}>
                                                    {job.processed_files}/{job.total_files}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={statusBadge(job.status)}>
                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{job.credits_cost > 0 ? job.credits_cost : '—'}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
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
                    <div className={styles['action-desc']}>Pending reviews</div>
                </Link>
                <Link href="/connections" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>☁️</div>
                    <div className={styles['action-label']}>Connect Storage</div>
                    <div className={styles['action-desc']}>Drive, Dropbox, FTP</div>
                </Link>
                <Link href="/billing" className={`card ${styles['action-card']}`}>
                    <div className={styles['action-icon']}>💳</div>
                    <div className={styles['action-label']}>Buy Credits</div>
                    <div className={styles['action-desc']}>Get more packs</div>
                </Link>
            </div>
        </div>
    );
}
