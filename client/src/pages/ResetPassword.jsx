import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BrainCircuit, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import usePageTitle from '../hooks/usePageTitle';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function PasswordField({ label, value, onChange, placeholder, autoComplete, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={clsx(
            'w-full bg-dark-surface border rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 transition-all',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20'
              : 'border-dark-border focus:border-primary-500/60 focus:ring-primary-500/20'
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Minimal password strength indicator
function StrengthBar({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];
  const textColors = ['', 'text-red-400', 'text-amber-400', 'text-yellow-400', 'text-emerald-400'];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={clsx(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? colors[score] : 'bg-dark-muted'
            )}
          />
        ))}
      </div>
      <p className={clsx('text-xs font-medium', textColors[score])}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function ResetPassword() {
  usePageTitle('Reset Password');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form,    setForm]    = useState({ password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.password)                 e.password = 'Password is required.';
    else if (form.password.length < 8)  e.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword)          e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const res  = await fetch(`${SERVER_URL}/api/auths/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password: form.password, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Invalid reset link</h2>
          <p className="text-sm text-slate-400">This link is missing a reset token. Please request a new one.</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
          >
            Request new link <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-hidden">

      {/* ══ LEFT BRAND PANEL ══ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-bg to-dark-bg" />
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary-600/10 blur-[130px] rounded-full pointer-events-none animate-float" />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/40 animate-pulse-glow">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Mentora <span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Almost there</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Create a new
              <br />
              <span className="gradient-text">password</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Choose a strong password you haven't used before. After resetting, you'll be able to sign in immediately.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { tip: 'At least 8 characters long' },
              { tip: 'Mix uppercase and lowercase letters' },
              { tip: 'Include numbers and special characters' },
            ].map(({ tip }) => (
              <div key={tip} className="flex items-center gap-3 glass rounded-xl px-5 py-3 border border-primary-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                <span className="text-sm text-slate-400">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600">© {new Date().getFullYear()} Mentora AI · All rights reserved</p>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-dark-border shrink-0">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Mentora <span className="gradient-text">AI</span></span>
          </Link>
          <span className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-6 animate-fade-in-up" style={{ animationDuration: '0.45s', animationFillMode: 'both' }}>

            {success ? (
              /* ── SUCCESS STATE ── */
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping-slow" />
                  <div className="relative w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-emerald-400" strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Password reset!</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Your password has been updated successfully. You can now sign in with your new password.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-600/30"
                >
                  Sign in now <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Set new password</h1>
                  <p className="text-sm text-slate-400">
                    Must be at least 8 characters.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-3">
                    <PasswordField
                      label="New password"
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      error={errors.password}
                    />
                    <StrengthBar password={form.password} />
                  </div>

                  <PasswordField
                    label="Confirm new password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                  />

                  {serverError && (
                    <div className="flex items-start gap-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/25 disabled:opacity-50 mt-2"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><span>Reset Password</span><ArrowRight size={16} /></>
                    }
                  </button>
                </form>

                <p className="text-center text-xs text-slate-600">
                  Remember it?{' '}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                    Back to sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
