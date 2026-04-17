import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, LogIn, CircleAlert as AlertCircle } from 'lucide-react';
import './OmniHub.css';

export const OmniHubLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <div className="oh-login-bg">
      <div className="oh-login-card">
        <div className="oh-login-icon">
          <LogIn size={24} color="#fff" />
        </div>
        <h1 className="oh-login-title">KuvantaOmniHub</h1>
        <p className="oh-login-sub">Vendor Control Center</p>

        {error && (
          <div className="oh-login-error">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="oh-login-field">
            <label className="oh-login-label">Email</label>
            <div className="oh-login-input-wrap">
              <Mail size={14} className="oh-login-input-icon" />
              <input
                className="oh-login-input"
                type="email"
                placeholder="vendor@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="oh-login-field">
            <label className="oh-login-label">Password</label>
            <div className="oh-login-input-wrap">
              <Lock size={14} className="oh-login-input-icon" />
              <input
                className="oh-login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="oh-login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="oh-login-footer">Need access? <span style={{ color: '#3B82F6', cursor: 'pointer' }}>Contact Admin</span></p>
      </div>
    </div>
  );
};
