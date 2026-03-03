import { useState, useEffect, useRef } from 'react';
import { Check, X, Zap, Crown, Star, Shield, Users, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Plan data ─────────────────────────────────────────────────────────────────
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

// ── Count-up animation ────────────────────────────────────────────────────────
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

// ── Single plan card ──────────────────────────────────────────────────────────
function PlanCard({ plan, annual, visible, idx }) {
  const {
    key, icon: Icon, name, tagline,
    monthlyPrice, annualPrice, yearlyTotal, savingsPct, dailyCost,
    accentLine, iconColor, iconBg, border, headerBg, ringClass,
    checkColor, checkBg, popular, bestValue,
    features, locked, ctaLabel, ctaTo, socialProof,
  } = plan;

  const price  = annual ? annualPrice : monthlyPrice;
  const count  = useCountUp(price, visible);
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

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border ${border} bg-dark-card overflow-hidden
        transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
        ${popular ? 'md:-translate-y-5 ' + ringClass : ''}
        ${bestValue ? ringClass : ''}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: visible ? `${0.1 + idx * 0.13}s` : '0s' }}
    >
      {/* Accent line */}
      {accentLine && (
        <div className={`h-[3px] bg-gradient-to-r ${accentLine} shrink-0`} />
      )}

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

      {/* ── Header ─────────────────────────────── */}
      <div className={`px-8 pt-8 pb-7 ${headerBg}`}>

        {/* Plan identity */}
        <div className="flex items-center gap-3.5 mb-5 pr-24">
          <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
            <Icon size={23} className={iconColor} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
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

        {/* Billing info */}
        <div className="min-h-[44px] mb-6">
          {key === 'free' ? (
            <p className="text-sm text-slate-600">No credit card required</p>
          ) : annual ? (
            <>
              <p className="text-sm text-slate-500">
                Billed ₾{yearlyTotal}/yr ·{' '}
                <span className="text-emerald-400 font-semibold">Save {savingsPct}</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                ≈ ₾{dailyCost} / day — less than a coffee
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">Billed monthly</p>
              <p className="text-xs text-emerald-400/70 font-medium mt-1">
                Switch to annual and save {savingsPct} ↗
              </p>
            </>
          )}
        </div>

        {/* CTA button */}
        <Link to={annual && key !== 'free' ? `${ctaTo}&billing=annual` : ctaTo} className="block">
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

        {/* Social proof */}
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
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest whitespace-nowrap">
          What's included
        </span>
        <div className="flex-1 h-px bg-dark-border" />
      </div>

      {/* ── Features ───────────────────────────── */}
      <div className="px-8 pt-6 pb-8 flex-1">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li
              key={f}
              className={`flex items-start gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
              style={{ transitionDelay: visible ? `${0.3 + idx * 0.13 + i * 0.04}s` : '0s' }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${checkBg}`}>
                <Check size={10} strokeWidth={3} className={checkColor} />
              </div>
              <span className={`text-sm leading-snug ${i === 0 && key !== 'free' ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Locked (Free plan) */}
        {locked?.length > 0 && (
          <div className="mt-6 pt-5 border-t border-dark-border/60">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-4">
              Requires upgrade
            </p>
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

// ── Section ───────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [annual,  setAnnual]  = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm font-semibold mb-6">
            <Flame size={13} className="text-amber-400 animate-pulse" />
            Early Access Pricing — Locked for Founding Members
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Simple Pricing for
            <br />
            <span className="gradient-text">Every Georgian Student</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Start free. Upgrade when you're ready. No contracts, no hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-colors duration-200 ${!annual ? 'text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(a => !a)}
              aria-label="Toggle annual billing"
              className={`relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 focus:outline-none ${annual ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-surface border border-dark-border'}`}
            >
              <span
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: annual ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors duration-200 ${annual ? 'text-white' : 'text-slate-500'}`}>
              Annual
            </span>
            {annual && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <Sparkles size={10} /> Save up to 32%
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan, idx) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              annual={annual}
              visible={visible}
              idx={idx}
            />
          ))}
        </div>

        {/* Trust bar */}
        <div
          className={`mt-14 pt-8 border-t border-dark-border/40 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: visible ? '0.75s' : '0s' }}
        >
          {[
            { icon: Shield,   color: 'text-emerald-400', text: 'Cancel anytime · No questions asked', highlight: true },
            { icon: null,     color: '',                  text: 'No contracts · No hidden fees' },
            { icon: null,     color: '',                  text: 'Secure payment via TBC Bank' },
          ].map(({ icon: Ico, color, text, highlight }, i) => (
            <span key={text} className={`flex items-center gap-1.5 text-xs ${highlight ? color + ' font-medium' : 'text-slate-600'}`}>
              {Ico && <Ico size={12} className={color} />}
              {text}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
