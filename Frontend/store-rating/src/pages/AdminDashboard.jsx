import { useState, useEffect, useContext } from 'react';
import API from '../api/AxiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 ${color}`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} bg-opacity-10 mb-4`}>
                {icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                {value ?? <span className="text-slate-600 text-lg">Loading…</span>}
            </p>
        </div>
    );
}

// ── Sort Icon ─────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }) {
    if (sortField !== field) return <span className="ml-1 text-slate-600">↕</span>;
    return <span className="ml-1 text-indigo-400">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

// ── Modal Shell ───────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

// ── Input Field Helper ────────────────────────────────────────────────────────
function Field({ label, hint, error, children }) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {label} {hint && <span className="text-slate-600 normal-case font-normal">{hint}</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
        </div>
    );
}

const inputCls = (err) =>
    `block w-full rounded-xl border-0 bg-slate-800 px-4 py-2.5 text-white text-sm placeholder:text-slate-500 outline-none ring-1 ring-inset transition-all focus:ring-2 focus:ring-indigo-500 ${err ? 'ring-rose-500' : 'ring-slate-700/50'}`;

// ── Add User Modal ────────────────────────────────────────────────────────────
function AddUserModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async () => {
        setLoading(true);
        setErrors({});
        try {
            await API.post('/admin/users', form);
            onSuccess();
            onClose();
        } catch (err) {
            setErrors(err.response?.data || { global: 'Failed to create user.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Add New User" onClose={onClose}>
            <div className="space-y-4">
                {errors.global && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{errors.global}</p>}
                <Field label="Full Name" hint="(20–60 chars)" error={errors.name}>
                    <input className={inputCls(errors.name)} placeholder="Johnathan Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" className={inputCls(errors.email)} placeholder="user@spicalabs.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Password" hint="(8–16 chars, 1 uppercase, 1 special)" error={errors.password}>
                    <input type="password" className={inputCls(errors.password)} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                </Field>
                <Field label="Address" hint="(max 400 chars)" error={errors.address}>
                    <textarea rows={2} className={inputCls(errors.address) + ' resize-none'} placeholder="Corporate address…" value={form.address} onChange={e => set('address', e.target.value)} />
                </Field>
                <Field label="Role" error={errors.role}>
                    <select className={inputCls(errors.role)} value={form.role} onChange={e => set('role', e.target.value)}>
                        <option value="NORMAL_USER">Normal User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STORE_OWNER">Store Owner</option>
                    </select>
                </Field>
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full mt-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                    {loading ? 'Creating…' : 'Create User'}
                </button>
            </div>
        </Modal>
    );
}

// ── Add Store Modal ───────────────────────────────────────────────────────────
function AddStoreModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async () => {
        setLoading(true);
        setErrors({});
        try {
            await API.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
            onSuccess();
            onClose();
        } catch (err) {
            setErrors(err.response?.data || { global: 'Failed to create store.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Add New Store" onClose={onClose}>
            <div className="space-y-4">
                {errors.global && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{errors.global}</p>}
                <Field label="Store Name" hint="(20–60 chars)" error={errors.name}>
                    <input className={inputCls(errors.name)} placeholder="Spica Electronics Hub" value={form.name} onChange={e => set('name', e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" className={inputCls(errors.email)} placeholder="store@spicalabs.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Address" hint="(max 400 chars)" error={errors.address}>
                    <textarea rows={2} className={inputCls(errors.address) + ' resize-none'} placeholder="Store address…" value={form.address} onChange={e => set('address', e.target.value)} />
                </Field>
                <Field label="Owner ID" hint="(optional UUID)" error={errors.ownerId}>
                    <input className={inputCls(errors.ownerId)} placeholder="Leave blank if unassigned" value={form.ownerId} onChange={e => set('ownerId', e.target.value)} />
                </Field>
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full mt-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                    {loading ? 'Creating…' : 'Create Store'}
                </button>
            </div>
        </Modal>
    );
}

// ── Stars Display ─────────────────────────────────────────────────────────────
function Stars({ value }) {
    if (!value) return <span className="text-slate-600 text-xs">No ratings</span>;
    return (
        <span className="flex items-center gap-1">
            <span className="text-amber-400 text-sm">{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>
            <span className="text-slate-400 text-xs">{value.toFixed(1)}</span>
        </span>
    );
}

// ── Role Badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
    const map = {
        ADMIN: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        NORMAL_USER: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        STORE_OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
    const labels = { ADMIN: 'Admin', NORMAL_USER: 'User', STORE_OWNER: 'Owner' };
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${map[role] || 'bg-slate-700 text-slate-300'}`}>
            {labels[role] || role}
        </span>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [tab, setTab] = useState('users'); // 'users' | 'stores'

    // Users state
    const [users, setUsers] = useState([]);
    const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [userSort, setUserSort] = useState({ field: 'name', dir: 'asc' });

    // Stores state
    const [stores, setStores] = useState([]);
    const [storeFilters, setStoreFilters] = useState({ name: '', address: '' });
    const [storeSort, setStoreSort] = useState({ field: 'name', dir: 'asc' });

    // Modals
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);

    // Selected user detail
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data);
        } catch { }
    };

    const fetchUsers = async () => {
        try {
            const params = Object.fromEntries(Object.entries(userFilters).filter(([, v]) => v));
            const res = await API.get('/admin/users', { params });
            setUsers(res.data);
        } catch { }
    };

    const fetchStores = async () => {
        try {
            const params = Object.fromEntries(Object.entries(storeFilters).filter(([, v]) => v));
            const res = await API.get('/admin/stores', { params });
            setStores(res.data);
        } catch { }
    };

    useEffect(() => { fetchStats(); }, []);
    useEffect(() => { fetchUsers(); }, [userFilters]);
    useEffect(() => { fetchStores(); }, [storeFilters]);

    const handleLogout = () => { logout(); navigate('/login'); };

    // Sorting helper
    const sorted = (arr, { field, dir }) => [...arr].sort((a, b) => {
        const av = (a[field] ?? '').toString().toLowerCase();
        const bv = (b[field] ?? '').toString().toLowerCase();
        return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const toggleSort = (current, field, setter) => {
        if (current.field === field) setter({ field, dir: current.dir === 'asc' ? 'desc' : 'asc' });
        else setter({ field, dir: 'asc' });
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
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Admin Console</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">{user?.name}</span>
                        <button onClick={handleLogout} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">

                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Platform overview and management controls.</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Users"
                        value={stats?.totalUsers}
                        color="bg-indigo-500"
                        icon={<svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <StatCard
                        label="Total Stores"
                        value={stats?.totalStores}
                        color="bg-emerald-500"
                        icon={<svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    <StatCard
                        label="Total Ratings"
                        value={stats?.totalRatings}
                        color="bg-amber-500"
                        icon={<svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                    />
                </div>

                {/* Tab Bar + Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1">
                        {['users', 'stores'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
                            <span>+ Add User</span>
                        </button>
                        <button onClick={() => setShowAddStore(true)} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all">
                            <span>+ Add Store</span>
                        </button>
                    </div>
                </div>

                {/* ── USERS TAB ── */}
                {tab === 'users' && (
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                        {/* Filters */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-slate-800">
                            {[
                                { key: 'name', placeholder: 'Filter by name…' },
                                { key: 'email', placeholder: 'Filter by email…' },
                                { key: 'address', placeholder: 'Filter by address…' },
                            ].map(({ key, placeholder }) => (
                                <input
                                    key={key}
                                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none ring-1 ring-slate-700/50 focus:ring-indigo-500 transition-all"
                                    placeholder={placeholder}
                                    value={userFilters[key]}
                                    onChange={e => setUserFilters(f => ({ ...f, [key]: e.target.value }))}
                                />
                            ))}
                            <select
                                className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-slate-700/50 focus:ring-indigo-500 transition-all"
                                value={userFilters.role}
                                onChange={e => setUserFilters(f => ({ ...f, role: e.target.value }))}
                            >
                                <option value="">All Roles</option>
                                <option value="NORMAL_USER">Normal User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STORE_OWNER">Store Owner</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-800 bg-slate-900/50">
                                    <tr>
                                        {[
                                            { field: 'name', label: 'Name' },
                                            { field: 'email', label: 'Email' },
                                            { field: 'address', label: 'Address' },
                                            { field: 'role', label: 'Role' },
                                        ].map(({ field, label }) => (
                                            <th key={field} className={thCls} onClick={() => toggleSort(userSort, field, setUserSort)}>
                                                {label}<SortIcon field={field} sortField={userSort.field} sortDir={userSort.dir} />
                                            </th>
                                        ))}
                                        <th className={thCls}>Rating</th>
                                        <th className={thCls}>Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {sorted(users, userSort).map(u => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className={tdCls + ' font-medium text-white'}>{u.name}</td>
                                            <td className={tdCls}>{u.email}</td>
                                            <td className={tdCls + ' max-w-xs truncate'}>{u.address}</td>
                                            <td className={tdCls}><RoleBadge role={u.role} /></td>
                                            <td className={tdCls}>{u.role === 'STORE_OWNER' ? <Stars value={u.averageRating} /> : <span className="text-slate-600 text-xs">—</span>}</td>
                                            <td className={tdCls}>
                                                <button
                                                    onClick={() => setSelectedUser(u)}
                                                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-600">No users found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── STORES TAB ── */}
                {tab === 'stores' && (
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                        {/* Filters */}
                        <div className="grid grid-cols-2 gap-3 p-4 border-b border-slate-800">
                            {[
                                { key: 'name', placeholder: 'Filter by name…' },
                                { key: 'address', placeholder: 'Filter by address…' },
                            ].map(({ key, placeholder }) => (
                                <input
                                    key={key}
                                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none ring-1 ring-slate-700/50 focus:ring-indigo-500 transition-all"
                                    placeholder={placeholder}
                                    value={storeFilters[key]}
                                    onChange={e => setStoreFilters(f => ({ ...f, [key]: e.target.value }))}
                                />
                            ))}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-800 bg-slate-900/50">
                                    <tr>
                                        {[
                                            { field: 'name', label: 'Name' },
                                            { field: 'email', label: 'Email' },
                                            { field: 'address', label: 'Address' },
                                            { field: 'ownerName', label: 'Owner' },
                                        ].map(({ field, label }) => (
                                            <th key={field} className={thCls} onClick={() => toggleSort(storeSort, field, setStoreSort)}>
                                                {label}<SortIcon field={field} sortField={storeSort.field} sortDir={storeSort.dir} />
                                            </th>
                                        ))}
                                        <th className={thCls}>Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {sorted(stores, storeSort).map(s => (
                                        <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className={tdCls + ' font-medium text-white'}>{s.name}</td>
                                            <td className={tdCls}>{s.email}</td>
                                            <td className={tdCls + ' max-w-xs truncate'}>{s.address}</td>
                                            <td className={tdCls}>{s.ownerName ?? <span className="text-slate-600 text-xs">Unassigned</span>}</td>
                                            <td className={tdCls}><Stars value={s.averageRating} /></td>
                                        </tr>
                                    ))}
                                    {stores.length === 0 && (
                                        <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-600">No stores found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* User Detail Modal */}
            {selectedUser && (
                <Modal title="User Detail" onClose={() => setSelectedUser(null)}>
                    <div className="space-y-3">
                        {[
                            { label: 'Name', value: selectedUser.name },
                            { label: 'Email', value: selectedUser.email },
                            { label: 'Address', value: selectedUser.address },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
                                <span className="text-sm text-white text-right">{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Role</span>
                            <RoleBadge role={selectedUser.role} />
                        </div>
                        {selectedUser.role === 'STORE_OWNER' && (
                            <div className="flex justify-between gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Store Rating</span>
                                <Stars value={selectedUser.averageRating} />
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Modals */}
            {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={fetchUsers} />}
            {showAddStore && <AddStoreModal onClose={() => setShowAddStore(false)} onSuccess={fetchStores} />}
        </div>
    );
}