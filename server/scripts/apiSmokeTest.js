/**
 * End-to-end check of every REST endpoint against a running server.
 * It creates temporary records and deletes them again at the end.
 *
 *   npm run test:api -- --email owner@example.com --password "admin-password" [--url http://localhost:5000]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { SEED_IMAGES_DIR } from '../config/paths.js';

const { values } = parseArgs({
  options: {
    url: { type: 'string', default: process.env.API_URL || 'http://localhost:5000' },
    email: { type: 'string', default: process.env.ADMIN_EMAIL || '' },
    password: { type: 'string', default: process.env.ADMIN_PASSWORD || '' },
  },
});

const BASE = `${values.url.replace(/\/$/, '')}/api`;
let token = '';
let passed = 0;
let failed = 0;

async function call(method, route, { body, form, auth = false, headers = {} } = {}) {
  const init = { method, headers: { ...headers } };
  if (auth) init.headers.Authorization = `Bearer ${token}`;
  if (form) init.body = form;
  else if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${route}`, init);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

function check(label, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ✔ ${label}`);
  } else {
    failed += 1;
    console.log(`  ✘ ${label}${detail ? `\n      ${JSON.stringify(detail)}` : ''}`);
  }
}

async function imageForm(fields, filename = 'watch-chronograph-blue.jpeg') {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  const buffer = await fs.readFile(path.join(SEED_IMAGES_DIR, filename));
  form.append('image', new Blob([buffer], { type: 'image/jpeg' }), filename);
  return form;
}

console.log(`\nTesting ${BASE}\n`);

// ── Health & errors
console.log('Health & error handling');
let r = await call('GET', '/health');
check('GET /health → 200, database connected', r.status === 200 && r.json?.data?.database === 'connected', r.json);
r = await call('GET', '/does-not-exist');
check('Unknown route → 404 JSON', r.status === 404 && r.json?.success === false, r.json);
r = await call('POST', '/contact', { body: '{bad json' });
check('Malformed JSON → 400', r.status === 400, r.json);

// ── Auth
console.log('Authentication');
r = await call('POST', '/services', { body: { title: 'Nope' } });
check('POST /services without token → 401', r.status === 401, r.json);
r = await call('POST', '/services', { body: { title: 'Nope' }, headers: { Authorization: 'Bearer not-a-real-token' } });
check('POST /services with forged token → 401', r.status === 401, r.json);
r = await call('POST', '/auth/login', { body: { email: values.email, password: `${values.password}-wrong` } });
check('Login with wrong password → 401', r.status === 401, r.json);
r = await call('POST', '/auth/login', { body: { email: 'not-an-email', password: '' } });
check('Login with invalid input → 422 with field errors', r.status === 422 && r.json?.errors?.length >= 1, r.json);
r = await call('POST', '/auth/login', { body: { email: values.email, password: values.password } });
check('Login with correct credentials → 200 + token', r.status === 200 && Boolean(r.json?.data?.token), r.json);
token = r.json?.data?.token || '';
check('Login response never includes the password hash', r.json && !JSON.stringify(r.json).includes('"password"'));
r = await call('GET', '/auth/me', { auth: true });
check('GET /auth/me → current admin', r.status === 200 && r.json?.data?.admin?.email === values.email, r.json);

if (!token) {
  console.log('\nCannot continue without a valid admin login. Pass --email and --password.');
  process.exit(1);
}

// ── Contact
console.log('Contact / inquiries');
r = await call('POST', '/contact', { body: { name: 'A', phone: 'abc', message: '' } });
check('POST /contact invalid → 422', r.status === 422 && r.json.errors.some((e) => e.field === 'phone'), r.json);
r = await call('POST', '/contact', {
  body: {
    name: 'Smoke Test',
    phone: '+238032252023',
    email: 'smoke.test@example.com',
    serviceNeeded: 'Decorations',
    eventDate: '2026-12-12',
    message: 'Automated test inquiry, safe to delete.',
  },
});
check('POST /contact valid → 201', r.status === 201 && Boolean(r.json?.data?.id), r.json);
const inquiryId = r.json?.data?.id;
r = await call('GET', '/contact');
check('GET /contact without token → 401', r.status === 401);
r = await call('GET', '/contact', { auth: true });
check(
  'GET /contact as admin lists the inquiry with createdAt',
  r.status === 200 && r.json.data.some((i) => i._id === inquiryId && i.createdAt),
  r.json?.meta
);
r = await call('PATCH', `/contact/${inquiryId}`, { auth: true, body: { status: 'replied' } });
check('PATCH /contact/:id status → replied', r.status === 200 && r.json?.data?.status === 'replied', r.json);
r = await call('PATCH', `/contact/${inquiryId}`, { auth: true, body: { status: 'bogus' } });
check('PATCH /contact/:id invalid status → 422', r.status === 422, r.json);

// ── Services
console.log('Services');
r = await call('GET', '/services');
check('GET /services → 200 array', r.status === 200 && Array.isArray(r.json?.data), r.json);
r = await call('POST', '/services', { auth: true, body: { summary: 'no title' } });
check('POST /services without title → 422', r.status === 422, r.json);
r = await call('POST', '/services', {
  auth: true,
  body: { title: 'Smoke Test Service', summary: 'Temporary', items: ['One', 'Two'], order: 99 },
});
check('POST /services → 201 with slug', r.status === 201 && r.json?.data?.slug === 'smoke-test-service', r.json);
const serviceId = r.json?.data?._id;
r = await call('POST', '/services', { auth: true, body: { title: 'Smoke Test Service' } });
check('POST /services duplicate → 409', r.status === 409, r.json);
r = await call('PUT', `/services/${serviceId}`, { auth: true, form: await imageForm({ summary: 'Updated', items: 'A, B, C', isActive: 'false' }) });
check(
  'PUT /services/:id multipart with image',
  r.status === 200 && r.json?.data?.summary === 'Updated' && r.json?.data?.items?.length === 3 && r.json?.data?.image?.startsWith('/uploads/'),
  r.json
);
r = await call('GET', '/services');
check('Inactive service hidden from public list', r.status === 200 && !r.json.data.some((s) => s._id === serviceId));
r = await call('GET', '/services?all=true', { auth: true });
check('Inactive service visible to admin with ?all=true', r.json?.data?.some((s) => s._id === serviceId));
r = await call('PUT', '/services/not-an-id', { auth: true, body: { title: 'x' } });
check('PUT /services/bad-id → 422', r.status === 422, r.json);
r = await call('DELETE', `/services/${serviceId}`, { auth: true });
check('DELETE /services/:id → 200', r.status === 200, r.json);
r = await call('DELETE', `/services/${serviceId}`, { auth: true });
check('DELETE /services/:id again → 404', r.status === 404, r.json);

// ── Products
console.log('Products');
r = await call('POST', '/products', { auth: true, body: { name: 'X', category: 'Spaceships' } });
check('POST /products invalid → 422', r.status === 422, r.json);
r = await call('POST', '/products', {
  auth: true,
  form: await imageForm({ name: 'Smoke Test Watch', description: 'Temporary', category: 'Wrist Watches', price: '45000', availability: 'available', featured: 'true' }),
});
check(
  'POST /products multipart → 201 with image & price',
  r.status === 201 && r.json?.data?.price === 45000 && r.json?.data?.featured === true && r.json?.data?.image?.startsWith('/uploads/'),
  r.json
);
const productId = r.json?.data?._id;
const productImage = r.json?.data?.image;
const img = await fetch(`${values.url}${productImage}`);
check('Uploaded image is served from /uploads', img.status === 200 && img.headers.get('content-type')?.includes('image'));
r = await call('PUT', `/products/${productId}`, { auth: true, body: { price: '', availability: 'made_to_order' } });
check('PUT /products/:id clears price', r.status === 200 && r.json?.data?.price === null && r.json?.data?.availability === 'made_to_order', r.json);
r = await call('GET', '/products?category=Wrist%20Watches&search=smoke');
check('GET /products filter + search', r.status === 200 && r.json.data.some((p) => p._id === productId), r.json?.meta);
r = await call('GET', '/products?search=%7B%22%24gt%22%3A%22%22%7D');
check('GET /products search is treated as text, not an operator', r.status === 200 && r.json.data.length === 0, r.json?.meta);
r = await call('GET', `/products/${productId}`);
check('GET /products/:id → 200', r.status === 200 && r.json?.data?._id === productId);
r = await call('DELETE', `/products/${productId}`, { auth: true });
check('DELETE /products/:id → 200', r.status === 200, r.json);
const imgAfter = await fetch(`${values.url}${productImage}`);
check('Deleting product removes its uploaded image', imgAfter.status === 404);

// ── Gallery
console.log('Gallery');
r = await call('GET', '/gallery');
check('GET /gallery → 200 array', r.status === 200 && Array.isArray(r.json?.data), r.json);
r = await call('POST', '/gallery', { auth: true, body: { title: 'No image' } });
check('POST /gallery without image → 422', r.status === 422, r.json);
const badFile = new FormData();
badFile.append('title', 'Bad file');
badFile.append('image', new Blob(['not an image'], { type: 'text/plain' }), 'x.txt');
r = await call('POST', '/gallery', { auth: true, form: badFile });
check('POST /gallery with non-image file → 400', r.status === 400, r.json);
r = await call('POST', '/gallery', { auth: true, form: await imageForm({ title: 'Smoke Test Photo', category: 'Watches' }) });
check('POST /gallery multipart → 201', r.status === 201 && r.json?.data?.image?.startsWith('/uploads/'), r.json);
const galleryId = r.json?.data?._id;
r = await call('PUT', `/gallery/${galleryId}`, { auth: true, body: { caption: 'Edited caption' } });
check('PUT /gallery/:id → 200', r.status === 200 && r.json?.data?.caption === 'Edited caption', r.json);
r = await call('DELETE', `/gallery/${galleryId}`, { auth: true });
check('DELETE /gallery/:id → 200', r.status === 200, r.json);

// ── Cleanup
r = await call('DELETE', `/contact/${inquiryId}`, { auth: true });
check('DELETE /contact/:id (cleanup) → 200', r.status === 200, r.json);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
