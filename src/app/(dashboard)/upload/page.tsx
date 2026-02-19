'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import styles from './upload.module.css';

interface UploadedFile {
    file: File;
    id: string;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function UploadPage() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [aiProvider, setAiProvider] = useState<'gemini' | 'claude'>('gemini');
    const [fastMode, setFastMode] = useState(false);
    const [skipImages, setSkipImages] = useState(false);
    const [fileHandling, setFileHandling] = useState<'replace' | 'rename_old' | 'rename_new'>('replace');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addFiles = useCallback((newFiles: FileList | File[]) => {
        const validFiles = Array.from(newFiles).filter(f =>
            f.type === 'application/pdf' ||
            f.type === 'application/zip' ||
            f.type === 'application/x-zip-compressed' ||
            f.name.endsWith('.pdf') ||
            f.name.endsWith('.zip')
        );

        setFiles(prev => [
            ...prev,
            ...validFiles.map(file => ({
                file,
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            })),
        ]);
    }, []);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const clearAll = () => setFiles([]);

    // Estimate credits
    const estimatedCredits = files.reduce((sum, f) => {
        // Rough estimate: 1 credit per PDF, +1 if images enabled
        const base = f.file.name.endsWith('.zip') ? 5 : 1;
        return sum + base + (skipImages ? 0 : 1);
    }, 0);

    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async () => {
        if (files.length === 0) return;
        setIsSubmitting(true);

        try {
            // 1. Create Job ID
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .insert({
                    profile_id: user.id,
                    status: 'pending',
                    source_type: 'upload',
                    options: {
                        aiProvider,
                        fastMode,
                        skipImages,
                        fileHandling
                    }
                })
                .select()
                .single();

            if (jobError) throw jobError;
            if (!job) throw new Error("Failed to create job");

            // 2. Upload Files & Create Job File Records
            for (const fileObj of files) {
                const file = fileObj.file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${user.id}/${job.id}/${fileName}`;

                // Upload
                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Record
                const { error: fileRecordError } = await supabase
                    .from('job_files')
                    .insert({
                        job_id: job.id,
                        filename: file.name,
                        status: 'pending',
                        input_storage_path: filePath,
                        file_size: file.size
                    });

                if (fileRecordError) throw fileRecordError;
            }

            // 3. Trigger Backend Processing
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/process-job`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: job.id })
            });

            if (!res.ok) {
                console.error("Backend process triggering failed", await res.text());
                // Don't fail the UI flow, the job is created/queued
            }

            // 4. Redirect to Job Details
            router.push(`/jobs/${job.id}`);

        } catch (err) {
            console.error(err);
            alert(`Error creating job: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Upload PDFs</h1>
                <p className="page-subtitle">
                    Upload a single PDF, multiple PDFs, or a ZIP archive for accessibility processing.
                </p>
            </div>

            {/* Drop Zone */}
            <div
                className={`${styles['upload-zone']} ${isDragOver ? styles.dragover : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <span className={styles['upload-icon']}>📄</span>
                <div className={styles['upload-title']}>
                    Drop PDFs or a ZIP file here
                </div>
                <div className={styles['upload-desc']}>
                    or click to browse your files
                </div>
                <div className={styles['upload-formats']}>
                    Accepts: .pdf, .zip &bull; Max file size: 100 MB
                </div>
                <input
                    type="file"
                    className={styles['upload-input']}
                    accept=".pdf,.zip"
                    multiple
                    onChange={handleFileInput}
                />
            </div>

            {/* Processing Options */}
            <div className={styles['options-grid']}>
                <div className="card">
                    <div className={styles['option-group']}>
                        <label className="label">AI Provider</label>
                        <select
                            className="select"
                            value={aiProvider}
                            onChange={e => setAiProvider(e.target.value as 'gemini' | 'claude')}
                        >
                            <option value="gemini">Google Gemini (Recommended)</option>
                            <option value="claude">Anthropic Claude</option>
                        </select>
                    </div>

                    <div className={styles['option-group']} style={{ marginTop: 'var(--space-4)' }}>
                        <label className="label">File Handling</label>
                        <select
                            className="select"
                            value={fileHandling}
                            onChange={e => setFileHandling(e.target.value as 'replace' | 'rename_old' | 'rename_new')}
                        >
                            <option value="replace">Replace original file</option>
                            <option value="rename_old">Keep original (rename to _original)</option>
                            <option value="rename_new">Save as new file (_accessible)</option>
                        </select>
                    </div>
                </div>

                <div className="card">
                    <div className={styles['toggle-row']}>
                        <div>
                            <div className={styles['toggle-label']}>Fast Mode</div>
                            <div className={styles['toggle-label-sub']}>Heuristics only, skip AI analysis</div>
                        </div>
                        <input
                            type="checkbox"
                            className={styles['toggle-switch']}
                            checked={fastMode}
                            onChange={e => setFastMode(e.target.checked)}
                        />
                    </div>

                    <div className={styles['toggle-row']} style={{ marginTop: 'var(--space-4)' }}>
                        <div>
                            <div className={styles['toggle-label']}>Generate Alt Text</div>
                            <div className={styles['toggle-label-sub']}>Use AI vision to describe images</div>
                        </div>
                        <input
                            type="checkbox"
                            className={styles['toggle-switch']}
                            checked={!skipImages}
                            onChange={e => setSkipImages(!e.target.checked)}
                        />
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className={styles['file-list']}>
                    <div className={styles['file-list-header']}>
                        <span className={styles['file-count']}>{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
                        <button className="btn btn-sm btn-ghost" onClick={clearAll}>Clear All</button>
                    </div>
                    <div className="card" style={{ padding: 0 }}>
                        {files.map(({ file, id }) => (
                            <div key={id} className={styles['file-item']}>
                                <span className={styles['file-icon']}>
                                    {file.name.endsWith('.zip') ? '📦' : '📄'}
                                </span>
                                <div className={styles['file-info']}>
                                    <div className={styles['file-name']}>{file.name}</div>
                                    <div className={styles['file-size']}>{formatFileSize(file.size)}</div>
                                </div>
                                <button className={styles['file-remove']} onClick={() => removeFile(id)}>✕</button>
                            </div>
                        ))}
                    </div>

                    {/* Cost Estimate */}
                    <div className={styles['cost-estimate']}>
                        <div>
                            <div className={styles['cost-label']}>Estimated Credit Cost</div>
                            <div className={styles['cost-detail']}>
                                {files.length} file{files.length !== 1 ? 's' : ''} × ~{skipImages ? '1' : '2'} credits each
                            </div>
                        </div>
                        <div className={styles['cost-value']}>~{estimatedCredits} credits</div>
                    </div>

                    {/* Submit */}
                    <div className={styles['submit-bar']}>
                        <button className="btn btn-secondary" onClick={clearAll}>Cancel</button>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '⏳ Processing...' : `🚀 Process ${files.length} file${files.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
