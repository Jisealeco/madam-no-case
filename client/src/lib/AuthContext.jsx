import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.clear();
    setAdmin(null);
  }, []);

  // Restore the session from a stored token.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me', { auth: true })
      .then((res) => setAdmin(res.data.admin))
      .catch(() => tokenStore.clear())
      .finally(() => setChecking(false));
  }, []);

  // Any 401 from an authenticated request signs the admin out.
  useEffect(() => {
    window.addEventListener('mnc:unauthorized', logout);
    return () => window.removeEventListener('mnc:unauthorized', logout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await api('/auth/login', { method: 'POST', body: { email, password } });
    tokenStore.set(res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  }, []);

  const replaceToken = useCallback((token, nextAdmin) => {
    tokenStore.set(token);
    if (nextAdmin) setAdmin(nextAdmin);
  }, []);

  const value = useMemo(() => ({ admin, checking, login, logout, replaceToken }), [admin, checking, login, logout, replaceToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
