import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
        return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch aggregate stats
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('id, status, total_files, processed_files, accessibility_score, created_at')
            .eq('profile_id', user.id);

        if (error) throw error;

        // Calculate stats
        const totalJobs = jobs.length;
        const totalFiles = jobs.reduce((acc: number, job: any) => acc + (job.total_files || 0), 0);
        const processedFiles = jobs.reduce((acc: number, job: any) => acc + (job.processed_files || 0), 0);

        // Calculate average accessibility score (excluding null/0 if appropriate, but here simple average)
        const jobsWithScore = jobs.filter((j: any) => j.accessibility_score > 0);
        const avgScore = jobsWithScore.length > 0
            ? Math.round(jobsWithScore.reduce((acc: number, job: any) => acc + job.accessibility_score, 0) / jobsWithScore.length)
            : 0;

        // Calculate credits used
        const totalCredits = jobs.reduce((acc: number, job: any) => acc + (job.credits_cost || 0), 0);

        // Calculate failure rate
        const failedJobs = jobs.filter((j: any) => j.status === 'failed').length;

        // Daily activity (last 7 days)
        const dailyActivity = new Array(7).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            return {
                date: dateString,
                count: jobs.filter((j: any) => j.created_at.startsWith(dateString)).length
            };
        }).reverse();

        return NextResponse.json({
            stats: {
                totalJobs,
                totalFiles,
                processedFiles,
                avgScore
            },
            activity: dailyActivity,
            recent: jobs.slice(0, 5) // Send 5 most recent for the list
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
