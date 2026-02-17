'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100dvh' }}>
            <Sidebar credits={47} userName="Bryan Paul" userEmail="bryan@example.com" reviewCount={3} />
            <main className="main-content" style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
