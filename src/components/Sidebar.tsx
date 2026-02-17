'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
    credits?: number;
    userName?: string;
    userEmail?: string;
    reviewCount?: number;
}

export default function Sidebar({
    credits = 47,
    userName = 'Bryan Paul',
    userEmail = 'bryan@example.com',
    reviewCount = 0,
}: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/upload', icon: '📤', label: 'Upload PDFs' },
        { href: '/jobs', icon: '⚙️', label: 'Jobs' },
        { href: '/alt-text', icon: '🖼️', label: 'Alt Text Review', badge: reviewCount > 0 ? reviewCount : undefined },
        { href: '/image-library', icon: '📚', label: 'Image Library' },
    ];

    const connectItems = [
        { href: '/connections', icon: '☁️', label: 'Cloud Storage' },
        { href: '/schedules', icon: '🔄', label: 'Auto-Process' },
    ];

    const accountItems = [
        { href: '/billing', icon: '💳', label: 'Billing' },
        { href: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    const initials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className={styles.sidebar}>
            {/* Brand */}
            <div className={styles['sidebar-brand']}>
                <div className={styles['sidebar-logo']}>PG</div>
                <div>
                    <div className={styles['sidebar-brand-text']}>PrettyGrandPDF</div>
                    <div className={styles['sidebar-brand-sub']}>PDF Accessibility</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles['sidebar-nav']}>
                <div className={styles['nav-section-label']}>Main</div>
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles['nav-item']} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles['nav-icon']}>{item.icon}</span>
                        {item.label}
                        {item.badge !== undefined && (
                            <span className={styles['nav-badge']}>{item.badge}</span>
                        )}
                    </Link>
                ))}

                <div className={styles['nav-section-label']}>Connect</div>
                {connectItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles['nav-item']} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles['nav-icon']}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div className={styles['nav-section-label']}>Account</div>
                {accountItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles['nav-item']} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles['nav-icon']}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className={styles['sidebar-footer']}>
                <div className={styles['credit-display']}>
                    <div>
                        <div className={styles['credit-count']}>{credits.toLocaleString()}</div>
                        <div className={styles['credit-label']}>Credits remaining</div>
                    </div>
                    <Link href="/billing" className="btn btn-sm btn-primary">Buy</Link>
                </div>
                <div className={styles['user-info']}>
                    <div className={styles['user-avatar']}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                        <div className={styles['user-name']}>{userName}</div>
                        <div className={styles['user-email']}>{userEmail}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
