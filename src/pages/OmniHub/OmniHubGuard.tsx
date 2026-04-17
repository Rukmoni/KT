import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { OmniHubLogin } from './OmniHubLogin';
import { OmniHubApp } from './OmniHubApp';
import './OmniHub.css';

export const OmniHubGuard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050B1C 0%, #0A1228 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(59,130,246,0.15)',
          borderTop: '3px solid #3B82F6',
          borderRadius: '50%',
          animation: 'oh-spin 0.7s linear infinite',
        }} />
      </div>
    );
  }

  if (!session) return <OmniHubLogin />;
  return <OmniHubApp user={session.user} />;
};
