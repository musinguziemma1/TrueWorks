// src/pages/admin/AdminLogin.tsx
// ============================================================
// ADMIN LOGIN
// ============================================================
// Password-based sign-in powered by Convex Auth. After
// successful sign-in we bounce the user back to whatever
// route they originally requested — captured by
// `ProtectedRoute` via `location.state.from`.
//
// Behind the scenes:
//   • `useAuthActions().signIn("password", FormData)` calls
//     `signIn` exported from `convex/auth.ts`.
//   • Convex Auth handles password hashing and session token
//     issuance automatically.
//
// IMPORTANT: `signIn` returns BEFORE the client-server
// handshake confirms the session token. We MUST NOT navigate
// inside the same tick — we wait for `isAuthenticated` to flip
// true via `useEffect` and navigate then. This prevents the
// race condition where `ProtectedRoute` re-evaluates and
// bounces the freshly-signed-in user back to the login page.
// ============================================================

import { useState, useEffect, FormEvent } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions, useConvexAuth } from '@convex-dev/auth/react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminLogin() {
    const { signIn } = useAuthActions();
    const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Where to send the user after login. Defaults to admin root.
    const from = (location.state as { from?: string } | null)?.from ?? '/admin';

    // After `signIn` returns, the client still needs a moment to
    // confirm the new session token. We navigate the moment
    // `isAuthenticated` flips true (if we're not the very-first
    // already-authenticated load that landed here by mistake).
    useEffect(() => {
        if (!authLoading && isAuthenticated && !submitting) {
            navigate(from, { replace: true });
        }
        // Intentionally only depend on these two — re-running the
        // effect mid-submission would cancel the in-flight sign-in.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, isAuthenticated]);

    // Already signed in on load? Skip the form entirely.
    if (!authLoading && isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('flow', 'signIn');
        try {
            await signIn('password', formData);
            // Don't navigate here — the useEffect above picks up
            // `isAuthenticated` flipping and navigates for us.
            // `submitting` stays `true` so we don't bounce back.
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Sign-in failed';
            setError(msg);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary via-primary-light to-[#0A1E3D] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-primary text-white px-6 py-8 text-center">
                        <div className="w-14 h-14 rounded-full border-2 border-accent bg-primary-light flex items-center justify-center mx-auto mb-3">
                            <span className="font-heading font-bold text-accent text-lg">TW</span>
                        </div>
                        <h1 className="font-heading text-2xl font-bold">TrueWorks Admin</h1>
                        <p className="text-white/60 text-sm mt-1">Sign in to your staff account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm">
                                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                autoFocus
                                className="w-full px-4 py-2.5 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                                placeholder="you@trueworks.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                minLength={8}
                                className="w-full px-4 py-2.5 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                                placeholder="At least 8 characters"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={submitting || authLoading}
                        >
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="px-6 pb-6 -mt-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to website
                        </Link>
                    </div>
                </div>

                <p className="text-center text-white/40 text-xs mt-6">
                    Access restricted to authorized staff only.
                </p>
            </motion.div>
        </div>
    );
}
