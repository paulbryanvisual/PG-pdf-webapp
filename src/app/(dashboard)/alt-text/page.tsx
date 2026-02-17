'use client';

import { useState } from 'react';
import styles from './alt-text.module.css';

// Mock review items — will be replaced with Supabase queries
const mockReviewItems = [
    {
        id: '1',
        image_hash: 'e09208c0',
        thumbnail_url: '',
        ai_generated_alt: 'East Texas A&M University Lion Head Logo — A stylized golden lion head with a mane, centered on a circular blue background with the university name arched above.',
        final_alt: null,
        is_decorative: false,
        status: 'pending' as const,
        page_number: 1,
        source_file: 'syllabus_2026_spring.pdf',
        occurrences: 500,
    },
    {
        id: '2',
        image_hash: 'e52c6361',
        thumbnail_url: '',
        ai_generated_alt: 'A thin horizontal decorative line separator, approximately 1 pixel in height.',
        final_alt: null,
        is_decorative: true,
        status: 'pending' as const,
        page_number: 3,
        source_file: 'annual_report.pdf',
        occurrences: 972,
    },
    {
        id: '3',
        image_hash: 'bd80bfca',
        thumbnail_url: '',
        ai_generated_alt: 'Live Chat icon — A speech bubble icon in blue with three dots inside, indicating an active chat feature.',
        final_alt: null,
        is_decorative: false,
        status: 'pending' as const,
        page_number: 12,
        source_file: 'course_catalog.pdf',
        occurrences: 170,
    },
];

type FilterTab = 'all' | 'pending' | 'approved' | 'edited';

export default function AltTextReviewPage() {
    const [filter, setFilter] = useState<FilterTab>('pending');
    const [items, setItems] = useState(mockReviewItems);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    const handleApprove = (id: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, status: 'approved' as const, final_alt: item.ai_generated_alt }
                    : item
            )
        );
    };

    const handleReject = (id: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: 'pending' as const, final_alt: null } : item
            )
        );
    };

    const handleEdit = (id: string, currentAlt: string) => {
        setEditingId(id);
        setEditText(currentAlt);
    };

    const handleSaveEdit = (id: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, status: 'edited' as const, final_alt: editText, ai_generated_alt: editText }
                    : item
            )
        );
        setEditingId(null);
    };

    const handleToggleDecorative = (id: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, is_decorative: !item.is_decorative }
                    : item
            )
        );
    };

    const handleApproveAll = () => {
        setItems(prev =>
            prev.map(item =>
                item.status === 'pending'
                    ? { ...item, status: 'approved' as const, final_alt: item.ai_generated_alt }
                    : item
            )
        );
    };

    const pendingCount = items.filter(i => i.status === 'pending').length;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Alt Text Review</h1>
                <p className="page-subtitle">
                    Review and approve AI-generated alt text for images found in your PDFs.
                    Repeated images are grouped — approve once, applied everywhere.
                </p>
            </div>

            <div className={styles['review-container']}>
                {/* Filter Bar */}
                <div className={styles['filter-bar']}>
                    <div className={styles['filter-tabs']}>
                        {(['all', 'pending', 'approved', 'edited'] as FilterTab[]).map(tab => (
                            <button
                                key={tab}
                                className={`${styles['filter-tab']} ${filter === tab ? styles.active : ''}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {tab === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
                            </button>
                        ))}
                    </div>

                    {pendingCount > 0 && (
                        <button className="btn btn-sm btn-accent" onClick={handleApproveAll}>
                            ✅ Approve All Pending
                        </button>
                    )}
                </div>

                {/* Bulk Info */}
                {filteredItems.length > 0 && (
                    <div className={styles['bulk-bar']}>
                        <div className={styles['bulk-info']}>
                            Showing {filteredItems.length} image{filteredItems.length !== 1 ? 's' : ''}
                            {filter !== 'all' && ` (${filter})`}
                        </div>
                    </div>
                )}

                {/* Review Cards */}
                {filteredItems.map(item => (
                    <div key={item.id} className="card">
                        <div className={styles['review-card']}>
                            {/* Thumbnail */}
                            <div className={styles['review-thumbnail']}>
                                {item.thumbnail_url ? (
                                    <img src={item.thumbnail_url} alt="Preview" />
                                ) : (
                                    <span className={styles['review-placeholder']}>
                                        {item.is_decorative ? '◻️' : '🖼️'}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className={styles['review-content']}>
                                {/* Meta */}
                                <div className={styles['review-meta']}>
                                    <span className={`badge ${item.status === 'approved' ? 'badge-success' : item.status === 'edited' ? 'badge-primary' : 'badge-warning'}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                    {item.occurrences > 1 && (
                                        <span className={styles['review-occurrence-badge']}>
                                            🔁 Found in {item.occurrences} PDFs
                                        </span>
                                    )}
                                    <span className={styles['review-source']}>
                                        Hash: {item.image_hash} &bull; Page {item.page_number} of {item.source_file}
                                    </span>
                                </div>

                                {/* AI Generated Alt Text */}
                                <div className={styles['alt-text-section']}>
                                    <div className={styles['alt-text-label']}>AI-Generated Alt Text</div>
                                    <div className={styles['alt-text-ai']}>
                                        {item.ai_generated_alt}
                                    </div>
                                </div>

                                {/* Editable Alt Text */}
                                {editingId === item.id ? (
                                    <div className={styles['alt-text-section']}>
                                        <div className={styles['alt-text-label']}>Edit Alt Text</div>
                                        <textarea
                                            className={styles['alt-text-editor']}
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            rows={3}
                                            autoFocus
                                        />
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleSaveEdit(item.id)}>
                                                Save
                                            </button>
                                            <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Decorative Toggle */}
                                <label className={styles['decorative-checkbox']}>
                                    <input
                                        type="checkbox"
                                        checked={item.is_decorative}
                                        onChange={() => handleToggleDecorative(item.id)}
                                    />
                                    Mark as decorative (screen readers will skip this image)
                                </label>

                                {/* Actions */}
                                <div className={styles['review-actions']}>
                                    {item.status === 'pending' && (
                                        <>
                                            <button className="btn btn-sm btn-accent" onClick={() => handleApprove(item.id)}>
                                                ✅ Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleEdit(item.id, item.ai_generated_alt)}
                                            >
                                                ✏️ Edit
                                            </button>
                                        </>
                                    )}
                                    {(item.status === 'approved' || item.status === 'edited') && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleEdit(item.id, item.final_alt || item.ai_generated_alt)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button className="btn btn-sm btn-ghost" onClick={() => handleReject(item.id)}>
                                                Reset to Pending
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                            {filter === 'pending' ? 'All caught up!' : 'No items to show'}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                            {filter === 'pending'
                                ? 'There are no pending alt text reviews. Process more PDFs to generate new ones.'
                                : 'Try changing the filter to see more items.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
