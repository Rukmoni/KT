import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react';
import './Note2TaskLogin.css';

interface Note2TaskLoginProps {
  onAuthenticated: () => void;
}

export const Note2TaskLogin = ({ onAuthenticated }: Note2TaskLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    } else {
      onAuthenticated();
    }
  };

  return (
    <div className="n2t-login">
      <div className="n2t-login__bg" />
      <div className="n2t-login__card">
        <div className="n2t-login__header">
          <img src="/kuavanta-logo.png" alt="KUVANTA" className="n2t-login__logo" />
          <p className="n2t-login__subtitle">Note2Task Access</p>
        </div>

        <form className="n2t-login__form" onSubmit={handleSubmit}>
          <div className="n2t-login__field">
            <label className="n2t-login__label">Email</label>
            <div className="n2t-login__input-wrap">
              <Mail size={16} className="n2t-login__input-icon" />
              <input
                type="email"
                className="n2t-login__input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="n2t-login__field">
            <label className="n2t-login__label">Password</label>
            <div className="n2t-login__input-wrap">
              <Lock size={16} className="n2t-login__input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="n2t-login__input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="n2t-login__toggle-pw"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="n2t-login__error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="n2t-login__submit"
            disabled={loading}
          >
            {loading ? (
              <span className="n2t-login__spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="n2t-login__footer-note">
          Access restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
};
