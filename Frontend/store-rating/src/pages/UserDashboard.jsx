import { useState, useEffect, useContext } from 'react';
import API from '../api/AxiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Star Rating Picker ────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-2xl transition-all leading-none"
                >
                    <span className={(hovered || value) >= star ? 'text-amber-400' : 'text-slate-700'}>
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
}

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

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({ store, existingRating, onClose, onSuccess }) {
    const [rating, setRating] = useState(existingRating?.rating || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isUpdate = !!existingRating;

    const submit = async () => {
        if (rating === 0) { setError('Please select a rating.'); return; }
        setLoading(true);
        setError('');
        try {
            if (isUpdate) {
                await API.put('/ratings', { storeId: store.id, rating });
            } else {
                await API.post('/ratings', { storeId: store.id, rating });
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                        {isUpdate ? 'Update Rating' : 'Submit Rating'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-white">{store.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{store.address}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Your Rating</p>
                        <StarPicker value={rating} onChange={setRating} />
                    </div>
                    {error && <p className="text-xs text-rose-400">{error}</p>}
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Submitting…' : isUpdate ? 'Update Rating' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
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
                        <input type="password" className={inputCls} placeholder="••••••••" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            New Password <span className="text-slate-600 normal-case font-normal">(8–16 chars, 1 uppercase, 1 special)</span>
                        </label>
                        <input type="password" className={inputCls} placeholder="••••••••" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
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
export default function UserDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [myRatings, setMyRatings] = useState({}); // storeId -> rating object
    const [search, setSearch] = useState({ name: '', address: '' });
    const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
    const [ratingModal, setRatingModal] = useState(null); // { store, existingRating }
    const [showChangePassword, setShowChangePassword] = useState(false);

    const fetchStores = async () => {
        try {
            const params = Object.fromEntries(Object.entries(search).filter(([, v]) => v));
            const res = await API.get('/stores', { params });
            setStores(res.data);
        } catch { }
    };

    const fetchMyRatings = async (storeList) => {
        const results = {};
        await Promise.allSettled(
            storeList.map(async (s) => {
                try {
                    const res = await API.get(`/ratings/my/${s.id}`);
                    results[s.id] = res.data;
                } catch {
                    results[s.id] = null;
                }
            })
        );
        setMyRatings(results);
    };

    useEffect(() => { fetchStores(); }, [search]);

    useEffect(() => {
        if (stores.length > 0) fetchMyRatings(stores);
    }, [stores]);

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
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Store Directory</span>
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

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">

                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Store Directory</h1>
                    <p className="mt-1 text-sm text-slate-500">Browse all registered stores and submit your ratings.</p>
                </div>

                {/* Search Filters */}
                <div className="flex gap-3 flex-wrap">
                    <input
                        className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all min-w-[200px]"
                        placeholder="Search by name…"
                        value={search.name}
                        onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
                    />
                    <input
                        className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all min-w-[200px]"
                        placeholder="Search by address…"
                        value={search.address}
                        onChange={e => setSearch(s => ({ ...s, address: e.target.value }))}
                    />
                </div>

                {/* Stores Table */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-800 bg-slate-900/50">
                                <tr>
                                    {[
                                        { field: 'name', label: 'Store Name' },
                                        { field: 'address', label: 'Address' },
                                    ].map(({ field, label }) => (
                                        <th key={field} className={thCls} onClick={() => toggleSort(field)}>
                                            {label}<SortIcon field={field} sortField={sort.field} sortDir={sort.dir} />
                                        </th>
                                    ))}
                                    <th className={thCls}>Overall Rating</th>
                                    <th className={thCls}>Your Rating</th>
                                    <th className={thCls}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {sorted(stores).map(store => {
                                    const myRating = myRatings[store.id];
                                    return (
                                        <tr key={store.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className={tdCls + ' font-medium text-white'}>{store.name}</td>
                                            <td className={tdCls + ' max-w-xs truncate'}>{store.address}</td>
                                            <td className={tdCls}><Stars value={store.averageRating} /></td>
                                            <td className={tdCls}>
                                                {myRating
                                                    ? <Stars value={myRating.rating} />
                                                    : <span className="text-slate-600 text-xs">Not rated</span>
                                                }
                                            </td>
                                            <td className={tdCls}>
                                                <button
                                                    onClick={() => setRatingModal({ store, existingRating: myRating })}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${myRating
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                                                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                                                        }`}
                                                >
                                                    {myRating ? 'Edit Rating' : 'Rate Store'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {stores.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">
                                            No stores found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Rating Modal */}
            {ratingModal && (
                <RatingModal
                    store={ratingModal.store}
                    existingRating={ratingModal.existingRating}
                    onClose={() => setRatingModal(null)}
                    onSuccess={() => {
                        fetchStores();
                    }}
                />
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
                <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
            )}
        </div>
    );
}