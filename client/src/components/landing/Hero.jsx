import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, TrendingUp, Users, BookOpen, Target } from 'lucide-react';
import Button from '../ui/Button';

const STATS = [
  { key: 'stat1', value: '12,400+', icon: Users, color: 'text-primary-400' },
  { key: 'stat2', value: '890K+', icon: BookOpen, color: 'text-accent-400' },
  { key: 'stat3', value: '+34%', icon: TrendingUp, color: 'text-emerald-400' },
  { key: 'stat4', value: '240+', icon: Target, color: 'text-amber-400' },
];

const FloatingCard = ({ className, children }) => (
  <div className={`absolute glass rounded-2xl px-4 py-3 shadow-2xl border border-primary-500/20 ${className}`}>
    {children}
  </div>
);

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/40 to-dark-bg" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-500/8 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/15 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="animate-pulse" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {t('hero.headline')}
            <br />
            <span className="gradient-text">{t('hero.headlineAccent')}</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-10">
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/register">
              <Button variant="gradient" size="lg" iconRight={<ArrowRight size={18} />}>
                {t('hero.cta')}
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              icon={<Play size={16} className="fill-current" />}
  
              onClick={() => document.getElementById('aiDemo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.watchDemo')}
            </Button>
          </div>
          

          <p className="text-xs text-slate-600 mb-10">{t('hero.ctaSub')}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ key, value, icon: Icon, color }) => (
              <div key={key} className="text-center">
                <Icon size={18} className={`${color} mx-auto mb-1`} />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t(`hero.${key}`)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Main card */}
          <div className="relative w-full max-w-sm animate-float">
            <div className="glass rounded-3xl p-6 border border-primary-500/20 shadow-2xl glow-primary">
              {/* AI Tutor Preview */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Mentora AI</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse-glow" />
                    Online
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-primary-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[220px]">
                    ამოხსენი: x² - 5x + 6 = 0
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-sm p-3 text-sm text-slate-200 max-w-[220px]">
                    <p className="font-medium text-primary-300 mb-1">ნაბიჯი 1:</p>
                    <p className="text-slate-300 text-xs">კვადრატული ფორმულა: x = (-b ± √Δ) / 2a</p>
                    <div className="math-block text-xs mt-2 p-2">Δ = 25 - 24 = 1</div>
                    <p className="text-emerald-400 text-xs font-semibold mt-2">x₁=2, x₂=3 ✓</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5 pt-4 border-t border-dark-border">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>ყოველდღიური პროგრესი</span>
                  <span className="text-primary-400">4/5</span>
                </div>
                <div className="w-full h-1.5 bg-dark-muted rounded-full overflow-hidden">
                  <div className="progress-bar h-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <FloatingCard className="-top-8 -left-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">ქულის ამაღლება</p>
                <p className="text-sm font-bold text-emerald-400">+42 ქულა</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="-bottom-6 -right-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Target size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">სერია</p>
                <p className="text-sm font-bold text-amber-400">🔥 12 დღე</p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none" />
    </section>
  );
}
