import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import StaticLayout from '../components/layout/StaticLayout';
import useInView from '../hooks/useInView';
import usePageTitle from '../hooks/usePageTitle';
import {
  Check, X, Zap, Crown, Star, Shield, Users, Flame,
  ArrowRight, Sparkles, ChevronDown, BarChart3
} from 'lucide-react';

/* ── animation helpers ── */
const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const scaleIn = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)',
  transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
});

/* ── Count-up ── */
function useCountUp(target, active, duration = 550) {
  const [count, setCount] = useState(0);
  const prevRef = useRef(0);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!active || target === 0) { setCount(target); prevRef.current = target; return; }
    const startVal = prevRef.current;
    prevRef.current = target;
    if (startVal === target) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    timerRef.current = setInterval(() => {
      frame++;
      const eased = 1 - Math.pow(1 - Math.min(frame / totalFrames, 1), 3);
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (frame >= totalFrames) { setCount(target); clearInterval(timerRef.current); }
    }, 16);
    return () => clearInterval(timerRef.current);
  }, [target, active, duration]);
  return count;
}

const PLANS = [
  {
    key: 'free', icon: Star, name: 'Free', desc: 'Start exploring. No credit card needed.',
    monthlyPrice: 0, annualPrice: 0,
    iconColor: 'text-slate-400', iconBg: 'bg-slate-500/10', border: 'border-dark-border',
    ctaLabel: 'Start for Free',
    features: ['50 AI Tutor questions / month', '200 practice problems', 'Basic analytics dashboard', '1 mini mock exam / month', 'Georgian & English UI'],
    locked: ['Unlimited AI Tutor access', 'Full exam simulations', 'Weakness detection AI'],
  },
  {
    key: 'pro', icon: Zap, name: 'Pro', desc: 'Everything a serious student needs.',
    monthlyPrice: 19, annualPrice: 13,
    iconColor: 'text-primary-400', iconBg: 'bg-primary-500/10', border: 'border-primary-500/50',
    ctaLabel: 'Get Pro', popular: true,
    features: ['Unlimited AI Tutor questions', 'Unlimited practice problems', 'Full analytics & weakness heatmap', 'Unlimited mock exams', 'Adaptive difficulty engine', 'Score prediction model', 'Priority AI response speed', 'Georgian & English support'],
  },
  {
    key: 'premium', icon: Crown, name: 'Premium', desc: 'Maximum performance, guaranteed results.',
    monthlyPrice: 35, annualPrice: 24,
    iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10', border: 'border-amber-500/30',
    ctaLabel: 'Get Premium', bestValue: true,
    features: ['Everything in Pro', 'Personal study roadmap AI', 'ENT topic mastery certification', 'Score guarantee program', 'Early access to new features', 'Direct exam strategy coaching', 'Parent/teacher progress reports', 'Dedicated support chat', 'Downloadable study resources', 'Exclusive student community'],
  },
];

const COMPARE_ROWS = [
  { label: 'AI Tutor questions', free: '50/mo', pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Practice problems',  free: '200/mo', pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Mock exams',         free: '1/mo',   pro: 'Unlimited', premium: 'Unlimited' },
  { label: 'Analytics & heatmap', free: 'Basic', pro: true, premium: true },
  { label: 'Weakness detection AI', free: false, pro: true, premium: true },
  { label: 'Score prediction',   free: false, pro: true, premium: true },
  { label: 'Adaptive difficulty', free: false, pro: true, premium: true },
  { label: 'Study roadmap AI',   free: false, pro: false, premium: true },
  { label: 'Score guarantee',    free: false, pro: false, premium: true },
  { label: 'Parent reports',     free: false, pro: false, premium: true },
];

const FAQS = [
  { q: 'Can I switch between plans anytime?', a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades apply at the end of your current billing period.' },
  { q: 'What is the score guarantee on Premium?', a: "If you follow your personalised study plan and your ENT score doesn't improve, we'll refund your last month. Terms apply — contact support for details." },
  { q: 'Is there a student discount?', a: 'Yes — annual billing saves up to 32% vs. monthly. We also offer group discounts for schools and tutoring centres. Contact us for institutional pricing.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard) issued by any bank. Payments are processed securely via TBC Bank — one of Georgia\'s leading banks. Your card data is handled entirely by TBC\'s PCI-DSS compliant payment page.' },
  { q: 'Can I cancel anytime?', a: "Absolutely. No contracts, no cancellation fees. Cancel from your account settings with one click. You'll retain access until the end of your paid period." },
];

function CompareCell({ value }) {
  if (value === true) return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
        <Check size={12} className="text-emerald-400" strokeWidth={2.5} />
      </div>
    </div>
  );
  if (value === false) return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <X size={12} className="text-red-500" strokeWidth={2.5} />
      </div>
    </div>
  );
  return <div className="flex justify-center"><span className="text-xs text-slate-400 font-medium">{value}</span></div>;
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-dark-border rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-surface/50 transition-colors" onClick={() => setOpen(!open)}>
        <span className="text-sm font-semibold text-white pr-4">{q}</span>
        <ChevronDown size={16} className={`text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-dark-border/60 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <p className="text-sm text-slate-400 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

function PriceDisplay({ plan, annual, visible }) {
  const target = annual ? plan.annualPrice : plan.monthlyPrice;
  const count  = useCountUp(target, visible);
  const [flash, setFlash] = useState(false);
  const prevAnnual = useRef(annual);
  useEffect(() => {
    if (plan.key === 'free') return;
    if (prevAnnual.current !== annual) {
      prevAnnual.current = annual;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [annual, plan.key]);
  return (
    <div className="mb-5">
      <div className="flex items-end gap-1 mb-1">
        <span className="text-lg font-semibold text-slate-400 mb-1">₾</span>
        <span className={`text-5xl font-black text-white leading-none tabular-nums transition-transform duration-200 ${flash ? 'scale-110' : 'scale-100'}`}>
          {plan.key === 'free' ? '0' : count}
        </span>
        <span className="text-slate-500 text-sm mb-1.5">{plan.key === 'free' ? '/ forever' : '/ mo'}</span>
      </div>
      {plan.key !== 'free' && (
        <p className="text-xs text-slate-500 mt-1">
          {annual ? 'Billed annually · ' : 'Billed monthly · '}
          {annual
            ? <span className="text-emerald-400 font-semibold">Save {plan.key === 'pro' ? '32%' : '31%'}</span>
            : <span className="text-slate-600">Switch to annual to save</span>
          }
        </p>
      )}
    </div>
  );
}

export default function PricingPage() {
  usePageTitle('Pricing');
  const [annual, setAnnual] = useState(false);
  const hero    = useInView();
  const plans   = useInView();
  const compare = useInView();
  const social  = useInView();
  const faq     = useInView();
  const cta     = useInView();

  return (
    <StaticLayout breadcrumb="Pricing">

      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
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
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Start free and upgrade when you're ready. No hidden fees. No surprises. Cancel anytime.
          </p>
          <div style={reveal(hero.inView, 240)} className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 ${annual ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-surface border border-dark-border'}`}
            >
              <span className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300" style={{ transform: annual ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }} />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>Annual</span>
            {annual && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-fade-in-up" style={{ animationDuration: '0.25s' }}>
                Save up to 32%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="pb-24 relative">
        <div ref={plans.ref} className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map(({ key, icon: Icon, name, desc, iconColor, iconBg, border, ctaLabel, popular, bestValue, features, locked }, idx) => (
              <div
                key={key}
                style={scaleIn(plans.inView, idx * 100)}
                className={`relative rounded-2xl border ${border} bg-dark-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                  ${popular ? 'md:-translate-y-3 ring-1 ring-primary-500/20' : ''}
                  ${bestValue ? 'shadow-xl shadow-amber-600/10' : ''}`}
              >
                {popular && <div className="h-0.5 bg-gradient-to-r from-primary-600 to-accent-500" />}
                {bestValue && <div className="h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300" />}

                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-bold shadow-lg whitespace-nowrap">⚡ Most Popular</span>
                  </div>
                )}
                {bestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold shadow-lg whitespace-nowrap">👑 Best Value</span>
                  </div>
                )}

                <div className={`p-7 ${popular ? 'bg-gradient-to-b from-primary-600/10 to-transparent' : bestValue ? 'bg-gradient-to-b from-amber-600/5 to-transparent' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={iconColor} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
                  <PriceDisplay plan={{ key, monthlyPrice: PLANS.find(p => p.key === key).monthlyPrice, annualPrice: PLANS.find(p => p.key === key).annualPrice }} annual={annual} visible={plans.inView} />

                  <Link to={key === 'free' ? '/register' : `/purchase?plan=${key}&billing=${annual ? 'annual' : 'monthly'}`} className="block">
                    {bestValue ? (
                      <div className="relative overflow-hidden rounded-xl">
                        <button className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all">{ctaLabel}</button>
                        <span className="absolute inset-0 w-1/3 h-full bg-white/20 blur-sm animate-shimmer-slide pointer-events-none" />
                      </div>
                    ) : popular ? (
                      <div className="relative overflow-hidden rounded-xl">
                        <button className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:opacity-90 shadow-lg shadow-primary-600/20 transition-all">{ctaLabel}</button>
                        <span className="absolute inset-0 w-1/3 h-full bg-white/10 blur-sm animate-shimmer-slide pointer-events-none" />
                      </div>
                    ) : (
                      <button className="w-full py-3 px-4 rounded-xl font-bold text-sm border border-dark-border text-slate-300 hover:border-primary-500/40 hover:text-white transition-all">{ctaLabel}</button>
                    )}
                  </Link>

                  {popular && <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-slate-500"><Users size={11} /> Chosen by 78% of active students</p>}
                  {bestValue && <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-amber-400 font-medium"><Shield size={11} /> 30-day score guarantee</p>}
                </div>

                <div className="h-px mx-7 bg-dark-border" />

                <div className="p-7 pt-5 flex-1">
                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${popular ? 'bg-primary-500/20' : bestValue ? 'bg-amber-500/15' : 'bg-emerald-500/10'}`}>
                          <Check size={9} strokeWidth={3} className={popular ? 'text-primary-400' : bestValue ? 'text-amber-400' : 'text-emerald-400'} />
                        </div>
                        <span className="text-sm text-slate-400 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {locked?.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-dark-border/60">
                      <p className="text-xs text-slate-600 font-medium mb-2.5">Requires upgrade</p>
                      <ul className="space-y-2">
                        {locked.map((l) => (
                          <li key={l} className="flex items-center gap-2 opacity-40">
                            <X size={12} className="text-slate-500 shrink-0" />
                            <span className="text-xs text-slate-500 line-through">{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={reveal(plans.inView, 400)} className="mt-14 pt-8 border-t border-dark-border/40 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-400" /><span className="text-emerald-400 font-medium">30-day money-back guarantee on Premium</span></span>
            <span className="hidden sm:block">·</span>
            <span>No contracts · Cancel anytime</span>
            <span className="hidden sm:block">·</span>
            <span>Secure payment via TBC Bank</span>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 bg-dark-surface/30 border-y border-dark-border">
        <div ref={compare.ref} className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span style={reveal(compare.inView, 0)} className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 block">Compare</span>
            <h2 style={reveal(compare.inView, 80)} className="text-3xl lg:text-4xl font-extrabold text-white">What's Included in Each Plan</h2>
          </div>
          <div style={reveal(compare.inView, 160)} className="overflow-x-auto rounded-2xl border border-dark-border">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left px-6 py-4 text-sm text-slate-500 font-medium w-[40%]">Feature</th>
                  <th className="px-4 py-4 text-center text-xs text-slate-400 font-semibold w-[20%]">Free</th>
                  <th className="px-4 py-4 w-[20%]">
                    <div className="flex justify-center">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600/20 border border-primary-500/30">
                        <Star size={11} className="text-primary-400 fill-primary-400" />
                        <span className="text-xs font-bold text-primary-300">Pro</span>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-4 w-[20%]">
                    <div className="flex justify-center">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600/15 border border-amber-500/30">
                        <Crown size={11} className="text-amber-400" />
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
                    <td className="px-4 py-3.5"><CompareCell value={free} /></td>
                    <td className="px-4 py-3.5 bg-primary-600/5"><CompareCell value={pro} /></td>
                    <td className="px-4 py-3.5 bg-amber-600/3"><CompareCell value={premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-20">
        <div ref={social.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { val: '12,400+', label: 'Active Students', icon: Users, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
              { val: '+34 pts', label: 'Avg. Score Gain', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { val: '4.9 / 5', label: 'Student Rating', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            ].map(({ val, label, icon: Icon, color, bg }, i) => (
              <div key={label} style={scaleIn(social.inView, i * 80)} className={`rounded-2xl border p-6 ${bg} text-center`}>
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

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-900/20 to-dark-bg">
        <div ref={cta.ref} className="max-w-3xl mx-auto px-6 text-center">
          <div style={reveal(cta.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <Sparkles size={13} className="animate-pulse" />
            Free plan. No card required.
          </div>
          <h2 style={reveal(cta.inView, 80)} className="text-4xl font-extrabold text-white mb-4">Start Free, Upgrade Anytime</h2>
          <p style={reveal(cta.inView, 160)} className="text-slate-400 mb-8 text-lg">Join 12,400+ students already improving their ENT score with Mentora AI.</p>
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
