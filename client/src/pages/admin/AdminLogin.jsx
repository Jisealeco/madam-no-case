import { Loader2, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Monogram } from '../../components/Logo.jsx';
import { useAuth } from '../../lib/AuthContext.jsx';

export default function AdminLogin() {
  const { admin, checking, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!checking && admin) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-svh place-items-center bg-wine-900 bg-lattice px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Monogram light className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-3xl font-semibold text-ivory-50">Admin sign in</h1>
          <p className="mt-2 text-ivory-100/70">Manage services, products, gallery and enquiries.</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5 rounded-[1.75rem] bg-ivory-50 p-7 shadow-2xl sm:p-9">
          <div>
            <label htmlFor="admin-email" className="field-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              className="field"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="field-label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              className="field"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-wine-50 px-4 py-3 text-sm text-wine-700">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />} Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ivory-100/60">
          <Link to="/" className="hover:text-gold-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
