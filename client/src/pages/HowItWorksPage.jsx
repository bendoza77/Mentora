import { Link } from 'react-router-dom';
import StaticLayout from '../components/layout/StaticLayout';
import useInView from '../hooks/useInView';
import usePageTitle from '../hooks/usePageTitle';
import {
  ScanSearch, BrainCircuit, ClipboardCheck, ArrowRight, Sparkles,
  CheckCircle2, ChevronDown, Zap, BarChart3, Target, Clock,
  MessageSquare, TrendingUp, BookOpen
} from 'lucide-react';
import { useState } from 'react';

/* ── animation helpers ── */
const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const revealLeft = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(-24px)',
  transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
});
const revealRight = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(24px)',
  transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
});
const scaleIn = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'scale(1)' : 'scale(0.88)',
  transition: `opacity 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
});

const STEPS = [
  {
    num: '01', icon: ScanSearch,
    title: 'Diagnose Your Starting Point', subtitle: '5-minute smart placement',
    desc: "Answer a short diagnostic test. Our AI analyses your results across every ENT topic area and builds a personal gap map — showing exactly where you're strong and where you're losing marks.",
    detail: "Most students discover 2–3 topic areas they've been neglecting without realising it. The diagnosis removes guesswork from day one.",
    grad: 'from-primary-600 to-primary-400', glow: 'shadow-primary-600/30',
    border: 'border-primary-500/25', bg: 'from-primary-600/10 to-transparent', color: 'text-primary-400',
    bullets: ['Covers all ENT math topic areas', 'Takes 5–10 minutes', 'No prior preparation needed', 'Generates personalised study plan instantly'],
    stat: { val: '5 min', label: 'Setup Time' },
  },
  {
    num: '02', icon: BrainCircuit,
    title: 'Practice with AI by Your Side', subtitle: 'Guided learning, every session',
    desc: 'Work through adaptive practice problems. When you get stuck, ask the AI — it explains the reasoning step by step, without just handing you the answer.',
    detail: 'The AI remembers your previous errors and patterns. If you struggle with quadratic inequalities, it will keep weaving them in until you\'ve mastered them.',
    grad: 'from-accent-500 to-cyan-400', glow: 'shadow-accent-500/30',
    border: 'border-accent-500/25', bg: 'from-accent-500/10 to-transparent', color: 'text-accent-400',
    bullets: ['10,000+ ENT-aligned practice problems', 'AI explains every wrong answer', 'Difficulty adjusts based on performance', 'Ask follow-up questions in Georgian or English'],
    stat: { val: '24/7', label: 'Available' },
  },
  {
    num: '03', icon: ClipboardCheck,
    title: 'Simulate Real Exam Conditions', subtitle: 'Full mock exams & review',
    desc: 'Take timed mock exams that mirror the real ENT format. Review every answer afterward with detailed AI explanations. Watch your score climb session by session.',
    detail: 'Students who take at least 3 full mocks before the ENT score an average of 34 points higher than those who only practice without simulated exams.',
    grad: 'from-emerald-600 to-emerald-400', glow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/25', bg: 'from-emerald-500/10 to-transparent', color: 'text-emerald-400',
    bullets: ['Timed sessions matching real ENT duration', 'Real ENT question formats and scoring', 'Detailed review with AI explanations', 'Score trend charts over time'],
    stat: { val: '+34 pts', label: 'Avg. Score Gain' },
  },
];

const FAQS = [
  { q: 'How is Mentora AI different from watching YouTube tutorials?', a: "YouTube is passive — you watch, but you don't know if you actually understood. Mentora AI is active: it asks you to solve problems, detects where you go wrong, and teaches the specific things you're missing." },
  { q: 'How long does it take to see results?', a: 'Most students report feeling more confident within the first week. Score improvement shows up in mock exams after 2–4 weeks of consistent practice (30–45 min/day).' },
  { q: 'Do I need to be good at math to start?', a: 'No. The diagnostic will place you at your current level and build from there. Whether you\'re starting from scratch or fine-tuning a near-perfect score, the system adapts to you.' },
  { q: 'Is it in Georgian?', a: 'Yes — fully. All problems, AI explanations, and the UI are available in Georgian. You can switch between Georgian and English at any time.' },
  { q: 'Can I use it on my phone?', a: 'Absolutely. Mentora AI is fully responsive and works on any device — phone, tablet, or laptop. Most students practice during commutes on their phone.' },
  { q: "What if the AI gives me a wrong explanation?", a: "Our AI is trained specifically on ENT math content and reviewed by our Chief Curriculum Officer — an 8-year ENT examiner. If you ever spot an issue, you can flag it and our team reviews it within 24 hours." },
];

const TIMELINE = [
  { week: 'Day 1', action: 'Complete diagnostic & get your personal study plan', icon: Target, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { week: 'Week 1', action: 'Work through priority weaknesses with AI Tutor', icon: BrainCircuit, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { week: 'Week 2–3', action: 'Build speed with adaptive timed practice sets', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { week: 'Week 4', action: 'Take first full mock exam & review with AI', icon: ClipboardCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { week: 'Monthly', action: 'Track score trends, update plan, repeat cycle', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

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

export default function HowItWorksPage() {
  usePageTitle('How It Works');
  const hero     = useInView();
  const step0    = useInView();
  const step1    = useInView();
  const step2    = useInView();
  const timeline = useInView();
  const faq      = useInView();
  const strip    = useInView();
  const cta      = useInView();
  const stepRefs = [step0, step1, step2];

  return (
    <StaticLayout breadcrumb="How It Works">

      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent-500/7 blur-[120px] rounded-full pointer-events-none" />
        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <div style={reveal(hero.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="animate-pulse" />
            Simple. Structured. Proven.
          </div>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            From First Login to
            <br />
            <span className="gradient-text">Higher Exam Score</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Three steps. No guesswork. A system that thousands of Georgian students have used to close the gap between where they are and where they need to be.
          </p>
          <div style={reveal(hero.inView, 240)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/25">
              Start for Free <ArrowRight size={18} />
            </Link>
          </div>
          <p style={reveal(hero.inView, 300)} className="text-slate-600 text-xs mt-4">No credit card · Takes 2 minutes to set up</p>
        </div>
      </section>

      {/* ── 3 Steps ── */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-accent-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 space-y-24">
          {STEPS.map(({ num, icon: Icon, title, subtitle, desc, detail, grad, glow, border, bg, color, bullets, stat }, i) => {
            const { ref, inView } = stepRefs[i];
            const isEven = i % 2 === 1;
            return (
              <div key={num} ref={ref} className={`grid lg:grid-cols-2 gap-12 items-center`}>
                {/* Text */}
                <div style={isEven ? revealRight(inView, 0) : revealLeft(inView, 0)} className={isEven ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-mono text-slate-600 bg-dark-surface px-2.5 py-1 rounded-lg border border-dark-border">{num}</span>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${color}`}>{subtitle}</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">{title}</h2>
                  <p className="text-slate-400 leading-relaxed mb-3">{desc}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">{detail}</p>
                  <ul className="space-y-2.5">
                    {bullets.map((b, bi) => (
                      <li key={b} style={reveal(inView, bi * 60 + 100)} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className={`${color} shrink-0 mt-0.5`} />
                        <span className="text-sm text-slate-300">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual card */}
                <div style={isEven ? revealLeft(inView, 80) : revealRight(inView, 80)} className={isEven ? 'lg:order-1' : ''}>
                  <div className={`relative rounded-2xl border ${border} bg-gradient-to-br ${bg} bg-dark-card p-8 overflow-hidden`}>
                    <span className="absolute top-4 right-6 text-7xl font-black text-white/3 select-none">{num}</span>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-6 shadow-xl ${glow} animate-pulse-glow`}>
                      <Icon size={30} className="text-white" />
                    </div>
                    <div className="space-y-2.5 mb-6">
                      {bullets.map((b, bi) => (
                        <div key={b} style={reveal(inView, bi * 60 + 200)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-surface/70 border border-dark-border">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${grad} shrink-0`} />
                          <span className="text-xs text-slate-300">{b}</span>
                        </div>
                      ))}
                    </div>
                    <div style={scaleIn(inView, 350)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${border} bg-dark-surface/50`}>
                      <span className={`text-xl font-black ${color}`}>{stat.val}</span>
                      <span className="text-xs text-slate-500">{stat.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Study Timeline ── */}
      <section className="py-24 bg-dark-surface/30 border-y border-dark-border">
        <div className="max-w-4xl mx-auto px-6">
          <div ref={timeline.ref}>
            <div className="text-center mb-16">
              <span style={reveal(timeline.inView, 0)} className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 block">Your Journey</span>
              <h2 style={reveal(timeline.inView, 80)} className="text-3xl lg:text-4xl font-extrabold text-white">What a Typical Study Path Looks Like</h2>
              <p style={reveal(timeline.inView, 160)} className="text-slate-400 mt-3 max-w-xl mx-auto">Most students start seeing score improvements within 2–3 weeks of consistent daily use.</p>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-600 via-accent-500 to-emerald-500 opacity-30" />
              <div className="space-y-6 pl-16">
                {TIMELINE.map(({ week, action, icon: Icon, color, bg }, ti) => (
                  <div key={week} style={revealLeft(timeline.inView, ti * 80 + 200)} className="relative flex items-start gap-5">
                    <div className={`absolute -left-10 w-8 h-8 rounded-full ${bg} border border-dark-border flex items-center justify-center shrink-0`}>
                      <Icon size={14} className={color} />
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-primary-500/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${bg} ${color} border border-current/20`}>{week}</span>
                        <span className="text-sm text-slate-300">{action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24">
        <div ref={faq.ref} className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span style={reveal(faq.inView, 0)} className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4 block">Common Questions</span>
            <h2 style={reveal(faq.inView, 80)} className="text-3xl lg:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>
          <div style={reveal(faq.inView, 160)} className="space-y-3">
            {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── Mini feature strip ── */}
      <section className="py-14 border-t border-dark-border">
        <div ref={strip.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, title: '10,000+ Problems', desc: 'ENT-curated problem bank', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
              { icon: MessageSquare, title: 'AI That Explains', desc: 'Not just answers — reasoning', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
              { icon: Zap, title: 'Results in Weeks', desc: '+34 pts avg. improvement', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            ].map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} style={scaleIn(strip.inView, i * 80)} className={`rounded-2xl border p-5 ${bg} flex items-center gap-4`}>
                <Icon size={20} className={`${color} shrink-0`} />
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-900/20 to-dark-bg">
        <div ref={cta.ref} className="max-w-3xl mx-auto px-6 text-center">
          <h2 style={reveal(cta.inView, 0)} className="text-4xl font-extrabold text-white mb-4">Ready to Start Your Journey?</h2>
          <p style={reveal(cta.inView, 80)} className="text-slate-400 mb-8 text-lg">Your first diagnostic and study plan are completely free.</p>
          <div style={reveal(cta.inView, 160)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/25">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-primary-500/30 text-primary-400 font-semibold hover:bg-primary-500/10 transition-colors">
              Explore Features
            </Link>
          </div>
          <p style={reveal(cta.inView, 240)} className="text-slate-600 text-xs mt-4">Free plan · No card · Georgian & English support</p>
        </div>
      </section>

    </StaticLayout>
  );
}
