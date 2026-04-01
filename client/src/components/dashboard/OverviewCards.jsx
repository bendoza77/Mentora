import { useTranslation } from 'react-i18next';
import { Flame, BookOpen, Target, TrendingUp } from 'lucide-react';

/**
 * OverviewCards — Premium redesigned stat cards with gradient accents and glow effects.
 */
export default function OverviewCards({
  streak          = 0,
  problemsSolved  = 0,
  accuracy        = 0,
  latestExamScore = null,
  latestExamMax   = 100,
  loading         = false,
}) {
  const { t } = useTranslation();

  const accuracyDisplay = problemsSolved > 0 ? `${accuracy}%` : '—';
  const examDisplay     = latestExamScore !== null ? `${latestExamScore}` : '—';
  const examUnit        = latestExamScore !== null ? `/ ${latestExamMax}` : '';

  const CARDS = [
    {
      key:       'streak',
      icon:      Flame,
      value:     streak,
      unit:      streak === 1 ? 'day' : 'days',
      gradient:  'from-amber-500 to-orange-500',
      glow:      'rgba(245,158,11,0.15)',
      ring:      'border-amber-500/20',
      iconBg:    'bg-amber-500/15',
      iconColor: 'text-amber-400',
      barColor:  'bg-gradient-to-r from-amber-500 to-orange-400',
      barPct:    Math.min(streak * 10, 100),
      trend:     streak >= 7  ? '🔥 On fire!'   :
                 streak >= 3  ? '↑ Keep it up'  :
                 streak === 1 ? 'Day 1 — go!'   : null,
      trendUp:   streak >= 3,
    },
    {
      key:       'problemsSolved',
      icon:      BookOpen,
      value:     problemsSolved,
      unit:      'total',
      gradient:  'from-primary-500 to-violet-500',
      glow:      'rgba(124,58,237,0.15)',
      ring:      'border-primary-500/20',
      iconBg:    'bg-primary-500/15',
      iconColor: 'text-primary-400',
      barColor:  'bg-gradient-to-r from-primary-600 to-violet-400',
      barPct:    Math.min(problemsSolved * 2, 100),
      trend:     problemsSolved > 0 ? `↑ ${problemsSolved} solved` : 'Start practicing!',
      trendUp:   problemsSolved > 0,
    },
    {
      key:       'accuracy',
      icon:      Target,
      value:     accuracyDisplay,
      unit:      '',
      gradient:  'from-emerald-500 to-teal-400',
      glow:      'rgba(16,185,129,0.15)',
      ring:      'border-emerald-500/20',
      iconBg:    'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      barColor:  'bg-gradient-to-r from-emerald-600 to-teal-400',
      barPct:    problemsSolved > 0 ? accuracy : 0,
      trend:     problemsSolved === 0 ? 'No attempts yet' :
                 accuracy >= 80 ? '↑ Excellent!'          :
                 accuracy >= 60 ? '↑ Good progress'       :
                 accuracy >= 40 ? '↓ Keep practicing'     : '↓ Needs work',
      trendUp:   accuracy >= 60 && problemsSolved > 0,
    },
    {
      key:       'examScore',
      icon:      TrendingUp,
      value:     examDisplay,
      unit:      examUnit,
      gradient:  'from-accent-500 to-cyan-400',
      glow:      'rgba(6,182,212,0.15)',
      ring:      'border-accent-500/20',
      iconBg:    'bg-accent-500/15',
      iconColor: 'text-accent-400',
      barColor:  'bg-gradient-to-r from-accent-600 to-cyan-400',
      barPct:    latestExamScore !== null ? Math.round((latestExamScore / latestExamMax) * 100) : 0,
      trend:     latestExamScore !== null
                   ? `${Math.round((latestExamScore / latestExamMax) * 100)}% score`
                   : 'Take a mock exam',
      trendUp:   latestExamScore !== null ? latestExamScore / latestExamMax >= 0.6 : null,
    },
  ];

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-dark-border bg-dark-card p-5 animate-pulse">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 bg-dark-muted rounded-xl" />
              <div className="w-20 h-6 bg-dark-muted rounded-lg" />
            </div>
            <div className="h-9 w-24 bg-dark-muted rounded-lg mb-1.5" />
            <div className="h-3 w-16 bg-dark-muted rounded mb-4" />
            <div className="h-1.5 w-full bg-dark-muted rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map(({ key, icon: Icon, value, unit, gradient, glow, ring, iconBg, iconColor, barColor, barPct, trend, trendUp }, idx) => (
        <div
          key={key}
          className={`relative overflow-hidden rounded-2xl border ${ring} bg-dark-card p-5 group
                      hover:border-opacity-40 transition-all duration-300 card-enter`}
          style={{
            animationDelay: `${idx * 60}ms`,
            boxShadow: `0 0 0 1px transparent`,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${glow}, 0 0 0 1px transparent`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 1px transparent`; }}
        >
          {/* Top gradient accent line */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

          {/* Background glow */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: glow }}
          />

          <div className="relative">
            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} className={iconColor} />
              </div>
              {trend && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  trendUp === true  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                  trendUp === false ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'             :
                                      'bg-dark-muted text-slate-500'
                }`}>
                  {trend}
                </span>
              )}
            </div>

            {/* Value */}
            <div className="flex items-end gap-1.5 mb-0.5">
              <span className="text-3xl font-black text-white tracking-tight">{value}</span>
              {unit && <span className="text-sm text-slate-500 mb-1">{unit}</span>}
            </div>
            <p className="text-xs text-slate-500 mb-4">{t(`dashboard.${key}`)}</p>

            {/* Progress bar */}
            <div className="h-1 w-full bg-dark-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${barPct}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
