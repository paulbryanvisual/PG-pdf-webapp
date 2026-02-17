'use client';

import { CREDIT_PACKS, formatPrice, pricePerCredit } from '@/lib/credits';

export default function BillingPage() {
    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Billing & Credits</h1>
                <p className="page-subtitle">Purchase credits to process your PDFs. Buy in bulk for better rates.</p>
            </div>

            {/* Current Balance */}
            <div className="card" style={{
                marginBottom: 'var(--space-8)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 214, 160, 0.05))',
                borderColor: 'rgba(99, 102, 241, 0.2)',
                padding: 'var(--space-8)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Current Balance</div>
                <div className="stat-value" style={{ fontSize: '3rem' }}>47</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                    credits remaining
                </div>
            </div>

            {/* Credit Packs */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Buy Credits</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                {CREDIT_PACKS.map(pack => (
                    <div
                        key={pack.id}
                        className="card"
                        style={{
                            textAlign: 'center',
                            padding: 'var(--space-8) var(--space-6)',
                            position: 'relative',
                            borderColor: pack.popular ? 'var(--brand-primary)' : 'var(--border-default)',
                            boxShadow: pack.popular ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                        }}
                    >
                        {pack.popular && (
                            <div style={{
                                position: 'absolute',
                                top: -12,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--brand-primary)',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '3px 16px',
                                borderRadius: 'var(--radius-full)',
                            }}>
                                Most Popular
                            </div>
                        )}

                        <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                            {pack.name}
                        </div>
                        <div className="stat-value" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-1)' }}>
                            {pack.credits}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
                            credits
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
                            {formatPrice(pack.price_cents)}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>
                            {pricePerCredit(pack)} per credit
                        </div>
                        <button className={`btn btn-lg ${pack.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                            Buy {pack.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* Credit Costs Explainer */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Credit Costs</h2>
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>PDF Type</th>
                            <th style={{ textAlign: 'right', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { type: 'Simple text PDF (≤5 pages)', cost: '1 credit' },
                            { type: 'Standard PDF (6–20 pages)', cost: '2 credits' },
                            { type: 'Complex PDF (21–50 pages)', cost: '3 credits' },
                            { type: 'Large PDF (51+ pages)', cost: '5 credits' },
                            { type: 'Image-heavy PDF (adds vision AI)', cost: '+1 credit' },
                        ].map((row, i) => (
                            <tr key={i}>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem', borderBottom: '1px solid var(--border-default)' }}>{row.type}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--border-default)' }}>{row.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Transaction History */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>Transaction History</h2>
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: 'var(--space-3) var(--space-4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { date: 'Feb 15, 2026', desc: 'Pro Pack Purchase', amount: '+250', type: 'purchase' },
                            { date: 'Feb 15, 2026', desc: 'Syllabi Batch (150 files)', amount: '-210', type: 'usage' },
                            { date: 'Feb 14, 2026', desc: 'Annual Report.pdf', amount: '-3', type: 'usage' },
                            { date: 'Feb 10, 2026', desc: 'Welcome Bonus', amount: '+5', type: 'bonus' },
                            { date: 'Feb 10, 2026', desc: 'Starter Pack Purchase', amount: '+50', type: 'purchase' },
                        ].map((row, i) => (
                            <tr key={i}>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.8125rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-default)' }}>{row.date}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem', borderBottom: '1px solid var(--border-default)' }}>{row.desc}</td>
                                <td style={{
                                    padding: 'var(--space-3) var(--space-4)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textAlign: 'right',
                                    color: row.amount.startsWith('+') ? 'var(--brand-success)' : 'var(--text-primary)',
                                    borderBottom: '1px solid var(--border-default)',
                                }}>
                                    {row.amount} credits
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
