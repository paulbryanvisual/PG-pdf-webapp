import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('cloud_connections')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    interface CloudConnection {
        id: string;
        profile_id: string;
        provider: string;
        label: string;
        config: Record<string, any>;
        created_at: string;
        last_used_at: string;
    }

    // strip passwords from response
    const sanitized = (data as CloudConnection[]).map((conn: CloudConnection) => {
        const { config, ...rest } = conn;
        const { password, ...safeConfig } = config || {};
        return { ...rest, config: safeConfig };
    });

    return NextResponse.json({ connections: sanitized });
}
