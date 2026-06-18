import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'pj_signing_key_session';

/**
 * Keeps the Ed25519 private key in sessionStorage only (cleared when the tab closes).
 * Never persist signing material in localStorage.
 */
export function useSessionPrivateKey() {
  const read = () => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  };

  const [privateKey, setPrivateKeyState] = useState(read);

  useEffect(() => {
    try {
      if (privateKey.trim()) {
        sessionStorage.setItem(SESSION_KEY, privateKey);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      /* private mode / quota */
    }
  }, [privateKey]);

  const setPrivateKey = useCallback((value) => {
    const next = typeof value === 'function' ? value(read()) : value;
    setPrivateKeyState(next);
  }, []);

  const clearPrivateKey = useCallback(() => {
    setPrivateKeyState('');
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { privateKey, setPrivateKey, clearPrivateKey };
}
