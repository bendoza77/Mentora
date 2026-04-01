import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import {
  BookOpen, ChevronRight, Sparkles, RotateCcw, Check, X,
  Calculator, Triangle, Sigma, BarChart2, Dices,
  Infinity, TrendingUp, ArrowRight, Zap,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import clsx from 'clsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const TOPICS = [
  {
    name: 'Algebra',
    icon: Calculator,
    color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/20',
    glow: 'rgba(139,92,246,0.15)', accent: '#8b5cf6',
    desc: 'Equations, inequalities, systems',
  },
  {
    name: 'Geometry',
    icon: Triangle,
    color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/20',
    glow: 'rgba(6,182,212,0.15)', accent: '#06b6d4',
    desc: 'Shapes, area, proofs',
  },
  {
    name: 'Trigonometry',
    icon: TrendingUp,
    color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20',
    glow: 'rgba(16,185,129,0.15)', accent: '#10b981',
    desc: 'Angles, sin/cos/tan, identities',
  },
  {
    name: 'Calculus',
    icon: Sigma,
    color: 'text-primary-400', bg: 'bg-primary-500/15', border: 'border-primary-500/20',
    glow: 'rgba(124,58,237,0.15)', accent: '#7c3aed',
    desc: 'Derivatives, integrals, limits',
  },
  {
    name: 'Statistics',
    icon: BarChart2,
    color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20',
    glow: 'rgba(245,158,11,0.15)', accent: '#f59e0b',
    desc: 'Mean, variance, distributions',
  },
  {
    name: 'Probability',
    icon: Dices,
    color: 'text-pink-400', bg: 'bg-pink-500/15', border: 'border-pink-500/20',
    glow: 'rgba(236,72,153,0.15)', accent: '#ec4899',
    desc: 'Events, combinations, Bayes',
  },
  {
    name: 'Functions',
    icon: Infinity,
    color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/20',
    glow: 'rgba(249,115,22,0.15)', accent: '#f97316',
    desc: 'Domain, range, transformations',
  },
  {
    name: 'Quadratics',
    icon: Zap,
    color: 'text-accent-400', bg: 'bg-accent-500/15', border: 'border-accent-500/20',
    glow: 'rgba(6,182,212,0.15)', accent: '#06b6d4',
    desc: 'Parabolas, vertex, discriminant',
  },
];

const SAMPLE_PROBLEM = {
  text: 'If f(x) = x² - 4x + 4, find the vertex of the parabola.',
  options: ['(2, 0)', '(-2, 0)', '(0, 4)', '(4, 0)'],
  correct: 0,
  topic: 'Quadratics',
  difficulty: 'medium',
};

export default function Practice() {
  usePageTitle('Practice');
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [topicMap, setTopicMap] = useState({});

  useEffect(() => {
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && d.data.topicBreakdown) {
          const map = {};
          d.data.topicBreakdown.forEach(({ name, problems, accuracy, status }) => {
            map[name] = { problems, accuracy, status };
          });
          setTopicMap(map);
        }
      })
      .catch(() => {});
  }, []);

  const reset = () => { setSelected(null); setRevealed(false); };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="slide-down">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Study Mode</p>
          <h1 className="text-2xl font-black text-white tracking-tight">{t('nav.practice')}</h1>
          <p className="text-sm text-slate-400 mt-1">Pick a topic or jump into a quick problem.</p>
        </div>

        {/* ── Quick problem + Topic grid ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Quick Problem Card — 2 cols */}
          <div className="lg:col-span-2 slide-from-left">
            <div className="relative overflow-hidden rounded-2xl border border-primary-500/25
                            bg-gradient-to-br from-primary-600/10 via-dark-card to-violet-600/8 p-5 h-full">
              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12),transparent_70%)]" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/20
                                    flex items-center justify-center">
                      <BookOpen size={14} className="text-primary-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Quick Problem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-primary-600/20 text-primary-300 border border-primary-500/20">
                      {SAMPLE_PROBLEM.topic}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {SAMPLE_PROBLEM.difficulty}
                    </span>
                  </div>
                </div>

                {/* Problem text */}
                <div className="font-mono text-sm text-primary-200 bg-primary-600/8 border border-primary-500/15
                                rounded-xl px-4 py-3.5 mb-5 leading-relaxed">
                  {SAMPLE_PROBLEM.text}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {SAMPLE_PROBLEM.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { if (!revealed) setSelected(i); }}
                      className={clsx(
                        'relative px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 active:scale-95',
                        revealed && i === SAMPLE_PROBLEM.correct
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : revealed && i === selected && i !== SAMPLE_PROBLEM.correct
                          ? 'bg-red-500/15 border-red-500/40 text-red-400'
                          : selected === i
                          ? 'bg-primary-600/20 border-primary-500/50 text-white ring-1 ring-primary-500/30'
                          : 'bg-dark-card/80 border-dark-border text-slate-300 hover:border-primary-500/30 hover:bg-primary-600/8'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs opacity-60">{String.fromCharCode(65+i)}.</span>
                        <span>{opt}</span>
                        {revealed && i === SAMPLE_PROBLEM.correct && (
                          <Check size={14} className="text-emerald-400 ml-auto" />
                        )}
                        {revealed && i === selected && i !== SAMPLE_PROBLEM.correct && (
                          <X size={14} className="text-red-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                  {!revealed ? (
                    <button
                      disabled={selected === null}
                      onClick={() => setRevealed(true)}
                      className={clsx(
                        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95',
                        selected === null
                          ? 'bg-dark-muted text-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-600 to-violet-600 text-white hover:from-primary-500 hover:to-violet-500 hover:shadow-lg hover:shadow-primary-600/25'
                      )}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <>
                      <Link to="/tutor" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                                           bg-primary-600/15 text-primary-400 border border-primary-500/20
                                           hover:bg-primary-600/25 transition-all active:scale-95">
                          <Sparkles size={13} /> Explain with AI
                        </button>
                      </Link>
                      <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                   text-slate-400 bg-dark-card border border-dark-border
                                   hover:text-white hover:border-primary-500/30 transition-all active:scale-95"
                      >
                        <RotateCcw size={13} /> Next
                      </button>
                    </>
                  )}
                </div>

                {/* Tip after reveal */}
                {revealed && (
                  <div className="mt-4 p-3 rounded-xl bg-accent-500/8 border border-accent-500/20 text-xs text-accent-300 leading-relaxed">
                    <span className="font-bold">💡 Tip · </span>
                    The vertex of f(x) = x² - 4x + 4 = (x-2)² is at x = 2, y = 0, so vertex = (2, 0).
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Topic Grid — 3 cols */}
          <div className="lg:col-span-3 slide-from-right" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Practice by Topic</h2>
              <span className="text-xs text-slate-500">{TOPICS.length} topics available</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {TOPICS.map(({ name, icon: Icon, color, bg, border, glow, accent, desc }, i) => {
                const info   = topicMap[name];
                const solved = info?.problems ?? 0;
                const acc    = info?.accuracy ?? null;
                const status = info?.status ?? null;

                return (
                  <Link to="/exam" key={name}>
                    <div
                      className={`card-enter relative overflow-hidden rounded-2xl border ${border} bg-dark-card p-4
                                  cursor-pointer group transition-all duration-300 h-full`}
                      style={{ animationDelay: `${i * 45}ms` }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 0 25px ${glow}`;
                        e.currentTarget.style.borderColor = `${accent}44`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      {/* Glow blob */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: glow }} />

                      <div className="relative">
                        {/* Icon + arrow */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center
                                           group-hover:scale-110 transition-transform duration-200`}>
                            <Icon size={17} className={color} />
                          </div>
                          <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>

                        {/* Topic name */}
                        <h3 className="text-sm font-bold text-white mb-0.5">{name}</h3>
                        <p className="text-[11px] text-slate-600 mb-3 leading-tight">{desc}</p>

                        {/* Stats */}
                        {solved > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500">
                                <span className="text-white font-bold">{solved}</span> solved
                              </span>
                              {acc !== null && (
                                <span className={`text-[11px] font-black ${
                                  acc >= 75 ? 'text-emerald-400' :
                                  acc >= 60 ? 'text-amber-400'   : 'text-red-400'
                                }`}>{acc}%</span>
                              )}
                            </div>
                            {acc !== null && (
                              <div className="h-1 w-full bg-dark-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    acc >= 75 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                                    acc >= 60 ? 'bg-gradient-to-r from-amber-600 to-amber-400'     :
                                               'bg-gradient-to-r from-red-700 to-red-500'
                                  }`}
                                  style={{ width: `${acc}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-600 font-medium">Not started yet</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-dark-border
                        bg-gradient-to-r from-dark-card via-dark-card to-primary-600/8 p-5
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(124,58,237,0.08),transparent_60%)]" />
          <div className="relative">
            <p className="text-sm font-bold text-white mb-0.5">Need a deeper explanation?</p>
            <p className="text-xs text-slate-500">Ask the AI Tutor to walk you through any topic step by step.</p>
          </div>
          <div className="relative flex gap-2.5 shrink-0">
            <Link to="/tutor">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                                 bg-gradient-to-r from-primary-600 to-violet-600
                                 hover:from-primary-500 hover:to-violet-500
                                 hover:shadow-lg hover:shadow-primary-600/25
                                 active:scale-95 transition-all">
                <Sparkles size={14} /> Ask AI Tutor
              </button>
            </Link>
            <Link to="/exam">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                 text-slate-300 bg-dark-surface border border-dark-border
                                 hover:border-primary-500/30 hover:text-white
                                 active:scale-95 transition-all">
                Take a Mock Exam <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
