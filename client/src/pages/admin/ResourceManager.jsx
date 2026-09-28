import { ImageOff, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ErrorNotice } from '../../components/States.jsx';
import { api, assetUrl } from '../../lib/api.js';
import useApi from '../../lib/useApi.js';

/**
 * Generic list + create/edit/delete screen for an API resource.
 * `fields` describes the form: { name, label, type: text|textarea|number|select|checkbox|image|list, options, required, hint }
 */
export default function ResourceManager({ title, singular, listPath, basePath, fields, describe }) {
  const { data, loading, error, reload } = useApi(listPath, { auth: true });
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [notice, setNotice] = useState('');

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.name}"? This cannot be undone.`)) return;
    try {
      await api(`${basePath}/${item._id}`, { method: 'DELETE', auth: true });
      setNotice(`${singular} deleted`);
      reload();
    } catch (err) {
      setNotice(err.message);
    }
  };

  const onSaved = (message) => {
    setEditing(null);
    setNotice(message);
    reload();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="text-muted">{data ? `${data.length} ${data.length === 1 ? singular.toLowerCase() : title.toLowerCase()}` : ' '}</p>
        </div>
        <button type="button" className="btn-primary !py-3" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" /> Add {singular.toLowerCase()}
        </button>
      </div>

      {notice && (
        <p className="mt-5 flex items-center justify-between rounded-xl bg-gold-100 px-4 py-3 text-sm text-wine-800" role="status">
          {notice}
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </p>
      )}

      <div className="mt-6 space-y-3">
        {loading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-600" />}
        {error && <ErrorNotice error={error} onRetry={reload} />}
        {data?.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">Nothing here yet.</p>}
        {data?.map((item) => (
          <div key={item._id} className="flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 ring-1 ring-gold-500/15">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ivory-100">
              {item.image ? (
                <img src={assetUrl(item.image)} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="m-auto mt-5 h-5 w-5 text-gold-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg text-wine-800">{item.title || item.name}</p>
              <p className="truncate text-sm text-muted">{describe(item)}</p>
            </div>
            <button type="button" onClick={() => setEditing(item)} className="grid h-10 w-10 place-items-center rounded-full text-wine-700 hover:bg-ivory-100" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => remove(item)} className="grid h-10 w-10 place-items-center rounded-full text-wine-600 hover:bg-wine-50" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <EditorDialog
          item={editing}
          singular={singular}
          basePath={basePath}
          fields={fields}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function initialValues(fields, item) {
  return Object.fromEntries(
    fields.map((f) => {
      const v = item[f.name];
      if (f.type === 'checkbox') return [f.name, v ?? f.default ?? false];
      if (f.type === 'list') return [f.name, (v || []).join(', ')];
      if (f.type === 'image') return [f.name, null];
      return [f.name, v ?? f.default ?? ''];
    })
  );
}

function EditorDialog({ item, singular, basePath, fields, onClose, onSaved }) {
  const isNew = !item._id;
  const [values, setValues] = useState(() => initialValues(fields, item));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!values.image) return setPreview('');
    const url = URL.createObjectURL(values.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.image]);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    const form = new FormData();
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === 'image') {
        if (v) form.append('image', v);
      } else if (f.type === 'checkbox') {
        form.append(f.name, v ? 'true' : 'false');
      } else if (f.type === 'number' && v === '' && !f.clearable) {
        // leave unset
      } else {
        form.append(f.name, v);
      }
    }
    try {
      const res = await api(isNew ? basePath : `${basePath}/${item._id}`, { method: isNew ? 'POST' : 'PUT', body: form, auth: true });
      onSaved(res.message || `${singular} saved`);
    } catch (err) {
      const fieldErrors = err.fieldErrors || {};
      if (fieldErrors.imageUrl) fieldErrors.image = fieldErrors.imageUrl;
      setErrors(fieldErrors);
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-wine-950/60 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] bg-ivory-50 p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{isNew ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}</h3>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ivory-200" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {fields.map((f) => {
            const id = `f-${f.name}`;
            const wide = ['textarea', 'image', 'list'].includes(f.type) || f.wide;
            const common = {
              id,
              'aria-invalid': errors[f.name] ? 'true' : undefined,
            };
            return (
              <div key={f.name} className={wide ? 'sm:col-span-2' : ''}>
                {f.type === 'checkbox' ? (
                  <label htmlFor={id} className="mt-7 flex cursor-pointer items-center gap-3">
                    <input {...common} type="checkbox" checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-5 w-5 accent-wine-800" />
                    <span className="font-medium text-wine-800">{f.label}</span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="field-label">
                      {f.label} {f.required && isNew && <span className="text-gold-600">*</span>}
                    </label>
                    {f.type === 'textarea' && (
                      <textarea {...common} rows={f.rows || 3} className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
                    )}
                    {f.type === 'select' && (
                      <select {...common} className="field select-chevron" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                        {!f.required && <option value="">—</option>}
                        {f.options.map((o) => {
                          const [value, label] = Array.isArray(o) ? o : [o, o];
                          return (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {['text', 'number', 'list'].includes(f.type) && (
                      <input
                        {...common}
                        type={f.type === 'number' ? 'number' : 'text'}
                        min={f.type === 'number' ? 0 : undefined}
                        className="field"
                        value={values[f.name]}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    )}
                    {f.type === 'image' && (
                      <div className="flex items-center gap-4">
                        {(preview || item.image) && (
                          <img
                            src={preview || assetUrl(item.image)}
                            alt=""
                            className="h-20 w-20 rounded-xl object-cover ring-1 ring-gold-500/20"
                          />
                        )}
                        <input
                          {...common}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={(e) => set('image', e.target.files?.[0] || null)}
                          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-wine-800 file:px-4 file:py-2 file:text-ivory-50"
                        />
                      </div>
                    )}
                    {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
                  </>
                )}
                {errors[f.name] && <p className="field-error">{errors[f.name]}</p>}
              </div>
            );
          })}
        </div>

        {formError && <p className="mt-5 rounded-xl bg-wine-50 px-4 py-3 text-sm text-wine-700">{formError}</p>}

        <div className="mt-7 flex justify-end gap-3">
          <button type="button" className="btn-outline !py-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary !py-3" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}
