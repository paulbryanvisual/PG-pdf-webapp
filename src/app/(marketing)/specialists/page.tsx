import Link from 'next/link';

export default function SpecialistsPage() {
    return (
        <div className="container" style={{ paddingBottom: 'var(--space-20)' }}>
            {/* Hero */}
            <section className="hero-section animate-fade-in">
                <div className="badge badge-success" style={{ marginBottom: '1.5rem' }}>
                    For Accessibility Pros
                </div>
                <h1 className="hero-title">
                    Remediate PDFs <br />
                    10x Faster
                </h1>
                <p className="hero-subtitle">
                    You're an expert. You shouldn't be clicking "Tag as Text" 500 times. <br />
                    Let AI handle the grunt work so you can focus on the complex fixes.
                </p>
                <div className="hero-actions">
                    <Link href="/signup" className="btn btn-primary btn-lg">
                        Try the Editor Free
                    </Link>
                </div>
            </section>

            {/* Problem/Solution Split */}
            <section className="bento-grid">
                <div className="bento-item card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bento-icon" style={{ color: 'var(--brand-error)', background: 'rgba(239, 68, 68, 0.1)' }}>😫</div>
                    <h3 className="bento-title">The Old Way</h3>
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>❌ Manually tagging every paragraph</li>
                        <li>❌ Guessing reading order in a list view</li>
                        <li>❌ "Image 1" alt text placeholders</li>
                        <li>❌ Crashing when the file is too big</li>
                    </ul>
                </div>

                <div className="bento-item card-glass animate-slide-up" style={{ animationDelay: '0.2s', borderColor: 'var(--brand-primary)' }}>
                    <div className="bento-icon" style={{ color: 'var(--brand-success)', background: 'rgba(16, 185, 129, 0.1)' }}>✨</div>
                    <h3 className="bento-title">The PrettyGrand Way</h3>
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>✅ Auto-tags 90% of content instantly</li>
                        <li>✅ Visual reading order editor</li>
                        <li>✅ Context-aware AI alt text suggestions</li>
                        <li>✅ Cloud-based, always saved</li>
                    </ul>
                </div>
            </section>

            {/* Feature Deep Dive */}
            <section style={{ marginTop: 'var(--space-20)' }}>
                <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Built for your workflow</h2>
                </div>

                <div className="bento-grid">
                    <div className="bento-item">
                        <h3 className="bento-title">Smart Table Reconstruction</h3>
                        <p className="bento-desc">
                            Complex nested tables? Our AI understands logical headers and data cells, reconstructing the tag tree correctly without manual merging.
                        </p>
                    </div>
                    <div className="bento-item">
                        <h3 className="bento-title">Global Artifacting</h3>
                        <p className="bento-desc">
                            Select one decorative element (like a line divider) and "Artifact All" similar elements across 100 pages in one click.
                        </p>
                    </div>
                    <div className="bento-item">
                        <h3 className="bento-title">WCAG & PDF/UA Validator</h3>
                        <p className="bento-desc">
                            Built-in validation that doesn't just say "Fail". It highlights the element in the preview and offers a "Fix" button.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonial (Placeholder) */}
            <section className="card card-glass" style={{ marginTop: 'var(--space-10)', textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>
                    "I used to spend 4 hours on a 20-page annual report. With PrettyGrandPDF, I did it in 30 minutes. The alt text suggestions are scarily good."
                </p>
                <p className="text-secondary" style={{ fontWeight: 600 }}>— Sarah J., Accessibility Specialist</p>
            </section>

        </div>
    );
}
