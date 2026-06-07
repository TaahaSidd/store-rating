import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950">

            {/* LEFT PANEL: Clean Modern Input Engine */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-8 lg:flex-none lg:px-20 xl:px-24 bg-slate-900 border-r border-slate-800/50">
                <div className="mx-auto w-full max-w-sm lg:w-96">

                    {/* Header & Meta Context */}
                    <div>
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 font-black text-xl tracking-tight">
                            S
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-400">
                            New to the platform?{' '}
                            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Create an account profile
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10">
                        {/* Context Redirection Banner (e.g. Success messages from Signup) */}
                        {location.state?.message && (
                            <div className="mb-6 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20 flex items-center gap-3">
                                <svg className="h-5 w-5 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                <span>{location.state.message}</span>
                            </div>
                        )}

                        {/* Error Handlers */}
                        {error && (
                            <div className="mb-6 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-400 border border-rose-500/20 flex items-center gap-3">
                                <svg className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form Inputs */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Email Address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        required
                                        className="block w-full rounded-xl border-0 bg-slate-800 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-700/50 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all outline-none"
                                        placeholder="store-rating@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        required
                                        className="block w-full rounded-xl border-0 bg-slate-800 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-700/50 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center items-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Minimalist App Brand Frame */}
            <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="flex h-full flex-col justify-between p-16 relative z-10">
                    <div className="flex items-center gap-2.5 text-white font-bold tracking-wider text-sm uppercase">
                        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                        Spica Labs Production Engine
                    </div>
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-none">
                            Store Rating & Reviews.
                        </h1>
                        <p className="mt-6 text-lg text-slate-400 font-medium">
                            A high-performance enterprise dashboard engine powered by a secure Spring Boot REST API core and isolated role switchboard mechanics.
                        </p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} Spica Labs. All rights reserved.
                    </p>
                </div>
            </div>

        </div>
    );
}