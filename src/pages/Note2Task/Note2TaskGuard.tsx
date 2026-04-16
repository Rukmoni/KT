import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Note2TaskLogin } from './Note2TaskLogin';
import { Note2TaskPage } from './Note2TaskPage';
import type { Session } from '@supabase/supabase-js';

export const Note2TaskGuard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'n2t-spin 0.7s linear infinite' }} />
      </div>
    );
  }

  if (!session) {
    return <Note2TaskLogin onAuthenticated={() => {}} />;
  }

  return <Note2TaskPage />;
};
