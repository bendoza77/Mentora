import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Mail, Lock, Eye, EyeOff,
  ArrowRight, Flame, TrendingUp, BookOpen, CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import TestimonialSlider from '../components/ui/TestimonialSlider';
import clsx from 'clsx';
import useSEO from '../hooks/useSEO';

/* ─────────────────────────── helpers ─────────────────────────── */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Field = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, autoComplete, error }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />}
        <input
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={clsx(
            'w-full bg-dark-surface border rounded-xl py-3 text-sm text-white placeholder-slate-600 transition-all',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20'
              : 'border-dark-border focus:border-primary-500/60 focus:ring-primary-500/20',
            Icon ? 'pl-10 pr-4' : 'px-4',
            isPass && 'pr-11'
          )}
        />
        {isPass && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

const STATS = [
  { icon: Flame,     value: '12', label: 'Day Streak', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: BookOpen,  value: '284', label: 'Problems Solved', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { icon: TrendingUp,value: '78%', label: 'Accuracy', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

/* ─────────────────────── Success screen ─────────────────────── */
function SuccessScreen({ user }) {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-6 animate-fade-in-up">
      {/* Animated check */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping-slow" />
        <div className="relative w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-400" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back!</h2>
        <p className="text-slate-400 text-sm">
          Signed in as <span className="text-white font-medium">{user?.fullname ?? user?.name}</span>
        </p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', bg)}>
              <Icon size={16} className={color} />
            </div>
            <p className={clsx('text-base font-extrabold', color)}>{value}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-600/30"
      >
        <LayoutDashboard size={18} />
        Go to Dashboard
        <ArrowRight size={18} />
      </button>

      <p className="text-xs text-slate-600">
        Not you?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
          Switch account
        </Link>
      </p>
    </div>
  );
}

/* ─────────────────────────── main ────────────────────────────── */
export default function Login() {
  useSEO({ title: 'Sign In', path: '/login', noindex: true });
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (isAuthenticated === true) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loggedInUser, setLoggedInUser]   = useState(null);   // ← success state
  const [serverError, setServerError]     = useState('');

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    setServerError('');
    loginWithGoogle(); // redirects to Google — page navigates away
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setServerError('');
    try {
      const userObj = { email: form.email, password: form.password };
      const data = await login(userObj);
      setLoggedInUser(data.data.user);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-hidden page-enter">

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
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-xs font-semibold text-primary-400 uppercase mt-5 tracking-widest mb-4">Welcome Back</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Continue where
              <br />
              <span className="gradient-text">you left off</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your streak, progress, and personalized problem sets are all waiting for you. Sign in and keep going.
            </p>
          </div>

          {/* Live stats cards */}
          <div className="space-y-3">
            {[
              { label: 'Problems solved today by Mentora students', value: '3,842', color: 'text-primary-400' },
              { label: 'Average accuracy improvement this week',     value: '+12%',  color: 'text-emerald-400' },
              { label: 'Students currently online',                  value: '284',   color: 'text-accent-400' },
            ].map(({ label, value, color }, i) => (
              <div key={label} className="flex items-center gap-4 glass rounded-xl px-5 py-3.5 border border-primary-500/10 animate-fade-in-up" style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: 'both' }}>
                <span className={clsx('text-2xl font-extrabold shrink-0', color)}>{value}</span>
                <span className="text-sm text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial slider */}
        <div className="mt-10 relative z-10">
          <TestimonialSlider />
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-dark-border shrink-0">
          <Link to="/" className="lg:hidden flex items-center gap-2 group">
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

        {/* Scrollable form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-6 animate-fade-in-up" style={{ animationDuration: '0.5s', animationFillMode: 'both' }}>

            {loggedInUser ? (
              <SuccessScreen user={loggedInUser} />
            ) : (
              <>
                {/* Heading */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sign in</h1>
                  <p className="text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                      Create one free
                    </Link>
                  </p>
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-dark-border bg-dark-card hover:bg-dark-surface hover:border-dark-muted text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 group"
                >
                  {googleLoading
                    ? <span className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    : <GoogleIcon />
                  }
                  {googleLoading ? 'Connecting to Google…' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-dark-border" />
                  <span className="text-xs text-slate-600 font-medium px-1">or sign in with email</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Field
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    icon={Mail}
                    autoComplete="email"
                    error={errors.email}
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Field
                      type="password"
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Your password"
                      icon={Lock}
                      autoComplete="current-password"
                      error={errors.password}
                    />
                  </div>

                  {serverError && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/25 disabled:opacity-50 mt-2"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><span>Sign In</span><ArrowRight size={16} /></>
                    }
                  </button>
                </form>

                {/* Back */}
                <p className="text-center text-xs text-slate-600">
                  <Link to="/" className="hover:text-slate-400 transition-colors">← Back to homepage</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
