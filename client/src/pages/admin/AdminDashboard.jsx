import { ExternalLink, Images, Inbox, KeyRound, Loader2, LogOut, Package, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Monogram } from '../../components/Logo.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/AuthContext.jsx';
import { AVAILABILITY, formatPrice, GALLERY_CATEGORIES, PRODUCT_CATEGORIES } from '../../lib/services.js';
import useApi from '../../lib/useApi.js';
import InquiriesPanel from './InquiriesPanel.jsx';
import ResourceManager from './ResourceManager.jsx';

const serviceFields = [
  { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
  { name: 'summary', label: 'Short summary', type: 'textarea', rows: 2, hint: 'One sentence, shown on the home page (max 240 characters).' },
  { name: 'description', label: 'Full description', type: 'textarea', rows: 4 },
  { name: 'items', label: 'Items / options', type: 'list', hint: 'Comma-separated, e.g. Sanmiyan, Etu, Alaari' },
  { name: 'image', label: 'Image (optional)', type: 'image' },
  { name: 'order', label: 'Display order', type: 'number', hint: 'Lower numbers appear first.' },
  { name: 'isActive', label: 'Visible on website', type: 'checkbox', default: true },
];

const productFields = [
  { name: 'name', label: 'Product name', type: 'text', required: true, wide: true },
  { name: 'category', label: 'Category', type: 'select', options: PRODUCT_CATEGORIES, required: true, default: PRODUCT_CATEGORIES[0] },
  {
    name: 'availability',
    label: 'Availability',
    type: 'select',
    required: true,
    default: 'available',
    options: Object.entries(AVAILABILITY).map(([value, { label }]) => [value, label]),
  },
  { name: 'price', label: 'Price in ₦ (optional)', type: 'number', clearable: true, hint: 'Leave empty to show "Price on request".' },
  { name: 'featured', label: 'Feature on home page', type: 'checkbox' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'image', label: 'Photo', type: 'image' },
];

const galleryFields = [
  { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
  { name: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORIES, required: true, default: 'Decorations' },
  { name: 'order', label: 'Display order', type: 'number' },
  { name: 'caption', label: 'Caption', type: 'textarea', rows: 2 },
  { name: 'image', label: 'Photo', type: 'image', required: true },
];

function AccountPanel() {
  const { admin, replaceToken } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ busy: false, message: '', error: false });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ busy: true, message: '', error: false });
    try {
      const res = await api('/auth/password', { method: 'PUT', body: form, auth: true });
      replaceToken(res.data.token, res.data.admin);
      setForm({ currentPassword: '', newPassword: '' });
      setStatus({ busy: false, message: 'Password updated.', error: false });
    } catch (err) {
      const detail = err.errors?.[0]?.message;
      setStatus({ busy: false, message: detail || err.message, error: true });
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-semibold">Account</h2>
      <p className="text-muted">
        Signed in as <strong className="font-medium text-wine-800">{admin.email}</strong>
      </p>
      <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl bg-white p-6 ring-1 ring-gold-500/15">
        <div>
          <label htmlFor="cur-pw" className="field-label">
            Current password
          </label>
          <input id="cur-pw" type="password" autoComplete="current-password" className="field" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="new-pw" className="field-label">
            New password
          </label>
          <input id="new-pw" type="password" autoComplete="new-password" minLength={10} className="field" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} required />
          <p className="mt-1 text-xs text-muted">At least 10 characters. Other devices will be signed out.</p>
        </div>
        {status.message && <p className={`rounded-xl px-4 py-3 text-sm ${status.error ? 'bg-wine-50 text-wine-700' : 'bg-emerald-50 text-emerald-800'}`}>{status.message}</p>}
        <button type="submit" className="btn-primary !py-3" disabled={status.busy}>
          {status.busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
        </button>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const { admin, checking, logout } = useAuth();
  const [tab, setTab] = useState('inquiries');
  const unread = useApi('/contact?status=new&limit=1', { auth: true, enabled: Boolean(admin) });

  if (checking) {
    return (
      <div className="grid min-h-svh place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin" replace />;

  const tabs = [
    { id: 'inquiries', label: 'Enquiries', icon: Inbox, badge: unread.meta?.total || 0 },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'account', label: 'Account', icon: KeyRound },
  ];

  return (
    <div className="min-h-svh bg-ivory-100 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="bg-wine-900 bg-lattice text-ivory-100 lg:sticky lg:top-0 lg:h-svh">
        <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block lg:px-6 lg:py-8">
          <div className="flex items-center gap-3">
            <Monogram light className="h-10 w-10" />
            <div>
              <p className="font-display text-lg leading-tight text-ivory-50">Madam No Case</p>
              <p className="text-xs tracking-[0.2em] text-gold-300 uppercase">Admin</p>
            </div>
          </div>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-sm text-ivory-100/70 hover:text-gold-300 lg:hidden">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4" aria-label="Admin sections">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[0.95rem] transition ${
                tab === id ? 'bg-gold-400 text-wine-900' : 'text-ivory-100/80 hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
              {badge > 0 && <span className="ml-auto rounded-full bg-wine-600 px-2 text-xs text-ivory-50">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="hidden space-y-3 px-8 pt-8 text-sm text-ivory-100/70 lg:block">
          <Link to="/" target="_blank" className="flex items-center gap-2 hover:text-gold-300">
            <ExternalLink className="h-4 w-4" /> View website
          </Link>
          <button type="button" onClick={logout} className="flex items-center gap-2 hover:text-gold-300">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-4xl">
          {tab === 'inquiries' && <InquiriesPanel onChange={unread.reload} />}
          {tab === 'services' && (
            <ResourceManager
              title="Services"
              singular="Service"
              listPath="/services?all=true"
              basePath="/services"
              fields={serviceFields}
              describe={(s) => `${s.isActive ? 'Visible' : 'Hidden'} · order ${s.order} · ${s.summary || ''}`}
            />
          )}
          {tab === 'products' && (
            <ResourceManager
              title="Products"
              singular="Product"
              listPath="/products?limit=100"
              basePath="/products"
              fields={productFields}
              describe={(p) => `${p.category} · ${formatPrice(p.price)} · ${AVAILABILITY[p.availability]?.label}${p.featured ? ' · Featured' : ''}`}
            />
          )}
          {tab === 'gallery' && (
            <ResourceManager
              title="Gallery"
              singular="Photo"
              listPath="/gallery"
              basePath="/gallery"
              fields={galleryFields}
              describe={(g) => `${g.category}${g.caption ? ` · ${g.caption}` : ''}`}
            />
          )}
          {tab === 'account' && <AccountPanel />}
        </div>
      </main>
    </div>
  );
}
