import { useTranslation } from 'react-i18next';
import { ScanSearch, BrainCircuit, ClipboardCheck, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    key: 'step1',
    icon: ScanSearch,
    gradient: 'from-primary-600 to-primary-400',
    glow: 'shadow-primary-600/30',
  },
  {
    num: '02',
    key: 'step2',
    icon: BrainCircuit,
    gradient: 'from-accent-500 to-accent-400',
    glow: 'shadow-accent-500/30',
  },
  {
    num: '03',
    key: 'step3',
    icon: ClipboardCheck,
    gradient: 'from-emerald-600 to-emerald-400',
    glow: 'shadow-emerald-500/30',
  },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-6">
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            {t('howItWorks.headline')}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary-600 via-accent-500 to-emerald-500 opacity-30" />

          {STEPS.map(({ num, key, icon: Icon, gradient, glow }, index) => (
            <div key={key} className="relative flex flex-col items-center text-center group">
              {/* Step number */}
              <span className="text-xs font-mono text-slate-600 mb-4">{num}</span>

              {/* Icon circle */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-xl ${glow} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} className="text-white" />
                {/* Ping effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {t(`howItWorks.${key}Title`)}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
                {t(`howItWorks.${key}Desc`)}
              </p>

              {/* Arrow between steps */}
              {index < STEPS.length - 1 && (
                <ArrowRight
                  size={20}
                  className="hidden md:block absolute -right-4 top-16 text-slate-700 z-10"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
