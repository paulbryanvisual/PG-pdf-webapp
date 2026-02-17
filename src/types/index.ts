/* ===================================================
   PrettyGrandPDF Web App — Type Definitions
   =================================================== */

// --- User & Auth ---
export interface UserProfile {
    id: string;
    email: string;
    display_name: string | null;
    credits: number;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    created_at: string;
}

// --- Credits ---
export interface CreditTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'purchase' | 'usage' | 'refund' | 'bonus';
    description: string | null;
    stripe_session_id: string | null;
    job_id: string | null;
    created_at: string;
}

export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price_cents: number;
    stripe_price_id: string;
    popular?: boolean;
}

// --- Jobs ---
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type SourceType = 'upload' | 'google_drive' | 'dropbox' | 'onedrive' | 'ftp' | 's3' | 'box';
export type AIProvider = 'gemini' | 'claude';
export type FileHandling = 'replace' | 'rename_old' | 'rename_new';

export interface Job {
    id: string;
    user_id: string;
    status: JobStatus;
    source_type: SourceType;
    total_files: number;
    processed_files: number;
    failed_files: number;
    credits_used: number;
    ai_provider: AIProvider;
    options: JobOptions;
    created_at: string;
    completed_at: string | null;
}

export interface JobOptions {
    fast_mode?: boolean;
    skip_images?: boolean;
    file_handling?: FileHandling;
    rename_pattern?: string;
}

export interface JobFile {
    id: string;
    job_id: string;
    original_filename: string;
    input_storage_path: string | null;
    output_storage_path: string | null;
    report_storage_path: string | null;
    status: JobStatus;
    page_count: number | null;
    credits_cost: number | null;
    error_message: string | null;
    accessibility_score: number | null;
    processing_time_seconds: number | null;
    created_at: string;
}

// --- Cloud Connections ---
export interface CloudConnection {
    id: string;
    user_id: string;
    provider: SourceType;
    label: string;
    is_active: boolean;
    last_synced_at: string | null;
    created_at: string;
}

// --- Auto Schedules ---
export interface AutoSchedule {
    id: string;
    user_id: string;
    connection_id: string;
    remote_path: string;
    file_handling: FileHandling;
    rename_pattern: string | null;
    cron_schedule: string;
    is_active: boolean;
    last_run_at: string | null;
    created_at: string;
}

// --- Image Library (Alt Text Management) ---
export interface KnownImage {
    id: string;
    user_id: string;
    image_hash: string;        // perceptual hash for matching
    thumbnail_url: string;     // small preview
    alt_text: string;
    is_decorative: boolean;    // true = mark as Artifact, skip alt text
    occurrences: number;       // how many PDFs this image appeared in
    auto_detected: boolean;    // true = found by low-intensity worker
    reviewed: boolean;         // true = human reviewed the alt text
    created_at: string;
    updated_at: string;
}

// --- Alt Text Review Queue ---
export interface AltTextReviewItem {
    id: string;
    job_file_id: string;
    image_hash: string;
    thumbnail_url: string;
    ai_generated_alt: string;  // what the AI suggested
    final_alt: string | null;  // what the user approved
    is_decorative: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'edited';
    page_number: number;
    created_at: string;
}

// --- Processing Stats ---
export interface ProcessingStats {
    total_pdfs_processed: number;
    total_pages_processed: number;
    total_images_described: number;
    credits_used_this_month: number;
    avg_processing_time: number;
    accessibility_pass_rate: number;
}
