import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();

    if (!supabase) {
        return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const jobNames = [
        'Annual_Report_2024.pdf', 'Q1_Financials.pdf', 'Employee_Handbook.pdf',
        'Product_Catalog_v2.pdf', 'Board_Meeting_Minutes.pdf', 'Marketing_Assets.zip',
        'Compliance_Docs.pdf', 'Training_Manual.pdf', 'Invoice_Batch_001.pdf',
        'Resume_Batch.zip', 'Syllabus_Fall_2025.pdf', 'Research_Paper_Final.pdf'
    ];

    const generateRandomJob = (daysAgo: number) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        // Randomize time within the day
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const totalFiles = Math.floor(Math.random() * 50) + 1;
        const isCompleted = Math.random() > 0.2; // 80% success
        const status = isCompleted ? 'completed' : (Math.random() > 0.5 ? 'processing' : 'failed');
        const processedFiles = status === 'completed' ? totalFiles : Math.floor(totalFiles * Math.random());
        const accessibilityScore = status === 'completed' ? Math.floor(Math.random() * 30) + 70 : 0; // 70-100 score

        return {
            profile_id: user.id,
            name: jobNames[Math.floor(Math.random() * jobNames.length)],
            status: status,
            total_files: totalFiles,
            processed_files: processedFiles,
            failed_files: status === 'failed' ? totalFiles - processedFiles : 0,
            credits_cost: Math.floor(totalFiles * 1.5),
            accessibility_score: accessibilityScore,
            created_at: date.toISOString(),
            updated_at: date.toISOString()
        };
    };

    const jobs = [];
    // Generate ~20 jobs over the last 10 days
    for (let i = 0; i < 20; i++) {
        const daysAgo = Math.floor(Math.random() * 10);
        jobs.push(generateRandomJob(daysAgo));
    }

    const { error } = await supabase.from('jobs').insert(jobs);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Successfully seeded ${jobs.length} jobs for user ${user.email}` });
}
