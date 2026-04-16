import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, Trash2, RefreshCw, Eye, EyeOff, Copy, Check, ShieldCheck } from 'lucide-react';

interface DemoUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export const AdminNote2Task = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showMsg = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => { setError(''); setSuccess(''); }, 5000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.functions.invoke('admin-demo-users', {
      body: { action: 'list' },
    });
    setLoading(false);
    if (err || data?.error) {
      showMsg(err?.message || data?.error || 'Failed to load users', true);
    } else {
      setUsers(data.users || []);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;
    setCreating(true);
    const { data, error: err } = await supabase.functions.invoke('admin-demo-users', {
      body: { action: 'create', email: newEmail, password: newPassword },
    });
    setCreating(false);
    if (err || data?.error) {
      showMsg(err?.message || data?.error || 'Failed to create user', true);
    } else {
      showMsg(`Account created for ${newEmail}`);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Delete account for ${email}? This cannot be undone.`)) return;
    setDeleting(userId);
    const { data, error: err } = await supabase.functions.invoke('admin-demo-users', {
      body: { action: 'delete', userId },
    });
    setDeleting(null);
    if (err || data?.error) {
      showMsg(err?.message || data?.error || 'Failed to delete user', true);
    } else {
      showMsg(`Account deleted`);
      fetchUsers();
    }
  };

  const copyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: '60px 40px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{ padding: '7px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', background: 'transparent', color: '#64748b', border: '1px solid #1e293b', cursor: 'pointer' }}
          >
            Sales &amp; Leads
          </button>
          <span style={{ padding: '7px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', cursor: 'default' }}>
            Note2Task Credentials
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <ShieldCheck size={28} color="#3b82f6" />
          <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>Note2Task Demo Credentials</h1>
        </div>
        <p style={{ color: '#888', marginBottom: '40px' }}>
          Create and manage Supabase Auth accounts that grant access to the Note2Task demo.
        </p>

        {(error || success) && (
          <div style={{
            padding: '14px 18px', borderRadius: '10px', marginBottom: '28px',
            background: error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            color: error ? '#f87171' : '#4ade80', fontSize: '14px'
          }}>
            {error || success}
          </div>
        )}

        <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '28px', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e2e8f0' }}>Create New Account</h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="demo@client.com"
                  required
                  style={{
                    width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #2a2a2a',
                    borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    style={{
                      width: '100%', padding: '10px 40px 10px 14px', background: '#111', border: '1px solid #2a2a2a',
                      borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={creating}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#2563eb', color: '#fff', border: 'none',
                  padding: '10px 22px', borderRadius: '8px', fontWeight: '600',
                  fontSize: '14px', cursor: creating ? 'wait' : 'pointer',
                  opacity: creating ? 0.7 : 1, transition: 'opacity 0.2s'
                }}
              >
                <UserPlus size={16} />
                {creating ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#e2e8f0' }}>
              Existing Accounts {!loading && <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '400' }}>({users.length})</span>}
            </h2>
            <button
              onClick={fetchUsers}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              <RefreshCw size={13} style={{ animation: loading ? 'n2t-spin 0.7s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#111', borderRadius: '12px', color: '#555' }}>
              No demo accounts created yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {users.map(user => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#e2e8f0' }}>{user.email}</span>
                      <button
                        onClick={() => copyEmail(user.email, user.id)}
                        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '2px', display: 'flex' }}
                        title="Copy email"
                      >
                        {copiedId === user.id ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      Created {new Date(user.created_at).toLocaleDateString()} &nbsp;·&nbsp;
                      {user.last_sign_in_at ? `Last sign-in ${new Date(user.last_sign_in_at).toLocaleDateString()}` : 'Never signed in'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    disabled={deleting === user.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    <Trash2 size={13} />
                    {deleting === user.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes n2t-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
