import Link from 'next/link';

export default function EnterprisePage() {
    return (
        <div className="container" style={{ paddingBottom: 'var(--space-20)' }}>
            {/* Hero */}
            <section className="hero-section animate-fade-in">
                <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>
                    Enterprise Grade
                </div>
                <h1 className="hero-title">
                    Compliance <br />
                    at Scale
                </h1>
                <p className="hero-subtitle">
                    Ensure 100% of your organization's documents meet WCAG 2.1 and PDF/UA standards. <br />
                    Secure, automated, and auditable.
                </p>
                <div className="hero-actions">
                    <Link href="/contact" className="btn btn-primary btn-lg">
                        Request Demo
                    </Link>
                    <Link href="/pricing" className="btn btn-secondary btn-lg">
                        View Pricing
                    </Link>
                </div>
            </section>

            {/* Enterprise Pillars */}
            <section className="bento-grid">
                <div className="bento-item large animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bento-icon">🔒</div>
                    <h3 className="bento-title">Security First</h3>
                    <p className="bento-desc">
                        SOC 2 Type II compliant. All data is encrypted at rest and in transit.
                        We offer Single Sign-On (SSO) integration with Okta, Azure AD, and Google Workspace.
                        <br /><br />
                        For highly sensitive data, we offer <strong>Private Cloud</strong> deployments where data never leaves your infrastructure.
                    </p>
                </div>

                <div className="bento-item animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bento-icon">📊</div>
                    <h3 className="bento-title">Unified Dashboard</h3>
                    <p className="bento-desc">
                        Track accessibility compliance across all departments. See who is uploading inaccessible PDFs and remediate them centrally.
                    </p>
                </div>

                <div className="bento-item animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="bento-icon">⚡</div>
                    <h3 className="bento-title">Bulk Remediation</h3>
                    <p className="bento-desc">
                        Connect a SharePoint folder or S3 bucket. Our AI workers will process thousands of legacy PDFs overnight.
                    </p>
                </div>
            </section>

            {/* Compliance Section */}
            <section className="card" style={{ padding: 'var(--space-10)', marginTop: 'var(--space-10)' }}>
                <div className="flex flex-col items-center text-center">
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                        Mitigate Legal Risk
                    </h2>
                    <p className="text-secondary" style={{ maxWidth: '600px', marginBottom: 'var(--space-8)' }}>
                        Digital accessibility lawsuits are at an all-time high. Don't let a PDF be your vulnerability.
                    </p>

                    <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>WCAG 2.1 AA</div>
                        <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>PDF/UA (ISO 14289)</div>
                        <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>Section 508</div>
                        <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>ADA Compliant</div>
                    </div>
                </div>
            </section>

        </div>
    );
}
