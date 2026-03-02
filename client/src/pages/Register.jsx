import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Sparkles, Check, CheckCircle2, LayoutDashboard,
  Flame, BookOpen, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import TestimonialSlider from '../components/ui/TestimonialSlider';
import clsx from 'clsx';
import usePageTitle from '../hooks/usePageTitle';

/* ─── Google Icon ─── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─── Field ─── */
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

/* ─── Features list ─── */
const FEATURES = [
  'Step-by-step AI math explanations in Georgian',
  'Personalized weakness detection & targeted practice',
  'Full Georgian ENT exam simulations',
  'Real-time progress analytics & streak tracking',
];

/* ─── Success Screen ─── */
function SuccessScreen({ user }) {
  const navigate = useNavigate();
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : '?';

  return (
    <div className="text-center space-y-6 animate-fade-in-up">
      {/* Animated check */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping-slow" />
        <div className="relative w-20 h-20 rounded-full bg-primary-500/15 border border-primary-500/40 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-primary-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* User info */}
      <div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
          {initials}
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-1">Account Created!</h2>
        <p className="text-slate-400 text-sm">
          Welcome, <span className="text-white font-semibold">{user?.name}</span>!
          <br />Your free plan is ready to use.
        </p>
      </div>

      {/* What's waiting */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4 text-left space-y-2.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What's waiting for you</p>
        {[
          { icon: Flame,      color: 'text-amber-400',   text: 'Start your daily streak today' },
          { icon: BookOpen,   color: 'text-primary-400', text: '500+ practice problems unlocked' },
          { icon: TrendingUp, color: 'text-emerald-400', text: 'Personalized study plan ready' },
        ].map(({ icon: Icon, color, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-dark-surface flex items-center justify-center shrink-0">
              <Icon size={14} className={color} />
            </div>
            <span className="text-sm text-slate-300">{text}</span>
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
        Already had an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}

/* ─── Password strength indicator ─── */
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Strong'];
  if (!password) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={clsx('flex-1 h-1 rounded-full transition-colors duration-300', i < score ? colors[score - 1] : 'bg-dark-border')} />
        ))}
      </div>
      <p className={clsx('text-xs', score === 3 ? 'text-emerald-400' : score === 2 ? 'text-amber-400' : 'text-red-400')}>
        {labels[score - 1] || 'Too short'}
      </p>
    </div>
  );
}

/* ─── Main ─── */
export default function Register() {
  usePageTitle('Get Started');
  const { login, register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (isAuthenticated === true) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name    = 'Full name is required.';
    if (!form.email)             e.email   = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)          e.password = 'Password is required.';
    else if (form.password.length < 8)         e.password = 'Minimum 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    setErrors({});
    loginWithGoogle(); // redirects to Google — page navigates away
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const userObj = {
        fullname: form.name.trim(),
        email:    form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      const data = await register(userObj);
      const u = { ...data.data.user, name: data.data.user.fullname };
      login(u);
      setRegisteredUser(u);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-hidden">

      {/* ══ LEFT BRAND PANEL ══ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-dark-bg to-dark-bg" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/12 blur-[120px] rounded-full pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent-500/8 blur-[80px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/40 animate-pulse-glow">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Mentora <span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Free to Start</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Your AI tutor for
              <br />
              <span className="gradient-text">Georgian National Exams</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Join 12,400+ students already preparing smarter. Step-by-step solutions, personalized practice, and real exam simulations.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300">{f}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['GB', 'NK', 'DC', 'AS', 'TM'].map((init, i) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full border-2 border-dark-bg flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: `hsl(${260 + i * 25}, 70%, 55%)` }}
                >
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
              </div>
              <p className="text-xs text-slate-500">4.9 · Loved by students</p>
            </div>
          </div>
        </div>

        {/* Testimonial slider */}
        <div className="relative z-10">
          <TestimonialSlider />
        </div>
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

        {/* Scrollable form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-6 animate-fade-in-up" style={{ animationDuration: '0.5s', animationFillMode: 'both' }}>

            {registeredUser ? (
              <SuccessScreen user={registeredUser} />
            ) : (
              <>
                {/* Heading */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create your account</h1>
                  <p className="text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-dark-border bg-dark-card hover:bg-dark-surface hover:border-dark-muted text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60"
                >
                  {googleLoading
                    ? <span className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    : <GoogleIcon />
                  }
                  {googleLoading ? 'Connecting to Google…' : 'Sign up with Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-dark-border" />
                  <span className="text-xs text-slate-600 font-medium px-1">or sign up with email</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Field
                    label="Full Name"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your full name"
                    icon={User}
                    autoComplete="name"
                    error={errors.name}
                  />
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
                  <div className="space-y-2">
                    <Field
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min 8 characters"
                      icon={Lock}
                      autoComplete="new-password"
                      error={errors.password}
                    />
                    <PasswordStrength password={form.password} />
                  </div>
                  <Field
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Repeat your password"
                    icon={Lock}
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                  />

                  {errors.general && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {errors.general}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/25 disabled:opacity-50 mt-2"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><span>Create Free Account</span><Sparkles size={15} /></>
                    }
                  </button>

                  <p className="text-xs text-slate-600 text-center leading-relaxed">
                    By signing up you agree to our{' '}
                    <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">Privacy Policy</Link>.
                  </p>
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
