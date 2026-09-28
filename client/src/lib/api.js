const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'mnc_admin_token';

export class ApiRequestError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  /** Field errors as { fieldName: message } for easy form display. */
  get fieldErrors() {
    return Object.fromEntries(this.errors.map((e) => [e.field, e.message]));
  }
}

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

/** Turns an image path from the API (e.g. /uploads/x.jpg) into a usable URL. */
export function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_BASE}${path}`;
}

/**
 * Calls the REST API and returns the parsed `{ success, data, meta, message }` body.
 * Throws ApiRequestError for non-2xx responses or network failures.
 */
export async function api(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {};
  let payload;

  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, { method, headers, body: payload, signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiRequestError('We could not reach the server. Please check your connection and try again.', 0);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    if (res.status === 401 && auth) window.dispatchEvent(new Event('mnc:unauthorized'));
    throw new ApiRequestError(json?.message || `Request failed (${res.status})`, res.status, json?.errors || []);
  }
  return json;
}
