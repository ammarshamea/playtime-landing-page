import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [stored, setStored] = useState(read);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setStored(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const setValue = useCallback(
    (value) => {
      const next = typeof value === 'function' ? value(read()) : value;
      setStored(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* quota exceeded */
      }
    },
    [key]
  );

  return [stored, setValue];
}
