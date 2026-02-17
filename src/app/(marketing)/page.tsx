import Link from 'next/link';
import './marketing.css';

export default function MarketingHomePage() {
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="hero-section animate-fade-in">
                <div className="hero-bg-glow"></div>
                <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>
                    ✨ New: AI-Powered Remediation
                </div>
                <h1 className="hero-title">
                    The Canva of <br />
                    PDF Accessibility
                </h1>
                <p className="hero-subtitle">
                    Stop wrestling with Acrobat tags. Remediate PDFs 10x faster with our AI-first "Reviewer" workflow.
                </p>
                <div className="hero-actions">
                    <Link href="/signup" className="btn btn-primary btn-lg">
                        Start for Free
                    </Link>
                    <Link href="/demo" className="btn btn-secondary btn-lg">
                        Watch Demo
                    </Link>
                </div>

                {/* Social Proof / Logos could go here */}
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    Trusted by accessibility teams at leading organizations
                </p>
            </section>

            {/* Bento Grid - Features */}
            <section className="bento-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bento-item large card-glass">
                    <div className="bento-icon">🚀</div>
                    <h3 className="bento-title">Auto-Tagging that Actually Works</h3>
                    <p className="bento-desc">
                        Our AI analyzes document structure, reading order, and semantics to tag 90% of your document instantly. You just review the last 10%.
                    </p>
                </div>

                <div className="bento-item">
                    <div className="bento-icon">👁️</div>
                    <h3 className="bento-title">Context-Aware Alt Text</h3>
                    <p className="bento-desc">
                        We don't just say "Image". Our Vision AI describes charts, graphs, and photos with context.
                    </p>
                </div>

                <div className="bento-item">
                    <div className="bento-icon">🎨</div>
                    <h3 className="bento-title">Visual Inspector</h3>
                    <p className="bento-desc">
                        See the tag tree overlay on the actual PDF. No more guessing which tag belongs to which element.
                    </p>
                </div>

                <div className="bento-item">
                    <div className="bento-icon">⚖️</div>
                    <h3 className="bento-title">Audit Trails</h3>
                    <p className="bento-desc">
                        Generate compliance reports for every document. Prove your work for WCAG 2.1 and PDF/UA.
                    </p>
                </div>

                <div className="bento-item large">
                    <div className="bento-icon">🔄</div>
                    <h3 className="bento-title">Batch Processing for Enterprise</h3>
                    <p className="bento-desc">
                        Have 10,000 PDFs? Connect your OneDrive or Google Drive and let our background workers remediate them while you sleep.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                    Ready to fix your PDFs?
                </h2>
                <Link href="/signup" className="btn btn-primary btn-lg">
                    Get Started Now
                </Link>
            </section>
        </div>
    );
}
