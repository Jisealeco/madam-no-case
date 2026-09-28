import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

/** Fetches a GET endpoint on mount (and when `path` changes). */
export default function useApi(path, { auth = false, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, meta: null, error: null, loading: enabled });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    api(path, { auth, signal: controller.signal })
      .then((res) => setState({ data: res.data, meta: res.meta || null, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, meta: null, error, loading: false });
      });

    return () => controller.abort();
  }, [path, auth, enabled, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
