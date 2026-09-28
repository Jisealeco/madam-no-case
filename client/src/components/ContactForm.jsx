import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api.js';
import { whatsappLink } from '../lib/business.js';
import { WhatsAppIcon } from './Icons.jsx';

const empty = { name: '', phone: '', email: '', serviceNeeded: '', eventDate: '', message: '', website: '' };

export default function ContactForm({ services, defaultService = '' }) {
  const [values, setValues] = useState({ ...empty, serviceNeeded: defaultService });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 2) next.name = 'Please enter your name';
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(values.phone.trim())) next.phone = 'Please enter a valid phone number';
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Please enter a valid email address';
    if (values.message.trim().length < 5) next.message = 'Please tell us a little about what you need';
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setStatus({ state: 'sending', message: '' });
    try {
      const res = await api('/contact', { method: 'POST', body: values });
      setStatus({ state: 'sent', message: res.message });
      setValues({ ...empty });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setStatus({ state: 'error', message: err.message });
    }
  };

  if (status.state === 'sent') {
    return (
      <div className="flex flex-col items-center rounded-[1.75rem] bg-white px-6 py-14 text-center shadow-card ring-1 ring-gold-500/15 sm:px-10" role="status">
        <CheckCircle2 className="h-12 w-12 text-gold-500" />
        <h3 className="mt-5 text-2xl font-semibold">Message received</h3>
        <p className="mt-3 max-w-sm text-muted">{status.message}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <WhatsAppIcon /> Follow up on WhatsApp
          </a>
          <button type="button" className="btn-outline" onClick={() => setStatus({ state: 'idle', message: '' })}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const field = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: update,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorFor = (name) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="field-error">
        {errors[name]}
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-gold-500/15 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Full name <span className="text-gold-600">*</span>
          </label>
          <input {...field('name')} className="field" autoComplete="name" placeholder="e.g. Adebola Akin" />
          {errorFor('name')}
        </div>
        <div>
          <label htmlFor="contact-phone" className="field-label">
            Phone / WhatsApp <span className="text-gold-600">*</span>
          </label>
          <input {...field('phone')} type="tel" className="field" autoComplete="tel" inputMode="tel" placeholder="e.g. 0803 000 0000" />
          {errorFor('phone')}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input {...field('email')} type="email" className="field" autoComplete="email" placeholder="you@example.com" />
          {errorFor('email')}
        </div>
        <div>
          <label htmlFor="contact-eventDate" className="field-label">
            Event date <span className="font-normal text-muted">(optional)</span>
          </label>
          <input {...field('eventDate')} type="date" className="field" />
          {errorFor('eventDate')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-serviceNeeded" className="field-label">
            Service needed
          </label>
          <select {...field('serviceNeeded')} className="field select-chevron">
            <option value="">Select a service (optional)</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Other / Not sure">Other / Not sure yet</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="field-label">
            Your message <span className="text-gold-600">*</span>
          </label>
          <textarea
            {...field('message')}
            rows={5}
            className="field resize-y"
            placeholder="Tell us about your event, the items you need, colours, quantities…"
          />
          {errorFor('message')}
        </div>
        {/* Honeypot for bots, hidden from people and screen readers */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input {...field('website')} tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status.state === 'error' && (
        <p role="alert" className="mt-5 rounded-xl bg-wine-50 px-4 py-3 text-[0.95rem] text-wine-700">
          {status.message}
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">We will get back to you as soon as possible. For urgent orders, call or WhatsApp us.</p>
        <button type="submit" className="btn-primary" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {status.state === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>
    </form>
  );
}
