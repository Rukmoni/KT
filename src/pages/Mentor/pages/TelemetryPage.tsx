import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import { useMentorContext } from '../MentorContext';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface UsageRow {
  id: number;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_creation_tokens: number;
  cache_hit: boolean;
  event_type: string;
  subject_code: string | null;
  cost_usd_estimate: number;
  created_at: string;
}

export function TelemetryPage() {
  const navigate = useNavigate();
  const { appUserId: sessionToken, openSidebar } = useMentorContext();
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mentor_token_usage')
        .select('*')
        .eq('session_token', sessionToken)
        .order('created_at', { ascending: false })
        .limit(50);
      setRows(data ?? []);
      setLoading(false);
    }
    load();
  }, [sessionToken]);

  const totalCost = rows.reduce((s, r) => s + (r.cost_usd_estimate ?? 0), 0);
  const totalInput = rows.reduce((s, r) => s + r.input_tokens, 0);
  const totalOutput = rows.reduce((s, r) => s + r.output_tokens, 0);
  const totalCacheRead = rows.reduce((s, r) => s + r.cache_read_tokens, 0);
  const cacheHitRate = rows.length > 0 ? Math.round((rows.filter((r) => r.cache_hit).length / rows.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-mentor-cream">
      <header className="bg-mentor-navy px-4 py-3 flex items-center gap-3">
        <button
          onClick={openSidebar}
          className="md:hidden text-mentor-tan-light hover:text-mentor-cream transition-colors text-xl leading-none"
          aria-label="Open history"
        >
          ☰
        </button>
        <button onClick={() => navigate('/mentor')} className="hidden md:block text-mentor-tan-light hover:text-mentor-cream transition-colors text-lg">
          ←
        </button>
        <h1 className="text-mentor-cream font-semibold text-base">Token Telemetry</h1>
        <span className="text-mentor-tan-light text-xs ml-auto">Shadow mode — no billing</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Cost (est.)', value: `$${totalCost.toFixed(4)}`, sub: 'USD shadow' },
            { label: 'Input Tokens', value: totalInput.toLocaleString(), sub: 'all requests' },
            { label: 'Output Tokens', value: totalOutput.toLocaleString(), sub: 'generated' },
            { label: 'Cache Hit Rate', value: `${cacheHitRate}%`, sub: `${totalCacheRead.toLocaleString()} saved` },
          ].map((stat) => (
            <div key={stat.label} className="bg-mentor-surface border border-mentor-border rounded-xl p-4">
              <div className="text-xs text-mentor-muted mb-1">{stat.label}</div>
              <div className="text-lg font-bold text-mentor-navy font-mono">{stat.value}</div>
              <div className="text-xs text-mentor-muted mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent calls */}
        <h2 className="text-sm font-semibold text-mentor-muted uppercase tracking-wider mb-3">
          Recent API Calls
        </h2>

        {loading ? (
          <p className="text-sm text-mentor-muted text-center py-8">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-mentor-muted text-center py-8">No API calls yet. Start a session to see token usage here.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="bg-mentor-surface border border-mentor-border rounded-xl px-4 py-3 flex items-center gap-4 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-mentor-navy font-medium">{row.model.split('-').pop()}</span>
                    <span className="px-1.5 py-0.5 rounded bg-mentor-cream-dark text-mentor-muted">{row.event_type}</span>
                    {row.subject_code && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{row.subject_code}</span>
                    )}
                    {row.cache_hit && (
                      <span className="px-1.5 py-0.5 rounded bg-mentor-sage-pale text-mentor-sage font-medium">⚡ cached</span>
                    )}
                  </div>
                  <div className="text-mentor-muted font-mono">
                    in: {row.input_tokens} · out: {row.output_tokens}
                    {row.cache_read_tokens > 0 && ` · read: ${row.cache_read_tokens}`}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-mentor-amber font-medium">${row.cost_usd_estimate?.toFixed(5) ?? '—'}</div>
                  <div className="text-mentor-muted mt-0.5">
                    {new Date(row.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
