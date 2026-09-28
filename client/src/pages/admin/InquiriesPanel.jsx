import { CalendarDays, Loader2, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { WhatsAppIcon } from '../../components/Icons.jsx';
import { ErrorNotice } from '../../components/States.jsx';
import { api } from '../../lib/api.js';
import useApi from '../../lib/useApi.js';

const STATUSES = ['new', 'read', 'replied', 'archived'];
const tone = {
  new: 'bg-wine-800 text-ivory-50',
  read: 'bg-ivory-200 text-wine-800',
  replied: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-stone-200 text-stone-600',
};

const formatDate = (d) =>
  new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function InquiriesPanel({ onChange }) {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState('');
  const { data, meta, loading, error, reload } = useApi(`/contact?page=${page}&limit=20${filter ? `&status=${filter}` : ''}`, { auth: true });

  const run = async (request) => {
    setActionError('');
    try {
      await request();
      reload();
      onChange?.();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const setStatus = (inquiry, status) =>
    run(() => api(`/contact/${inquiry._id}`, { method: 'PATCH', body: { status }, auth: true }));

  const remove = (inquiry) => {
    if (!window.confirm(`Delete the enquiry from ${inquiry.name}?`)) return;
    run(() => api(`/contact/${inquiry._id}`, { method: 'DELETE', auth: true }));
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold">Enquiries</h2>
      <p className="text-muted">Messages sent through the website contact form.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['', ...STATUSES].map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => {
              setFilter(s);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ring-1 transition ${
              filter === s ? 'bg-wine-800 text-ivory-50 ring-wine-800' : 'bg-white ring-gold-500/25 hover:ring-gold-500'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {actionError && <p className="mt-5 rounded-xl bg-wine-50 px-4 py-3 text-sm text-wine-700">{actionError}</p>}

      <div className="mt-6 space-y-4">
        {loading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-600" />}
        {error && <ErrorNotice error={error} onRetry={reload} />}
        {data?.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">No enquiries {filter && `marked "${filter}"`} yet.</p>}
        {data?.map((q) => {
          const waNumber = q.phone.replace(/\D/g, '');
          return (
            <article key={q._id} className={`rounded-2xl bg-white p-5 ring-1 sm:p-6 ${q.status === 'new' ? 'ring-gold-500/60' : 'ring-gold-500/15'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-wine-800">{q.name}</p>
                  <p className="text-sm text-muted">
                    {formatDate(q.createdAt)}
                    {q.serviceNeeded && (
                      <>
                        {' · '}
                        <span className="text-gold-700">{q.serviceNeeded}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={q.status}
                    onChange={(e) => setStatus(q, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1.5 text-sm capitalize ${tone[q.status]}`}
                    aria-label="Status"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => remove(q)} className="grid h-9 w-9 place-items-center rounded-full text-wine-600 hover:bg-wine-50" aria-label="Delete enquiry">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-ink/90">{q.message}</p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={`tel:${q.phone}`} className="inline-flex items-center gap-1.5 text-wine-700 hover:underline">
                  <Phone className="h-4 w-4" /> {q.phone}
                </a>
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#1a7c43] hover:underline">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
                {q.email && (
                  <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1.5 text-wine-700 hover:underline">
                    <Mail className="h-4 w-4" /> {q.email}
                  </a>
                )}
                {q.eventDate && (
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <CalendarDays className="h-4 w-4" /> Event: {new Date(q.eventDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {meta && meta.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <button type="button" className="btn-outline !px-4 !py-2" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {meta.page} of {meta.pages}
          </span>
          <button type="button" className="btn-outline !px-4 !py-2" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
