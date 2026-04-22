import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import StaticLayout from '../components/layout/StaticLayout';
import useInView from '../hooks/useInView';
import useSEO from '../hooks/useSEO';
import {
  Check, X, Zap, Crown, Star, Shield, Users,
  Flame, ArrowRight, Sparkles, ChevronDown, BarChart3,
} from 'lucide-react';

// ── Shared plan data ──────────────────────────────────────────────────────────
const PLANS = [
  {
    key: 'free',
    icon: Star,
    name: 'Free',
    tagline: 'Explore with no commitment',
    monthlyPrice: 0,
    annualPrice: 0,
    accentLine: null,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-500/10',
    border: 'border-dark-border',
    headerBg: '',
    ringClass: '',
    checkColor: 'text-emerald-400',
    checkBg: 'bg-emerald-500/10',
    features: [
      '5 AI Tutor questions / day',
      '200 practice problems',
      '1 mock exam / month',
      'Basic analytics dashboard',
      'Streak & daily progress tracking',
      'Georgian & English UI',
      'Email & Google sign-in',
    ],
    locked: [
      'Unlimited AI Tutor access',
      'Full analytics & weakness heatmap',
      'Unlimited mock exams',
    ],
    ctaLabel: 'Start Free — No Card Needed',
    ctaTo: '/register',
  },
  {
    key: 'pro',
    icon: Zap,
    name: 'Pro',
    tagline: 'Everything a serious student needs',
    monthlyPrice: 19,
    annualPrice: 13,
    yearlyTotal: 156,
    savingsPct: '32%',
    dailyCost: '0.43',
    accentLine: 'from-primary-600 via-primary-500 to-accent-500',
    iconColor: 'text-primary-400',
    iconBg: 'bg-primary-600/20',
    border: 'border-primary-500/40',
    headerBg: 'bg-gradient-to-b from-primary-600/10 to-transparent',
    ringClass: 'ring-1 ring-primary-500/25 shadow-2xl shadow-primary-600/15',
    checkColor: 'text-primary-400',
    checkBg: 'bg-primary-500/15',
    popular: true,
    features: [
      'Unlimited AI Tutor questions',
      'Unlimited practice problems',
      'Unlimited mock exam simulations',
      'Full analytics & weakness heatmap',
      'Score history & progress trends',
      'Topic-by-topic breakdown',
      'Full activity feed',
      'Georgian & English support',
    ],
    ctaLabel: 'Get Pro',
    ctaTo: '/purchase?plan=pro',
    socialProof: { icon: Users, text: '78% of active students choose Pro' },
  },
  {
    key: 'premium',
    icon: Crown,
    name: 'Premium',
    tagline: 'For the most dedicated learners',
    monthlyPrice: 35,
    annualPrice: 24,
    yearlyTotal: 288,
    savingsPct: '31%',
    dailyCost: '0.79',
    accentLine: 'from-amber-500 via-yellow-400 to-amber-300',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    headerBg: 'bg-gradient-to-b from-amber-600/8 to-transparent',
    ringClass: 'shadow-xl shadow-amber-600/10',
    checkColor: 'text-amber-400',
    checkBg: 'bg-amber-500/10',
    bestValue: true,
    features: [
      'Everything in Pro, plus:',
      'All future exam subjects included',
      'Extended 12-month analytics history',
      'Priority email support',
      'Early access to new features',
      'Highest support priority',
    ],
    ctaLabel: 'Get Premium',
    ctaTo: '/purchase?plan=premium',
    socialProof: { icon: Users, text: 'For serious learners who want the best' },
  },
];

const COMPARE_ROWS = [
  { label: 'AI Tutor questions',         free: '5 / day',  pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Practice problems',          free: '200 / mo', pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Mock exams',                 free: '1 / mo',   pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Analytics & weakness map',   free: 'Basic',    pro: true,        premium: true },
  { label: 'Score & progress trends',    free: false,      pro: true,        premium: true },
  { label: 'Topic-by-topic breakdown',   free: false,      pro: true,        premium: true },
  { label: 'Georgian & English UI',      free: true,       pro: true,        premium: true },
  { label: 'Analytics history',          free: '7 days',   pro: '30 days',   premium: '12 months' },
  { label: 'Future subjects included',   free: false,      pro: false,       premium: true },
  { label: 'Priority support',           free: false,      pro: false,       premium: true },
  { label: 'Early feature access',       free: false,      pro: false,       premium: true },
];

const FAQS = [
  { q: 'Can I switch between plans anytime?', a: 'Yes. Upgrades take effect immediately. Downgrades apply at the end of your current billing period. No penalties.' },
  { q: 'What does "Priority email support" on Premium mean?', a: 'Premium users get faster responses to support requests — typically within a few hours vs. standard response times for Free and Pro users.' },
  { q: 'Is there a student or group discount?', a: 'Annual billing saves up to 32% vs. monthly. We also offer group discounts for schools and tutoring centres — contact us for institutional pricing.' },
  { q: 'What payment methods do you accept?', a: "All major cards (Visa, Mastercard) via TBC Bank's PCI-DSS compliant payment page. Your card data is handled entirely by TBC — we never store it." },
  { q: 'Can I cancel anytime?', a: "Absolutely. No contracts, no cancellation fees. Cancel from Settings with one click. You'll retain access until the end of your paid period." },
];

// ── Count-up ──────────────────────────────────────────────────────────────────
function useCountUp(target, active, duration = 500) {
  const [count, setCount] = useState(0);
  const prevRef  = useRef(0);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!active || target === 0) { setCount(target); prevRef.current = target; return; }
    const from = prevRef.current;
    prevRef.current = target;
    if (from === target) return;
    let frame = 0;
    const frames = Math.round(duration / 16);
    timerRef.current = setInterval(() => {
      frame++;
      const t = Math.min(frame / frames, 1);
      setCount(Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3))));
      if (frame >= frames) { setCount(target); clearInterval(timerRef.current); }
    }, 16);
    return () => clearInterval(timerRef.current);
  }, [target, active, duration]);
  return count;
}

// ── Comparison cell ───────────────────────────────────────────────────────────
function Cell({ value }) {
  if (value === true) return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
        <Check size={11} className="text-emerald-400" strokeWidth={2.5} />
      </div>
    </div>
  );
  if (value === false) return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
        <X size={11} className="text-slate-600" strokeWidth={2.5} />
      </div>
    </div>
  );
  return <div className="flex justify-center"><span className="text-xs text-slate-400 font-medium">{value}</span></div>;
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-dark-border rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-surface/50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-white pr-4">{q}</span>
        <ChevronDown size={16} className={`text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-dark-border/60">
          <p className="text-sm text-slate-400 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, annual, visible, idx }) {
  const {
    key, icon: Icon, name, tagline,
    monthlyPrice, annualPrice, yearlyTotal, savingsPct, dailyCost,
    accentLine, iconColor, iconBg, border, headerBg, ringClass,
    checkColor, checkBg, popular, bestValue,
    features, locked, ctaLabel, ctaTo, socialProof,
  } = plan;

  const price = annual ? annualPrice : monthlyPrice;
  const count = useCountUp(price, visible);
  const [flash, setFlash] = useState(false);
  const prevAnnual = useRef(annual);

  useEffect(() => {
    if (key === 'free') return;
    if (prevAnnual.current !== annual) {
      prevAnnual.current = annual;
      setFlash(true);
      const id = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(id);
    }
  }, [annual, key]);

  const href = key === 'free'
    ? ctaTo
    : `${ctaTo}&billing=${annual ? 'annual' : 'monthly'}`;

  return (
    <div
      style={{ transitionDelay: `${idx * 100}ms` }}
      className={`
        relative flex flex-col rounded-2xl border ${border} bg-dark-card overflow-hidden
        transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
        ${popular  ? 'md:-translate-y-5 ' + ringClass : ''}
        ${bestValue ? ringClass : ''}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      {/* Accent line */}
      {accentLine && <div className={`h-[3px] bg-gradient-to-r ${accentLine} shrink-0`} />}

      {/* Floating badge */}
      {popular && (
        <div className="absolute top-5 right-5 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white text-[11px] font-bold shadow-lg">
            <Zap size={9} className="fill-white shrink-0" /> Most Popular
          </span>
        </div>
      )}
      {bestValue && (
        <div className="absolute top-5 right-5 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[11px] font-bold shadow-lg">
            <Crown size={9} className="shrink-0" /> Best Value
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`px-8 pt-8 pb-7 ${headerBg}`}>
        <div className="flex items-center gap-3.5 mb-5 pr-28">
          <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
            <Icon size={23} className={iconColor} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{tagline}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1.5 mb-1">
          <span className="text-lg font-semibold text-slate-400 mb-2.5">₾</span>
          <span className={`text-[58px] font-black text-white leading-none tabular-nums transition-transform duration-200 ${flash ? 'scale-110' : 'scale-100'}`}>
            {key === 'free' ? '0' : count}
          </span>
          <span className="text-slate-500 text-sm mb-3 ml-1">
            {key === 'free' ? '/ forever' : '/ mo'}
          </span>
        </div>

        {/* Billing */}
        <div className="min-h-[44px] mb-6">
          {key === 'free' ? (
            <p className="text-sm text-slate-600">No credit card required</p>
          ) : annual ? (
            <>
              <p className="text-sm text-slate-500">
                Billed ₾{yearlyTotal}/yr ·{' '}
                <span className="text-emerald-400 font-semibold">Save {savingsPct}</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">≈ ₾{dailyCost} / day — less than a coffee</p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">Billed monthly</p>
              <p className="text-xs text-emerald-400/70 font-medium mt-1">Switch to annual and save {savingsPct} ↗</p>
            </>
          )}
        </div>

        {/* CTA */}
        <Link to={href} className="block">
          {bestValue ? (
            <div className="relative overflow-hidden rounded-xl">
              <button className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]">
                {ctaLabel} <ArrowRight size={14} className="inline ml-1.5 -mt-0.5" />
              </button>
              <span className="absolute inset-0 w-1/3 h-full bg-white/20 blur-sm animate-shimmer-slide pointer-events-none" />
            </div>
          ) : popular ? (
            <div className="relative overflow-hidden rounded-xl">
              <button className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:opacity-90 shadow-lg shadow-primary-600/25 transition-all active:scale-[0.98]">
                {ctaLabel} <ArrowRight size={14} className="inline ml-1.5 -mt-0.5" />
              </button>
              <span className="absolute inset-0 w-1/3 h-full bg-white/10 blur-sm animate-shimmer-slide pointer-events-none" />
            </div>
          ) : (
            <button className="w-full py-4 rounded-xl font-semibold text-sm border border-dark-border text-slate-300 hover:border-primary-500/40 hover:text-white transition-all active:scale-[0.98]">
              {ctaLabel}
            </button>
          )}
        </Link>

        {socialProof && (
          <p className={`flex items-center justify-center gap-1.5 mt-3 text-xs font-medium ${socialProof.gold ? 'text-amber-400' : 'text-slate-500'}`}>
            <socialProof.icon size={11} className="shrink-0" />
            {socialProof.text}
          </p>
        )}
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-3 px-8">
        <div className="flex-1 h-px bg-dark-border" />
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest whitespace-nowrap">What's included</span>
        <div className="flex-1 h-px bg-dark-border" />
      </div>

      {/* Features */}
      <div className="px-8 pt-6 pb-8 flex-1">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={f} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${checkBg}`}>
                <Check size={10} strokeWidth={3} className={checkColor} />
              </div>
              <span className={`text-sm leading-snug ${i === 0 && key !== 'free' ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {locked?.length > 0 && (
          <div className="mt-6 pt-5 border-t border-dark-border/60">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-4">Requires upgrade</p>
            <ul className="space-y-3">
              {locked.map(l => (
                <li key={l} className="flex items-center gap-2.5 opacity-35">
                  <X size={12} className="text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-500 line-through">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  useSEO({
    title: 'Pricing — Plans Starting Free for Georgian Students',
    description: 'Mentora AI offers a free plan plus affordable Pro (₾19/mo) and Premium (₾35/mo) plans. Start free, upgrade when you need unlimited AI tutoring and exam simulations.',
    path: '/pricing',
  });
  const [annual, setAnnual] = useState(false);

  const hero    = useInView();
  const plans   = useInView();
  const compare = useInView();
  const social  = useInView();
  const faq     = useInView();
  const cta     = useInView();

  const reveal = (inView, delay = 0) => ({
    opacity:    inView ? 1 : 0,
    transform:  inView ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <StaticLayout breadcrumb="Pricing">

      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <div style={reveal(hero.inView, 0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm font-semibold mb-6">
            <Flame size={13} className="text-amber-400 animate-pulse" />
            Early Access Pricing — Locked for Founding Members
          </div>

          <h1 style={reveal(hero.inView, 80)} className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing for Every Student</span>
          </h1>

          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Start free and upgrade when you're ready. No hidden fees. No surprises. Cancel anytime.
          </p>

          {/* Toggle */}
          <div style={reveal(hero.inView, 240)} className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 ${annual ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-surface border border-dark-border'}`}
            >
              <span
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: annual ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>Annual</span>
            {annual && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <Sparkles size={10} /> Save up to 32%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="pb-24 relative">
        <div ref={plans.ref} className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan, idx) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                annual={annual}
                visible={plans.inView}
                idx={idx}
              />
            ))}
          </div>

          {/* Trust bar */}
          <div style={reveal(plans.inView, 450)} className="mt-14 pt-8 border-t border-dark-border/40 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield size={12} /> Cancel anytime · No questions asked
            </span>
            <span className="hidden sm:block text-slate-700">·</span>
            <span className="text-slate-600">No contracts · No hidden fees</span>
            <span className="hidden sm:block text-slate-700">·</span>
            <span className="text-slate-600">Secure payment via TBC Bank</span>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-24 bg-dark-surface/30 border-y border-dark-border">
        <div ref={compare.ref} className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span style={reveal(compare.inView, 0)} className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 block">Compare Plans</span>
            <h2 style={reveal(compare.inView, 80)} className="text-3xl lg:text-4xl font-extrabold text-white">What's Included in Each Plan</h2>
          </div>

          <div style={reveal(compare.inView, 160)} className="overflow-x-auto rounded-2xl border border-dark-border">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left px-6 py-4 text-sm text-slate-500 font-medium w-[40%]">Feature</th>
                  <th className="px-4 py-4 text-center w-[20%]">
                    <span className="text-xs font-semibold text-slate-400">Free</span>
                  </th>
                  <th className="px-4 py-4 w-[20%]">
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600/20 border border-primary-500/30">
                        <Zap size={10} className="text-primary-400 fill-primary-400" />
                        <span className="text-xs font-bold text-primary-300">Pro</span>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-4 w-[20%]">
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600/15 border border-amber-500/30">
                        <Crown size={10} className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">Premium</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ label, free, pro, premium }, i) => (
                  <tr key={label} className={`border-b border-dark-border/60 ${i % 2 === 0 ? 'bg-dark-surface/30' : ''} hover:bg-primary-600/3 transition-colors`}>
                    <td className="px-6 py-3.5 text-sm text-slate-300">{label}</td>
                    <td className="px-4 py-3.5"><Cell value={free} /></td>
                    <td className="px-4 py-3.5 bg-primary-600/5"><Cell value={pro} /></td>
                    <td className="px-4 py-3.5 bg-amber-600/3"><Cell value={premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-20">
        <div ref={social.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { val: '12,400+', label: 'Active Students',  icon: Users,    color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
              { val: '+34 pts', label: 'Avg. Score Gain',  icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { val: '4.9 / 5', label: 'Student Rating',   icon: Star,     color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
            ].map(({ val, label, icon: Icon, color, bg }, i) => (
              <div
                key={label}
                style={{
                  opacity:    social.inView ? 1 : 0,
                  transform:  social.inView ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                }}
                className={`rounded-2xl border p-6 ${bg} text-center`}
              >
                <Icon size={20} className={`${color} mx-auto mb-3`} />
                <div className="text-3xl font-extrabold text-white mb-1">{val}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-dark-surface/30 border-t border-dark-border">
        <div ref={faq.ref} className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span style={reveal(faq.inView, 0)} className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4 block">Got Questions?</span>
            <h2 style={reveal(faq.inView, 80)} className="text-3xl font-extrabold text-white">Pricing FAQs</h2>
          </div>
          <div style={reveal(faq.inView, 160)} className="space-y-3">
            {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-900/20 to-dark-bg">
        <div ref={cta.ref} className="max-w-3xl mx-auto px-6 text-center">
          <div style={reveal(cta.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <Sparkles size={13} className="animate-pulse" />
            Free plan. No card required.
          </div>
          <h2 style={reveal(cta.inView, 80)} className="text-4xl font-extrabold text-white mb-4">
            Start Free, Upgrade Anytime
          </h2>
          <p style={reveal(cta.inView, 160)} className="text-slate-400 mb-8 text-lg">
            Join 12,400+ students already improving their ENT score with Mentora AI.
          </p>
          <div style={reveal(cta.inView, 240)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/25">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-primary-500/30 text-primary-400 font-semibold hover:bg-primary-500/10 transition-colors">
              See All Features
            </Link>
          </div>
        </div>
      </section>

    </StaticLayout>
  );
}
