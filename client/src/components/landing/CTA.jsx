import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-bg to-dark-bg" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-primary-600/15 blur-[80px] rounded-full" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[300px] h-[250px] bg-accent-500/10 blur-[70px] rounded-full" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
          <Sparkles size={14} />
          Start Your Journey
        </div>

        <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          {t('cta.headline')}
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('cta.subheadline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button variant="gradient" size="xl" iconRight={<ArrowRight size={20} />}>
              {t('cta.btn')}
            </Button>
          </Link>
        </div>
        <p className="text-slate-600 text-sm mt-6">{t('cta.sub')}</p>

        {/* Social proof row */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { label: 'Georgian Schools', val: '40+' },
            { label: 'Avg. Score Increase', val: '+34 pts' },
            { label: 'Student Rating', val: '4.9 ★' },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">{val}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
