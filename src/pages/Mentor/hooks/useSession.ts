import { useState, useCallback } from 'react';
import { SESSION_TOKEN_KEY } from '../constants';

function generateToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function useSession() {
  const [sessionToken] = useState<string>(() => {
    const stored = localStorage.getItem(SESSION_TOKEN_KEY);
    if (stored) return stored;
    const token = generateToken();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    return token;
  });

  const resetSession = useCallback(() => {
    const token = generateToken();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    window.location.reload();
  }, []);

  return { sessionToken, resetSession };
}
