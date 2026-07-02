import { useState, useCallback } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import type { MentorConfigData } from '../types';

const CONFIG_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/mentor-config`;

const DEFAULTS: MentorConfigData = {
  model_primary: 'gemini-2.5-flash',
  model_lite: 'gemini-2.0-flash',
  model_pro: 'gemini-2.5-pro',
  api_key_override: null,
  max_history_messages: 20,
};

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Apikey: SUPABASE_ANON_KEY,
  };
}

export function useMentorConfig() {
  const [config, setConfig] = useState<MentorConfigData>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG_FUNCTION_URL, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig({
          model_primary: data.model_primary ?? DEFAULTS.model_primary,
          model_lite: data.model_lite ?? DEFAULTS.model_lite,
          model_pro: data.model_pro ?? DEFAULTS.model_pro,
          api_key_override: data.api_key_override ?? null,
          max_history_messages: data.max_history_messages ?? DEFAULTS.max_history_messages,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async (updates: Partial<MentorConfigData>): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await fetch(CONFIG_FUNCTION_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      const ok = res.ok;
      if (ok) setConfig((prev) => ({ ...prev, ...updates }));
      return ok;
    } finally {
      setSaving(false);
    }
  }, []);

  return { config, loading, saving, loadConfig, saveConfig };
}
