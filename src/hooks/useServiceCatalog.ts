import { useEffect, useState } from 'react';
import { loadServiceCatalog, type ServiceEntry } from '../data/serviceCatalog';

export function useServiceCatalog() {
  const [entries, setEntries] = useState<ServiceEntry[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    loadServiceCatalog().then(
      result => {
        if (active) setEntries(result);
      },
      () => {
        if (active) setError(true);
      }
    );
    return () => {
      active = false;
    };
  }, []);
  return { entries, error };
}
