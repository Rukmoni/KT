import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import type { MentorConfigData } from '../types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULTS: MentorConfigData = {
  model_primary: 'gemini-2.5-flash',
  model_lite: 'gemini-2.0-flash',
  model_pro: 'gemini-2.5-pro',
  api_key_override: null,
  max_history_messages: 20,
};

export function useMentorConfig() {
  const [config, setConfig] = useState<MentorConfigData>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('mentor_config').select('*').eq('id', 1).maybeSingle();
    if (data) {
      setConfig({
        model_primary: data.model_primary ?? DEFAULTS.model_primary,
        model_lite: data.model_lite ?? DEFAULTS.model_lite,
        model_pro: data.model_pro ?? DEFAULTS.model_pro,
        api_key_override: data.api_key_override ?? null,
        max_history_messages: data.max_history_messages ?? DEFAULTS.max_history_messages,
      });
    }
    setLoading(false);
  }, []);

  const saveConfig = useCallback(async (updates: Partial<MentorConfigData>): Promise<boolean> => {
    setSaving(true);
    const { error } = await supabase
      .from('mentor_config')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    if (!error) setConfig((prev) => ({ ...prev, ...updates }));
    return !error;
  }, []);

  return { config, loading, saving, loadConfig, saveConfig };
}
