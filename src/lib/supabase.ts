/* ===================================================
   Supabase Client — Browser & Server
   =================================================== */

// NOTE: Install @supabase/supabase-js and @supabase/ssr
// For now this is a placeholder that will work once Supabase is configured

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client (singleton)
let browserClient: any = null;

export function getSupabaseBrowserClient() {
    if (browserClient) return browserClient;

    // Lazy import to avoid SSR issues
    try {
        const { createBrowserClient } = require('@supabase/ssr');
        browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return browserClient;
    } catch {
        console.warn('Supabase SSR not installed. Run: npm install @supabase/ssr @supabase/supabase-js');
        return null;
    }
}

// Server client (for API routes / Server Components)
export function getSupabaseServerClient() {
    try {
        const { createServerClient } = require('@supabase/ssr');
        const { cookies } = require('next/headers');

        const cookieStore = cookies();
        return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookies: any[]) {
                    cookies.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        });
    } catch {
        console.warn('Supabase SSR not available in this context');
        return null;
    }
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
