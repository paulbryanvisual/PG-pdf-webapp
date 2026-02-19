
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const { message } = await searchParams

    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect(`/login?message=${encodeURIComponent(error.message)}`)
        }

        return redirect('/dashboard')
    }

    return (
        <div className="container flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <Link
                href="/"
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
                Back
            </Link>

            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
                </div>

                <form className="flex flex-col gap-4" action={signIn}>
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
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="label" htmlFor="password" style={{ marginBottom: 0 }}>
                                Password
                            </label>
                            <Link href="/forgot-password" style={{ fontSize: '0.75rem' }}>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign In
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
                        <Link href="/signup">Sign Up</Link>
                    </div>

                    {message && (
                        <div className="badge badge-error" style={{ width: '100%', padding: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
