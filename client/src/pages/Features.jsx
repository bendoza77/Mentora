import { Link } from 'react-router-dom';
import StaticLayout from '../components/layout/StaticLayout';
import useInView from '../hooks/useInView';
import useSEO from '../hooks/useSEO';
import {
  BrainCircuit, Target, BarChart3, ClipboardCheck, Zap, Globe,
  ArrowRight, CheckCircle2, Sparkles, BookOpen, Clock, Trophy,
  TrendingUp, Shield, Layers, MessageSquare, ChevronRight
} from 'lucide-react';

/* ── animation helpers ── */
const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const revealLeft = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(-22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const revealRight = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const scaleIn = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'scale(1)' : 'scale(0.88)',
  transition: `opacity 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
});

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Personal Tutor',
    badge: 'Most Loved',
    badgeColor: 'text-primary-300 bg-primary-500/10 border-primary-500/20',
    desc: 'Ask anything. Get step-by-step explanations tailored to your level — not just the answer, but the reasoning behind it. Available 24/7, never impatient.',
    bullets: ['Explains every step in plain language', 'Adapts complexity to your current level', 'Supports Georgian and English', 'References prior mistakes to build context'],
    grad: 'from-primary-600/15 to-transparent', border: 'border-primary-500/25',
    iconGrad: 'from-primary-600 to-primary-400', glow: 'shadow-primary-600/30', color: 'text-primary-400', tag: 'AI Tutor',
  },
  {
    icon: ClipboardCheck, title: 'Exam Simulation', badge: 'ENT Ready',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Real exam conditions. Real ENT-aligned questions. Timed sessions that mirror the actual national exam format so exam day feels familiar, not terrifying.',
    bullets: ['Full-length & mini mock exams', 'Real ENT format & question types', 'Timed with smart pause controls', 'Instant review after every session'],
    grad: 'from-emerald-600/12 to-transparent', border: 'border-emerald-500/20',
    iconGrad: 'from-emerald-600 to-emerald-400', glow: 'shadow-emerald-500/25', color: 'text-emerald-400', tag: 'Exam Sim',
  },
  {
    icon: BarChart3, title: 'Smart Analytics', badge: 'Data-Driven',
    badgeColor: 'text-accent-300 bg-accent-500/10 border-accent-500/20',
    desc: 'Stop studying randomly. See exactly where you lose marks — down to the sub-topic — and get a prioritised action plan to fix it fast.',
    bullets: ['Topic-by-topic score breakdown', 'Score trajectory over time', 'Predicted exam score range', 'Weekly progress reports'],
    grad: 'from-accent-500/12 to-transparent', border: 'border-accent-500/20',
    iconGrad: 'from-accent-500 to-cyan-400', glow: 'shadow-accent-500/25', color: 'text-accent-400', tag: 'Analytics',
  },
  {
    icon: Target, title: 'Weakness Detection', badge: 'Precision AI',
    badgeColor: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
    desc: 'Our AI reads every answer — right and wrong — to detect hidden patterns in your mistakes. Fix the root cause, not just the symptom.',
    bullets: ['Identifies error patterns automatically', 'Classifies mistakes by type', 'Custom remediation exercises', 'Tracks improvement after practice'],
    grad: 'from-rose-500/12 to-transparent', border: 'border-rose-500/20',
    iconGrad: 'from-rose-600 to-rose-400', glow: 'shadow-rose-500/25', color: 'text-rose-400', tag: 'Weakness AI',
  },
  {
    icon: Layers, title: 'Adaptive Practice', badge: 'Personalised',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    desc: "The problem bank adjusts to you. Easy where you're strong, harder where you're weak. Every session is optimised for maximum score gain.",
    bullets: ['10,000+ hand-curated ENT problems', 'Difficulty adapts in real-time', 'Spaced repetition for retention', 'Category filtering by topic'],
    grad: 'from-amber-500/12 to-transparent', border: 'border-amber-500/20',
    iconGrad: 'from-amber-500 to-yellow-400', glow: 'shadow-amber-500/25', color: 'text-amber-400', tag: 'Practice',
  },
  {
    icon: Globe, title: 'Georgian ENT Aligned', badge: 'Local First',
    badgeColor: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
    desc: 'Built specifically for the Georgian national exam. Every problem, explanation, and curriculum map reflects the actual ENT structure.',
    bullets: ['Mapped to official ENT curriculum', 'Designed with 8-year ENT examiner', 'Georgian language support', 'Annual updates as curriculum evolves'],
    grad: 'from-violet-500/12 to-transparent', border: 'border-violet-500/20',
    iconGrad: 'from-violet-600 to-violet-400', glow: 'shadow-violet-500/25', color: 'text-violet-400', tag: 'ENT',
  },
];

const STATS = [
  { val: '10,000+', label: 'Practice Problems', icon: BookOpen, color: 'text-primary-400' },
  { val: '24/7', label: 'AI Availability', icon: Clock, color: 'text-accent-400' },
  { val: '+34 pts', label: 'Avg. Score Gain', icon: TrendingUp, color: 'text-emerald-400' },
  { val: '98%', label: 'Student Satisfaction', icon: Trophy, color: 'text-amber-400' },
];

const DEEP_DIVES = [
  {
    tag: 'AI Tutor · Deep Dive', tagColor: 'text-primary-400',
    headline: 'An AI That Teaches, Not Just Answers',
    body: 'Most apps give you the answer and move on. Mentora AI shows you every step — why this method, why this formula, why this reasoning. It adapts to your specific confusion.',
    sub: 'When you get stuck, the AI asks guiding questions to help you arrive at the answer yourself — building genuine understanding that sticks on exam day.',
    iconGrad: 'from-primary-600 to-primary-400', icon: MessageSquare,
    points: ['Socratic teaching method', 'Explains in your language', 'Remembers your past mistakes', 'No judgement, infinite patience'],
    side: 'right', bg: '',
  },
  {
    tag: 'Analytics · Deep Dive', tagColor: 'text-accent-400',
    headline: 'Know Exactly What to Study Next',
    body: "Don't waste time on topics you already know. Mentora AI's analytics engine shows you a ranked list of weaknesses — the topics where fixing them earns the most points.",
    sub: 'The score predictor models your trajectory against thousands of past ENT students to give you a realistic exam-day estimate.',
    iconGrad: 'from-accent-500 to-cyan-400', icon: BarChart3,
    points: ['Heatmap of weak sub-topics', 'Score prediction model', 'Study time recommendations', 'Progress vs. target tracking'],
    side: 'left', bg: 'bg-dark-surface/30',
  },
];

export default function Features() {
  useSEO({
    title: 'Features — AI Tutoring, Exam Simulation & Smart Practice',
    description: 'Discover all Mentora AI features: AI-powered math tutoring, realistic ENT exam simulations, personalized practice, weakness analytics, and step-by-step solutions.',
    path: '/features',
  });
  const hero    = useInView();
  const stats   = useInView();
  const grid    = useInView();
  const trust   = useInView();
  const cta     = useInView();
  const deep0   = useInView();
  const deep1   = useInView();
  const deepRefs = [deep0, deep1];

  return (
    <StaticLayout breadcrumb="Features">

      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-600/8 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <div style={reveal(hero.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="animate-pulse" />
            Everything you need to ace the ENT
          </div>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Powerful Features,
            <br />
            <span className="gradient-text">Built for Real Results</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Six core tools working together — AI tutoring, smart practice, real exam simulation, and precision analytics — designed for Georgian national exam prep.
          </p>
          <div style={reveal(hero.inView, 240)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/25">
              Try All Features Free <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-primary-500/30 text-primary-400 font-semibold hover:bg-primary-500/10 transition-colors">
              See Pricing <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-dark-border bg-dark-surface/40 py-10">
        <div ref={stats.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ val, label, icon: Icon, color }, i) => (
              <div key={label} style={scaleIn(stats.inView, i * 70)} className="flex flex-col items-center text-center gap-2">
                <Icon size={20} className={color} />
                <div className="text-3xl font-extrabold gradient-text">{val}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid ── */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div ref={grid.ref} className="text-center mb-16">
            <span style={reveal(grid.inView, 0)} className="text-xs font-semibold text-accent-400 uppercase tracking-widest mb-4 block">All Features</span>
            <h2 style={reveal(grid.inView, 80)} className="text-4xl font-extrabold text-white">Six Tools. One Mission.</h2>
            <p style={reveal(grid.inView, 160)} className="text-slate-400 mt-3 max-w-xl mx-auto">Every feature was designed with one question: will this help students score higher on the ENT?</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, badge, badgeColor, desc, bullets, grad, border, iconGrad, glow, color, tag }, i) => (
              <div
                key={title}
                style={reveal(grid.inView, i * 90)}
                className={`group relative rounded-2xl border p-7 bg-gradient-to-br overflow-hidden card-hover flex flex-col ${grad} ${border}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{tag}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>{badge}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 ${iconGrad} ${glow}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2 mt-auto">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 size={13} className={`${color} shrink-0 mt-0.5`} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-current to-transparent ${color}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deep-Dive Sections ── */}
      {DEEP_DIVES.map(({ tag, tagColor, headline, body, sub, iconGrad, icon: Icon, points, side, bg }, dIdx) => {
        const { ref, inView } = deepRefs[dIdx];
        return (
          <section key={headline} className={`py-24 ${bg}`}>
            <div ref={ref} className="max-w-6xl mx-auto px-6">
              <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
                <div style={side === 'left' ? revealRight(inView, 0) : revealLeft(inView, 0)} className={side === 'left' ? 'lg:order-2' : ''}>
                  <span className={`text-xs font-semibold uppercase tracking-widest mb-4 block ${tagColor}`}>{tag}</span>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-5 leading-tight">{headline}</h2>
                  <p className="text-slate-400 leading-relaxed mb-4">{body}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">{sub}</p>
                  <ul className="space-y-3">
                    {points.map((p, pi) => (
                      <li key={p} style={reveal(inView, pi * 60 + 100)} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                        <span className="text-sm text-slate-300">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={side === 'left' ? revealLeft(inView, 80) : revealRight(inView, 80)} className={side === 'left' ? 'lg:order-1' : ''}>
                  <div className="relative rounded-2xl border border-dark-border bg-dark-card p-8 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${iconGrad} opacity-5`} />
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconGrad} flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                      <Icon size={30} className="text-white" />
                    </div>
                    <div className="space-y-3">
                      {points.map((p, pi) => (
                        <div key={p} style={reveal(inView, pi * 60 + 200)} className="flex items-center gap-3 p-3 rounded-xl bg-dark-surface/60 border border-dark-border">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={11} className="text-emerald-400" />
                          </div>
                          <span className="text-xs text-slate-300">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Trust strip ── */}
      <section className="py-16 border-y border-dark-border">
        <div ref={trust.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Your data stays yours. We never sell student data to third parties.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { icon: Zap, title: 'Always Improving', desc: 'New problems, features, and AI improvements ship every two weeks.', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
              { icon: Globe, title: 'Access Anywhere', desc: 'Works on phone, tablet, and desktop. Study on your commute or at your desk.', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
            ].map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} style={reveal(trust.inView, i * 80)} className={`rounded-2xl border p-6 ${bg} flex items-start gap-4`}>
                <Icon size={20} className={`${color} shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-900/20 to-dark-bg">
        <div ref={cta.ref} className="max-w-3xl mx-auto px-6 text-center">
          <h2 style={reveal(cta.inView, 0)} className="text-4xl font-extrabold text-white mb-4">Ready to Use Every Feature?</h2>
          <p style={reveal(cta.inView, 80)} className="text-slate-400 mb-8 text-lg">Free plan includes AI Tutor, practice problems, and analytics. No credit card required.</p>
          <div style={reveal(cta.inView, 160)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/25">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-primary-500/30 text-primary-400 font-semibold hover:bg-primary-500/10 transition-colors">
              See Pricing Plans
            </Link>
          </div>
          <p style={reveal(cta.inView, 240)} className="text-slate-600 text-xs mt-4">No credit card · Cancel anytime · Georgian & English</p>
        </div>
      </section>

    </StaticLayout>
  );
}
