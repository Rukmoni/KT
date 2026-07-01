import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { ActivityEvent } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function useActivityLog(sessionToken: string) {
  const logEvent = useCallback(
    async (event: ActivityEvent) => {
      await supabase.from('mentor_activity').insert({
        session_token: sessionToken,
        event_type: event.event_type,
        subject_code: event.subject_code,
        topic: event.topic ?? null,
        score: event.score ?? null,
        metadata: event.metadata ?? null,
      });
    },
    [sessionToken]
  );

  return { logEvent };
}
