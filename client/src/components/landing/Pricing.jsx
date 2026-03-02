import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Zap, Crown, Star, Shield, Users, Flame } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    key: 'free',
    icon: Star,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-500/10',
    border: 'border-dark-border',
    cta: 'ctaFree',
    variant: 'secondary',
    features: ['f1', 'f2', 'f3', 'f4', 'f5'],
    locked: ['l1', 'l2', 'l3'],
  },
  {
    key: 'pro',
    icon: Zap,
    iconColor: 'text-primary-400',
    iconBg: 'bg-primary-500/10',
    border: 'border-primary-500/50',
    cta: 'ctaPro',
    variant: 'gradient',
    popular: true,
    features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
  },
  {
    key: 'premium',
    icon: Crown,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    cta: 'ctaPremium',
    bestValue: true,
    guarantee: true,
    features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'],
  },
];

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
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (frame >= totalFrames) { setCount(target); clearInterval(timerRef.current); }
    }, 16);

    return () => clearInterval(timerRef.current);
  }, [target, active, duration]);

  return count;
}

function PriceDisplay({ plan, getPrice, annual, visible, t }) {
  const raw = parseInt(getPrice(plan)) || 0;
  const counted = useCountUp(raw, visible);
  const isFree = plan === 'free';
  const [flash, setFlash] = useState(false);
  const prevAnnual = useRef(annual);

  useEffect(() => {
    if (isFree) return;
    if (prevAnnual.current !== annual) {
      prevAnnual.current = annual;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [annual, isFree]);

  return (
    <div className="mb-5">
      <div className="flex items-end gap-1 mb-1">
        <span className="text-lg font-semibold text-slate-400 mb-1">{t('pricing.currency')}</span>
        <span className={`text-5xl font-black text-white leading-none tabular-nums transition-transform duration-200 ${flash ? 'scale-110' : 'scale-100'}`}>
          {isFree ? '0' : counted}
        </span>
        <span className="text-slate-500 text-sm mb-1.5">
          {isFree ? t('pricing.freePeriod') : t('pricing.perMonth')}
        </span>
      </div>
      {!isFree && (
        <div key={String(annual)} className="space-y-0.5 mt-1.5 animate-fade-in-up" style={{ animationDuration: '0.25s' }}>
          <p className="text-xs text-slate-500">
            {plan === 'pro'
              ? (annual ? t('pricing.proDailyAnnual') : t('pricing.proDailyMonthly'))
              : (annual ? t('pricing.premiumDailyAnnual') : t('pricing.premiumDailyMonthly'))
            } · {annual ? t('pricing.billedAnnually') : t('pricing.freePeriod')}
          </p>
          {annual && plan === 'pro' && (
            <p className="text-xs font-semibold text-emerald-400">{t('pricing.proSavedAnnual')}</p>
          )}
          {annual && plan === 'premium' && (
            <p className="text-xs font-semibold text-emerald-400">{t('pricing.premiumSavedAnnual')}</p>
          )}
          {!annual && (
            <p className="text-xs text-slate-600 italic">{t('pricing.tutorCompare')}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getPrice = (plan) => {
    if (plan === 'free') return t('pricing.freePrice');
    if (plan === 'pro') return annual ? t('pricing.proPriceAnnual') : t('pricing.proPrice');
    if (plan === 'premium') return annual ? t('pricing.premiumPriceAnnual') : t('pricing.premiumPrice');
  };

  return (
    <section id="pricing" ref={sectionRef} className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Urgency Banner */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm font-semibold">
            <Flame size={14} className="text-amber-400 animate-pulse" />
            {t('pricing.earlyAccess')}
          </div>
        </div>

        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            {t('pricing.badge')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('pricing.headline')}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('pricing.subheadline')}
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 ${annual ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-muted'}`}
            >
              <span
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: annual ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>
              {t('pricing.annual')}
            </span>
            {annual && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-fade-in-up">
                {t('pricing.saveLabel')}
              </span>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ key, icon: Icon, iconColor, iconBg, border, cta, variant, popular, bestValue, guarantee, features, locked }, idx) => (
            <div
              key={key}
              className={`relative rounded-2xl border ${border} bg-dark-card flex flex-col overflow-hidden
                transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl
                ${popular ? 'md:-translate-y-3 animate-card-glow ring-1 ring-primary-500/20' : ''}
                ${bestValue ? 'shadow-xl shadow-amber-600/10' : ''}
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              style={{ transitionDelay: visible ? `${0.2 + idx * 0.15}s` : '0s' }}
            >
              {/* Top accent line */}
              {popular && <div className="h-0.5 bg-gradient-to-r from-primary-600 to-accent-500" />}
              {bestValue && <div className="h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300" />}

              {/* Floating badge */}
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                    ⚡ {t('pricing.popular')}
                  </span>
                </div>
              )}
              {bestValue && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold shadow-lg whitespace-nowrap">
                    👑 {t('pricing.bestValue')}
                  </span>
                </div>
              )}

              {/* Top section */}
              <div className={`p-7 ${popular ? 'bg-gradient-to-b from-primary-600/10 to-transparent' : bestValue ? 'bg-gradient-to-b from-amber-600/5 to-transparent' : ''}`}>

                {/* Plan name & icon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t(`pricing.${key}Name`)}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{t(`pricing.${key}Desc`)}</p>

                {/* Price with count-up */}
                <PriceDisplay
                  plan={key}
                  getPrice={getPrice}
                  annual={annual}
                  visible={visible}
                  t={t}
                />

                {/* CTA */}
                <Link to="/register" className="block">
                  {bestValue ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <button className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20">
                        {t(`pricing.${cta}`)}
                      </button>
                      <span className="absolute inset-0 w-1/3 h-full bg-white/25 blur-sm animate-shimmer-slide pointer-events-none" />
                    </div>
                  ) : popular ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <Button variant={variant} full>{t(`pricing.${cta}`)}</Button>
                      <span className="absolute inset-0 w-1/3 h-full bg-white/15 blur-sm animate-shimmer-slide pointer-events-none" />
                    </div>
                  ) : (
                    <Button variant={variant} full>{t(`pricing.${cta}`)}</Button>
                  )}
                </Link>

                {/* Social proof / guarantee */}
                {popular && (
                  <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-slate-500">
                    <Users size={11} />
                    {t('pricing.proStudents')}
                  </p>
                )}
                {guarantee && (
                  <p className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-amber-400 font-medium">
                    <Shield size={11} />
                    {t('pricing.guaranteeShort')}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px mx-7 bg-dark-border" />

              {/* Features */}
              <div className="p-7 pt-5 flex-1">
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2.5 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
                      style={{ transitionDelay: visible ? `${0.4 + idx * 0.15 + i * 0.04}s` : '0s' }}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5
                        ${popular ? 'bg-primary-500/20' : bestValue ? 'bg-amber-500/15' : 'bg-emerald-500/10'}`}>
                        <Check
                          size={9}
                          strokeWidth={3}
                          className={popular ? 'text-primary-400' : bestValue ? 'text-amber-400' : 'text-emerald-400'}
                        />
                      </div>
                      <span className={`text-sm leading-snug ${i < 2 && key !== 'free' ? 'text-white font-medium' : 'text-slate-400'}`}>
                        {t(`pricing.${key}.${f}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Locked features (Free only) */}
                {locked?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-dark-border/60">
                    <p className="text-xs text-slate-600 font-medium mb-2.5">{t('pricing.freeLockedLabel')}</p>
                    <ul className="space-y-2">
                      {locked.map((l) => (
                        <li key={l} className="flex items-center gap-2 opacity-40">
                          <X size={12} className="text-slate-500 shrink-0" />
                          <span className="text-xs text-slate-500 line-through">{t(`pricing.free.${l}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div
          className={`mt-14 pt-8 border-t border-dark-border/40 flex flex-col items-center gap-2.5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: visible ? '0.7s' : '0s' }}
        >
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">{t('pricing.guarantee')}</span>
          </div>
          <p className="text-xs text-slate-700">{t('pricing.trustLine')}</p>
        </div>

      </div>
    </section>
  );
}
