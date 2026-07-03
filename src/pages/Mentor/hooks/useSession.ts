import { useState } from 'react';
import { IDENTITY_KEY, SESSION_TOKEN_KEY } from '../constants';

function getOrCreateIdentity(): string {
  // Migrate from old session key so existing conversations are preserved
  const existing = localStorage.getItem(IDENTITY_KEY) ?? localStorage.getItem(SESSION_TOKEN_KEY);
  if (existing) {
    localStorage.setItem(IDENTITY_KEY, existing);
    return existing;
  }
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  localStorage.setItem(IDENTITY_KEY, id);
  return id;
}

export function useSession() {
  const [sessionToken] = useState<string>(getOrCreateIdentity);
  return { sessionToken };
}
