
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ForgotPassword({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const { message } = await searchParams

    const resetPassword = async (formData: FormData) => {
        'use server'

        const origin = (await headers()).get('origin')
        const email = formData.get('email') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/dashboard/settings/password`,
        })

        if (error) {
            return redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
        }

        return redirect('/forgot-password?message=Check your email for the password reset link')
    }

    return (
        <div className="container flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <Link
                href="/login"
                className="btn btn-ghost"
                style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center' }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '8px' }}
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Login
            </Link>

            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a reset link</p>
                </div>

                <form className="flex flex-col gap-4" action={resetPassword}>
                    <div>
                        <label className="label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="input"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Send Reset Link
                    </button>

                    {message && (
                        <div className="badge" style={{
                            width: '100%',
                            padding: '1rem',
                            marginTop: '1rem',
                            justifyContent: 'center',
                            backgroundColor: message.includes('Check') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.includes('Check') ? 'var(--brand-success)' : 'var(--brand-error)'
                        }}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
