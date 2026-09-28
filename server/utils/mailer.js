import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter = null;

const isConfigured = () => Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.notifyEmail);

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/**
 * Emails the business owner about a new inquiry. Only runs when SMTP settings
 * and NOTIFY_EMAIL are present; otherwise inquiries are simply stored in the
 * database and visible in the admin dashboard.
 */
export async function notifyNewInquiry(inquiry) {
  if (!isConfigured()) return false;

  const rows = [
    ['Name', inquiry.name],
    ['Phone', inquiry.phone],
    ['Email', inquiry.email || '—'],
    ['Service needed', inquiry.serviceNeeded || '—'],
    ['Event date', inquiry.eventDate ? inquiry.eventDate.toDateString() : '—'],
  ];

  await getTransporter().sendMail({
    from: env.smtp.from || env.smtp.user,
    to: env.notifyEmail,
    replyTo: inquiry.email || undefined,
    subject: `New inquiry from ${inquiry.name}${inquiry.serviceNeeded ? ` — ${inquiry.serviceNeeded}` : ''}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${inquiry.message}`,
    html: `<h2>New website inquiry</h2><table>${rows
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table><p>${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}</p>`,
  });
  return true;
}
