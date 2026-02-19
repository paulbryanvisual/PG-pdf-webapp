import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
        return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert to CSV
        const header = 'ID,Name,Status,Total Files,Processed Files,Failed Files,Credits Cost,Accessibility Score,Created At\n';
        const rows = jobs.map((job: any) => {
            return `"${job.id}","${job.name}","${job.status}",${job.total_files},${job.processed_files},${job.failed_files},${job.credits_cost},${job.accessibility_score || 0},"${job.created_at}"`;
        }).join('\n');

        const csv = header + rows;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="job-history-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
