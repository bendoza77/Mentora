import { useTranslation } from 'react-i18next';
import { UserX, DollarSign, AlertCircle, Frown } from 'lucide-react';

const PROBLEMS = [
  { key: 'card1', icon: UserX, color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/20', iconColor: 'text-red-400', bg: 'bg-red-500/10' },
  { key: 'card2', icon: DollarSign, color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', iconColor: 'text-orange-400', bg: 'bg-orange-500/10' },
  { key: 'card3', icon: AlertCircle, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', iconColor: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'card4', icon: Frown, color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/20', iconColor: 'text-pink-400', bg: 'bg-pink-500/10' },
];

export default function Problem() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            {t('problem.badge')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('problem.headline')}
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEMS.map(({ key, icon: Icon, color, border, iconColor, bg }) => (
            <div
              key={key}
              className={`relative rounded-2xl border ${border} bg-gradient-to-br ${color} p-6 card-hover overflow-hidden group`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/3 to-transparent" />
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon size={22} className={iconColor} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {t(`problem.${key}Title`)}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t(`problem.${key}Desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Divider with CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Sound familiar?{' '}
            <span className="text-primary-400 font-medium cursor-pointer hover:text-primary-300 transition-colors">
              Mentora AI solves all of this. →
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
