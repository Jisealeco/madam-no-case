import { fallbackServices } from './services.js';
import useApi from './useApi.js';

/** Active services from the API, falling back to the flyer's list if the API is unreachable. */
export default function useServices() {
  const { data, loading, error } = useApi('/services');
  const services = data?.length ? data : error ? fallbackServices : [];
  return { services, loading, error };
}
