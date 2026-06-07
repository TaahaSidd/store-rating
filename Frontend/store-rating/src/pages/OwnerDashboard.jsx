import { useState, useEffect, useContext } from 'react';
import API from '../api/AxiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Stars Display ─────────────────────────────────────────────────────────────
function Stars({ value }) {
    if (!value) return <span className="text-slate-600 text-xs">No ratings yet</span>;
    const rounded = Math.round(value);
    return (
        <span className="flex items-center gap-1">
            <span className="text-amber-400 text-sm leading-none">
                {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
            </span>
            <span className="text-slate-400 text-xs">{Number(value).toFixed(1)}</span>
        </span>
    );
}

// ── Sort Icon ─────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }) {
    if (sortField !== field) return <span className="ml-1 text-slate-600">↕</span>;
    return <span className="ml-1 text-indigo-400">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await API.put('/user/password', form);
            setSuccess('Password updated successfully.');
            setForm({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "block w-full rounded-xl border-0 bg-slate-800 px-4 py-2.5 text-white text-sm placeholder:text-slate-500 outline-none ring-1 ring-inset ring-slate-700/50 focus:ring-2 focus:ring-indigo-500 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Change Password</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {error && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
                    {success && <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{success}</p>}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                        <input type="password" className={inputCls} placeholder="••••••••"
                            value={form.currentPassword}
                            onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            New Password <span className="text-slate-600 normal-case font-normal">(8–16 chars, 1 uppercase, 1 special)</span>
                        </label>
                        <input type="password" className={inputCls} placeholder="••••••••"
                            value={form.newPassword}
                            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
                    </div>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Updating…' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [sort, setSort] = useState({ field: 'userName', dir: 'asc' });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [error, setError] = useState('');

    const fetchDashboard = async () => {
        try {
            const res = await API.get('/owner/dashboard');
            setDashboard(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard.');
        }
    };

    useEffect(() => { fetchDashboard(); }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const sorted = (arr) => [...arr].sort((a, b) => {
        const av = (a[sort.field] ?? '').toString().toLowerCase();
        const bv = (b[sort.field] ?? '').toString().toLowerCase();
        return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const toggleSort = (field) => {
        if (sort.field === field) setSort(s => ({ field, dir: s.dir === 'asc' ? 'desc' : 'asc' }));
        else setSort({ field, dir: 'asc' });
    };

    const thCls = "px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors whitespace-nowrap";
    const tdCls = "px-4 py-3 text-sm text-slate-300";

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Top Nav */}
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">S</div>
                        <span className="text-sm font-bold tracking-tight text-white">Spica Labs</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Owner Console</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{user?.name}</span>
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">

                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Store Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Monitor your store's ratings and customer feedback.</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                {dashboard && (
                    <>
                        {/* Store Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Store Name Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6">
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-500 opacity-10" />
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 mb-4">
                                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Store</p>
                                <p className="mt-1 text-xl font-extrabold tracking-tight text-white truncate">{dashboard.storeName}</p>
                            </div>

                            {/* Average Rating Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6">
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500 opacity-10" />
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 mb-4">
                                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Average Rating</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <p className="text-3xl font-extrabold tracking-tight text-white">
                                        {dashboard.averageRating ?? <span className="text-slate-600 text-lg">N/A</span>}
                                    </p>
                                    {dashboard.averageRating && (
                                        <span className="text-amber-400 text-2xl leading-none">
                                            {'★'.repeat(Math.round(dashboard.averageRating))}{'☆'.repeat(5 - Math.round(dashboard.averageRating))}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Based on {dashboard.ratings?.length ?? 0} {dashboard.ratings?.length === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>
                        </div>

                        {/* Ratings Table */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Customer Ratings</h2>
                                <span className="text-xs text-slate-600">{dashboard.ratings?.length ?? 0} total</span>
                            </div>

                            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-slate-800 bg-slate-900/50">
                                            <tr>
                                                {[
                                                    { field: 'userName', label: 'Customer Name' },
                                                ].map(({ field, label }) => (
                                                    <th key={field} className={thCls} onClick={() => toggleSort(field)}>
                                                        {label}<SortIcon field={field} sortField={sort.field} sortDir={sort.dir} />
                                                    </th>
                                                ))}
                                                <th className={thCls + ' cursor-pointer'} onClick={() => toggleSort('rating')}>
                                                    Rating<SortIcon field="rating" sortField={sort.field} sortDir={sort.dir} />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {sorted(dashboard.ratings ?? []).map(r => (
                                                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className={tdCls + ' font-medium text-white'}>{r.userName}</td>
                                                    <td className={tdCls}><Stars value={r.rating} /></td>
                                                </tr>
                                            ))}
                                            {(dashboard.ratings?.length === 0) && (
                                                <tr>
                                                    <td colSpan={2} className="px-4 py-10 text-center text-sm text-slate-600">
                                                        No ratings submitted yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Loading state */}
                {!dashboard && !error && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-slate-500">
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm">Loading dashboard…</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Change Password Modal */}
            {showChangePassword && (
                <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
            )}
        </div>
    );
}