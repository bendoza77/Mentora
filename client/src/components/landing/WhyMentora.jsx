import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock, BrainCircuit, Target, BarChart3, Trophy, Coins,
  Check, X, Minus, ArrowRight, Star, Sparkles
} from 'lucide-react';
import clsx from 'clsx';

/* ─── Reason cards ─── */
const REASONS = [
  {
    key: 'r1', icon: Clock,
    gradient: 'from-primary-600/15 to-transparent',
    border: 'border-primary-500/20',
    iconGrad: 'from-primary-600 to-primary-400',
    glow: 'shadow-primary-600/20',
    color: 'text-primary-400',
  },
  {
    key: 'r2', icon: BrainCircuit,
    gradient: 'from-accent-500/12 to-transparent',
    border: 'border-accent-500/20',
    iconGrad: 'from-accent-500 to-cyan-400',
    glow: 'shadow-accent-500/20',
    color: 'text-accent-400',
  },
  {
    key: 'r3', icon: Target,
    gradient: 'from-emerald-500/12 to-transparent',
    border: 'border-emerald-500/20',
    iconGrad: 'from-emerald-600 to-emerald-400',
    glow: 'shadow-emerald-500/20',
    color: 'text-emerald-400',
  },
  {
    key: 'r4', icon: BarChart3,
    gradient: 'from-amber-500/12 to-transparent',
    border: 'border-amber-500/20',
    iconGrad: 'from-amber-500 to-yellow-400',
    glow: 'shadow-amber-500/20',
    color: 'text-amber-400',
  },
  {
    key: 'r5', icon: Trophy,
    gradient: 'from-rose-500/12 to-transparent',
    border: 'border-rose-500/20',
    iconGrad: 'from-rose-600 to-rose-400',
    glow: 'shadow-rose-500/20',
    color: 'text-rose-400',
  },
  {
    key: 'r6', icon: Coins,
    gradient: 'from-violet-500/12 to-transparent',
    border: 'border-violet-500/20',
    iconGrad: 'from-violet-600 to-violet-400',
    glow: 'shadow-violet-500/20',
    color: 'text-violet-400',
  },
];

/* ─── Comparison rows ─── */
// true = full, 'partial' = limited, false = none
const COMPARE_ROWS = [
  { key: 'c1', mentora: true,      tutor: false,      app: false     },
  { key: 'c2', mentora: true,      tutor: true,       app: 'partial' },
  { key: 'c3', mentora: true,      tutor: 'partial',  app: false     },
  { key: 'c4', mentora: true,      tutor: false,      app: 'partial' },
  { key: 'c5', mentora: true,      tutor: false,      app: 'partial' },
  { key: 'c6', mentora: true,      tutor: false,      app: true      },
];

function CompareCell({ value }) {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <Check size={13} className="text-emerald-400" strokeWidth={2.5} />
        </div>
      </div>
    );
  if (value === 'partial')
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <Minus size={13} className="text-amber-400" strokeWidth={2.5} />
        </div>
      </div>
    );
  return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <X size={13} className="text-red-500" strokeWidth={2.5} />
      </div>
    </div>
  );
}

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  {
    name: 'ნინო ჯაფარიძე',
    role: 'ENT 2025 · Tbilisi',
    score: '91/100',
    text: "Three months with Mentora AI and I went from failing practice exams to scoring 91. The AI explanations are clearer than any teacher I've had.",
    initials: 'NJ',
    from: 'from-primary-600',
    to: 'to-accent-500',
  },
  {
    name: 'გიორგი მელიქიძე',
    role: 'ENT 2025 · Kutaisi',
    score: '87/100',
    text: '"I used to pay 80 GEL per hour for a private tutor. Mentora AI costs less per month and is available at 2am when I study. Game changer."',
    initials: 'GM',
    from: 'from-emerald-600',
    to: 'to-emerald-400',
  },
  {
    name: 'სალომე ბახტაძე',
    role: 'ENT 2025 · Batumi',
    score: '94/100',
    text: '"The weakness detection is insane. It found that I was making systematic errors in trigonometry I didn\'t even know I had. Fixed in two weeks."',
    initials: 'SB',
    from: 'from-rose-600',
    to: 'to-amber-400',
  },
];

/* ─── Main component ─── */
export default function WhyMentora() {
  const { t } = useTranslation();

  return (
    <section id="why" className="relative py-28 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* ── Section header ── */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Sparkles size={13} />
            {t('why.badge')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            {t('why.headline')}
            <br />
            <span className="gradient-text">{t('why.headlineAccent')}</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('why.subheadline')}
          </p>
        </div>

        {/* ── 6 Reason Cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {REASONS.map(({ key, icon: Icon, gradient, border, iconGrad, glow, color }) => (
            <div
              key={key}
              className={clsx(
                'group relative rounded-2xl border p-6 bg-gradient-to-br overflow-hidden card-hover',
                gradient, border
              )}
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />

              {/* Icon */}
              <div className={clsx(
                'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300',
                iconGrad, glow
              )}>
                <Icon size={22} className="text-white" />
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {t(`why.${key}Title`)}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t(`why.${key}Desc`)}
              </p>

              {/* Bottom accent line */}
              <div className={clsx(
                'absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-current to-transparent',
                color
              )} />
            </div>
          ))}
        </div>

        {/* ── Comparison Table ── */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">
              {t('why.compareHeadline')}
            </h3>
            <p className="text-slate-500 text-sm">{t('why.compareSubline')}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-dark-border">
            <table className="w-full min-w-[560px]">
              {/* Header */}
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left px-6 py-4 text-sm text-slate-500 font-medium w-[40%]">
                    {t('why.featureCol')}
                  </th>
                  {/* Mentora AI — highlighted */}
                  <th className="px-4 py-4 w-[20%]">
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 border border-primary-500/30">
                        <Star size={12} className="text-primary-400 fill-primary-400" />
                        <span className="text-xs font-bold text-primary-300">Mentora AI</span>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs text-slate-500 font-medium w-[20%]">
                    {t('why.tutorCol')}
                    <div className="text-[10px] text-slate-700 font-normal mt-0.5">100+ GEL/hr</div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs text-slate-500 font-medium w-[20%]">
                    {t('why.appCol')}
                  </th>
                </tr>
              </thead>

              {/* Rows */}
              <tbody>
                {COMPARE_ROWS.map(({ key, mentora, tutor, app }, i) => (
                  <tr
                    key={key}
                    className={clsx(
                      'border-b border-dark-border/60 transition-colors',
                      i % 2 === 0 ? 'bg-dark-surface/30' : 'bg-transparent',
                      'hover:bg-primary-600/4'
                    )}
                  >
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      {t(`why.${key}`)}
                    </td>
                    {/* Mentora — highlighted column */}
                    <td className="px-4 py-4 bg-primary-600/5">
                      <CompareCell value={mentora} />
                    </td>
                    <td className="px-4 py-4">
                      <CompareCell value={tutor} />
                    </td>
                    <td className="px-4 py-4">
                      <CompareCell value={app} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Check size={11} className="text-emerald-400" /> {t('why.legendFull')}
            </span>
            <span className="flex items-center gap-1.5">
              <Minus size={11} className="text-amber-400" /> {t('why.legendPartial')}
            </span>
            <span className="flex items-center gap-1.5">
              <X size={11} className="text-red-500" /> {t('why.legendNone')}
            </span>
          </div>
        </div>

        {/* ── Student Testimonials ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">
              {t('why.testimonialsHeadline')}
            </h3>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              <span className="text-slate-500 text-sm ml-2">4.9 out of 5 · 2,400+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, score, text, initials, from, to }) => (
              <div key={name} className="glass rounded-2xl p-6 border border-dark-border hover:border-primary-500/20 transition-colors group">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">{text}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                  <div className={clsx(
                    'w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0',
                    from, to
                  )}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                  <div className="ml-auto shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-400">{score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary-600/25"
          >
            {t('why.cta')}
            <ArrowRight size={18} />
          </Link>
          <p className="text-slate-600 text-xs mt-3">{t('why.ctaSub')}</p>
        </div>
      </div>
    </section>
  );
}
