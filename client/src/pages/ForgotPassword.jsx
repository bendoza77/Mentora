import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Mail, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import clsx from 'clsx';
import usePageTitle from '../hooks/usePageTitle';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ForgotPassword() {
  usePageTitle('Forgot Password');

  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const validate = () => {
    if (!email.trim())           return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');

    try {
      const res  = await fetch(`${SERVER_URL}/api/auths/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-hidden">

      {/* ══ LEFT BRAND PANEL ══ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-bg to-dark-bg" />
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary-600/10 blur-[130px] rounded-full pointer-events-none animate-float" />
        <div className="absolute bottom-10 right-0 w-[260px] h-[260px] bg-accent-500/8 blur-[80px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/40 animate-pulse-glow">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Mentora <span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Centre copy */}
        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
            <KeyRound size={28} className="text-primary-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Account Recovery</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Forgot your
              <br />
              <span className="gradient-text">password?</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              No worries — it happens. Enter your email and we'll send you a secure link to reset it within seconds.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Secure 256-bit encrypted link',    value: '🔒' },
              { label: 'Link expires in 10 minutes',       value: '⏱' },
              { label: 'No password stored in plain text', value: '🛡' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4 glass rounded-xl px-5 py-3 border border-primary-500/10">
                <span className="text-xl shrink-0">{value}</span>
                <span className="text-sm text-slate-400">{label}</span>
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

            {sent ? (
              /* ── SUCCESS STATE ── */
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping-slow" />
                  <div className="relative w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-emerald-400" strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Check your inbox</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    If <span className="text-white font-medium">{email}</span> is registered,
                    you'll receive a reset link shortly. Check your spam folder too.
                  </p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-2xl p-4 text-left space-y-2">
                  {[
                    'Open the email from Mentora AI',
                    'Click "Reset My Password"',
                    'Choose a strong new password',
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary-400">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full py-3 rounded-xl border border-dark-border text-sm font-semibold text-slate-300 hover:text-white hover:border-primary-500/40 transition-all"
                >
                  Try a different email
                </button>

                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Forgot password?</h1>
                  <p className="text-sm text-slate-400">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={clsx(
                          'w-full bg-dark-surface border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 transition-all',
                          'focus:outline-none focus:ring-1',
                          error
                            ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20'
                            : 'border-dark-border focus:border-primary-500/60 focus:ring-primary-500/20'
                        )}
                      />
                    </div>
                    {error && <p className="text-xs text-red-400">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/25 disabled:opacity-50 mt-2"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><span>Send Reset Link</span><ArrowRight size={16} /></>
                    }
                  </button>
                </form>

                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
