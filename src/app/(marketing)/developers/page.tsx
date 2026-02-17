import Link from 'next/link';

export default function DevelopersPage() {
    return (
        <div className="container" style={{ paddingBottom: 'var(--space-20)' }}>
            {/* Hero */}
            <section className="hero-section animate-fade-in">
                <div className="badge badge-warning" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                    API v1.0 Released
                </div>
                <h1 className="hero-title">
                    Accessibility <br />
                    as Code
                </h1>
                <p className="hero-subtitle">
                    Integrate PDF remediation into your CI/CD pipeline. <br />
                    Generate WCAG-compliant documents programmatically.
                </p>
                <div className="hero-actions">
                    <Link href="/docs" className="btn btn-primary btn-lg">
                        Read the Docs
                    </Link>
                    <Link href="/api-keys" className="btn btn-secondary btn-lg">
                        Get API Key
                    </Link>
                </div>
            </section>

            {/* Code Demo */}
            <section className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto var(--space-20)' }}>
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155', padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #334155' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div>
                        <span style={{ marginLeft: 'var(--space-2)', fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>remediate.js</span>
                    </div>
                    <div style={{ padding: 'var(--space-6)', overflowX: 'auto' }}>
                        <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', lineHeight: '1.5' }}>
                            {`import { PrettyGrandClient } from '@prettygrand/sdk';

const client = new PrettyGrandClient(process.env.PG_API_KEY);

async function processInvoice() {
  const result = await client.remediate({
    file: './invoice.pdf',
    mode: 'auto',
    compliance: 'WCAG_2_1',
    generateAltText: true
  });

  console.log(\`Processed ID: \${result.id}\`);
  console.log(\`Compliance Score: \${result.score}\`);
  
  await result.download('./invoice-accessible.pdf');
}

processInvoice();`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bento-grid">
                <div className="bento-item">
                    <div className="bento-icon">🤖</div>
                    <h3 className="bento-title">Vision LLMs</h3>
                    <p className="bento-desc">
                        Leverage Gemini 1.5 Pro and Claude 3.5 Sonnet to describe complex diagrams and images via our unified API endpoint.
                    </p>
                </div>

                <div className="bento-item">
                    <div className="bento-icon">🪝</div>
                    <h3 className="bento-title">Webhooks</h3>
                    <p className="bento-desc">
                        Get notified instantly when a large batch job completes or if human-in-the-loop review is required.
                    </p>
                </div>

                <div className="bento-item">
                    <div className="bento-icon">📚</div>
                    <h3 className="bento-title">Detailed Metadata</h3>
                    <p className="bento-desc">
                        Get structured JSON output of the PDF tag tree, reading order, and alt text for downstream processing.
                    </p>
                </div>
            </section>

        </div>
    );
}
