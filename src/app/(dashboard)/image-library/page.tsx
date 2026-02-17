'use client';

import { useState } from 'react';

// Mock data — will be replaced with Supabase queries
const mockImages = [
    {
        id: '1',
        image_hash: 'e09208c0',
        alt_text: 'East Texas A&M University Lion Head Logo',
        is_decorative: false,
        occurrences: 500,
        auto_detected: true,
        reviewed: true,
    },
    {
        id: '2',
        image_hash: 'e52c6361',
        alt_text: '',
        is_decorative: true,
        occurrences: 972,
        auto_detected: true,
        reviewed: true,
    },
    {
        id: '3',
        image_hash: '719fe162',
        alt_text: 'East Texas A&M University Lion Head Logo',
        is_decorative: false,
        occurrences: 499,
        auto_detected: true,
        reviewed: true,
    },
    {
        id: '4',
        image_hash: 'bd80bfca',
        alt_text: 'Live Chat icon',
        is_decorative: false,
        occurrences: 170,
        auto_detected: true,
        reviewed: false,
    },
    {
        id: '5',
        image_hash: '2d8bddd6',
        alt_text: 'East Texas A&M University Lion Logo',
        is_decorative: false,
        occurrences: 261,
        auto_detected: true,
        reviewed: true,
    },
    {
        id: '6',
        image_hash: '781da499',
        alt_text: '',
        is_decorative: true,
        occurrences: 162,
        auto_detected: true,
        reviewed: false,
    },
];

export default function ImageLibraryPage() {
    const [images, setImages] = useState(mockImages);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'decorative' | 'with-alt' | 'unreviewed'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAlt, setEditAlt] = useState('');

    const filtered = images.filter(img => {
        const matchesSearch = !searchQuery ||
            img.alt_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            img.image_hash.includes(searchQuery);

        let matchesFilter = true;
        if (filterType === 'decorative') matchesFilter = img.is_decorative;
        if (filterType === 'with-alt') matchesFilter = !img.is_decorative && img.alt_text.length > 0;
        if (filterType === 'unreviewed') matchesFilter = !img.reviewed;

        return matchesSearch && matchesFilter;
    });

    const handleSave = (id: string) => {
        setImages(prev =>
            prev.map(img => img.id === id ? { ...img, alt_text: editAlt, reviewed: true } : img)
        );
        setEditingId(null);
    };

    const totalOccurrences = images.reduce((sum, img) => sum + img.occurrences, 0);
    const savedAICalls = images.filter(img => img.auto_detected).reduce((sum, img) => sum + (img.occurrences - 1), 0);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Image Library</h1>
                <p className="page-subtitle">
                    Known images detected across your PDFs. Set alt text once — applied to every occurrence automatically.
                    The low-intensity worker uses perceptual hashing to identify duplicates before sending to AI.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="card stat-card">
                    <div className="stat-value">{images.length}</div>
                    <div className="stat-label">Unique Images</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{totalOccurrences.toLocaleString()}</div>
                    <div className="stat-label">Total Occurrences</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{savedAICalls.toLocaleString()}</div>
                    <div className="stat-label">AI Calls Saved</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{images.filter(i => i.reviewed).length}/{images.length}</div>
                    <div className="stat-label">Reviewed</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                <input
                    className="input"
                    placeholder="Search by alt text or hash..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ flex: 1, minWidth: 200 }}
                />
                <select className="select" value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)} style={{ width: 180 }}>
                    <option value="all">All Images</option>
                    <option value="decorative">Decorative Only</option>
                    <option value="with-alt">With Alt Text</option>
                    <option value="unreviewed">Unreviewed</option>
                </select>
            </div>

            {/* Image Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                {filtered.map(img => (
                    <div key={img.id} className="card" style={{ padding: 'var(--space-4)' }}>
                        {/* Preview */}
                        <div style={{
                            width: '100%',
                            height: 120,
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--space-3)',
                            fontSize: '2.5rem',
                            border: '1px solid var(--border-default)',
                        }}>
                            {img.is_decorative ? '◻️' : '🖼️'}
                        </div>

                        {/* Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <span className={`badge ${img.is_decorative ? 'badge-warning' : 'badge-success'}`}>
                                {img.is_decorative ? 'Decorative' : 'Meaningful'}
                            </span>
                            <span className={`badge ${img.reviewed ? 'badge-success' : 'badge-warning'}`}>
                                {img.reviewed ? 'Reviewed ✓' : 'Unreviewed'}
                            </span>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-2)' }}>
                            Hash: {img.image_hash}
                        </div>

                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                            🔁 Found in <strong>{img.occurrences}</strong> PDFs
                        </div>

                        {/* Alt Text */}
                        {editingId === img.id ? (
                            <div style={{ marginBottom: 'var(--space-3)' }}>
                                <textarea
                                    className="input"
                                    value={editAlt}
                                    onChange={e => setEditAlt(e.target.value)}
                                    rows={2}
                                    style={{ resize: 'vertical', marginBottom: 'var(--space-2)' }}
                                    autoFocus
                                />
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-sm btn-primary" onClick={() => handleSave(img.id)}>Save</button>
                                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 'var(--space-3)', minHeight: 20 }}>
                                {img.is_decorative ? (
                                    <em style={{ color: 'var(--text-tertiary)' }}>Decorative — no alt text needed</em>
                                ) : img.alt_text ? (
                                    <>📝 {img.alt_text}</>
                                ) : (
                                    <em style={{ color: 'var(--brand-warning)' }}>⚠️ No alt text set</em>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {editingId !== img.id && (
                            <button
                                className="btn btn-sm btn-secondary"
                                style={{ width: '100%' }}
                                onClick={() => { setEditingId(img.id); setEditAlt(img.alt_text); }}
                            >
                                ✏️ Edit Alt Text
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📚</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>No images found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                        Upload and process PDFs to start building your image library.
                    </p>
                </div>
            )}
        </div>
    );
}
