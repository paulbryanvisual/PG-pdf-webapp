import Link from 'next/link';
import './marketing.css';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="marketing-layout">
            {/* Navigation */}
            <nav className="marketing-nav">
                <div className="container nav-container">
                    <Link href="/" className="nav-logo">
                        <span role="img" aria-label="PrettyGrandPDF Logo">✨</span> PrettyGrandPDF
                    </Link>

                    <div className="nav-links desktop-only">
                        <Link href="/specialists" className="nav-link">For Specialists</Link>
                        <Link href="/enterprise" className="nav-link">Enterprise</Link>
                        <Link href="/developers" className="nav-link">Developers</Link>
                    </div>

                    <div className="nav-actions">
                        <Link href="/login" className="btn btn-ghost">Log In</Link>
                        <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="marketing-footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <Link href="/" className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                            ✨ PrettyGrandPDF
                        </Link>
                        <p className="text-secondary" style={{ maxWidth: '300px', fontSize: '0.875rem' }}>
                            The modern standard for PDF accessibility. AI-powered remediation that makes compliance effortless.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><Link href="/features">Features</Link></li>
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="/changelog">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Solutions</h4>
                        <ul className="footer-links">
                            <li><Link href="/specialists">Specialists</Link></li>
                            <li><Link href="/enterprise">Enterprise</Link></li>
                            <li><Link href="/developers">Developers</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
