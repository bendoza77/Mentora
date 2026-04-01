import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import OverviewCards from '../components/dashboard/OverviewCards';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  MessageSquare, ClipboardCheck, BarChart3,
  Sparkles, BookOpen, Calendar, ArrowRight, BrainCircuit,
  Target, Zap, ShieldCheck, TrendingUp, Globe, ChevronRight,
  Flame,
} from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const DAILY_GOAL = 5;

const STATUS_COLOR = {
  critical: 'bg-red-500',
  weak:     'bg-amber-500',
  ok:       'bg-amber-400',
  strong:   'bg-emerald-500',
};
const STATUS_TEXT = {
  critical: 'text-red-400',
  weak:     'text-amber-400',
  ok:       'text-amber-300',
  strong:   'text-emerald-400',
};

function generateInsight(stats, todaySolved) {
  if (!stats) return null;
  const { topicBreakdown = [], accuracy = 0, streak = 0, problemsSolved = 0 } = stats;
  const critical = topicBreakdown.find(t => t.status === 'critical');
  if (critical) return `Your accuracy in ${critical.name} is only ${critical.accuracy}% — a critical weak spot. Even one focused 30-minute session here could meaningfully shift your exam score.`;
  const weak = topicBreakdown.filter(t => t.status === 'weak' || t.status === 'critical');
  if (weak.length >= 2) return `You have ${weak.length} topics below 60%: ${weak.slice(0,2).map(t=>t.name).join(' and ')}. Tackling these first gives you the highest return on study time.`;
  if (weak.length === 1) return `${weak[0].name} is your main weak spot at ${weak[0].accuracy}% accuracy. A targeted 20-minute session today could lift your overall score noticeably.`;
  if (streak >= 7) return `You're on a ${streak}-day streak — that's elite consistency. Students who practice daily like you outscore peers who cram by an average of 23%.`;
  if (todaySolved >= DAILY_GOAL) return `Goal hit! You've solved ${todaySolved} problems today. Consider running a timed mock exam to stress-test your knowledge.`;
  if (accuracy >= 80 && problemsSolved >= 20) return `Excellent — ${accuracy}% accuracy across ${problemsSolved} problems. At this level, speed and exam technique are your next frontier.`;
  if (!topicBreakdown.length) return `Take your first exam or practice session and I'll analyse your strengths and weak spots to give you a personalised study plan.`;
  if (topicBreakdown.length > 0) {
    const strongest = topicBreakdown[topicBreakdown.length - 1];
    return `Your strongest topic is ${strongest.name} at ${strongest.accuracy}%. Build on that foundation while dedicating extra time to your weaker areas for a balanced score.`;
  }
  return `Your overall accuracy is ${accuracy}%. Consistent daily practice of 5–10 problems has been shown to improve exam scores by 20%+ within a month.`;
}

function getUpcomingExams() {
  const now  = new Date();
  const year = now.getFullYear();
  const candidates = [
    { name: 'National Math Exam',     month: 5, day: 15 },
    { name: 'National Georgian Exam', month: 5, day: 10 },
    { name: 'National English Exam',  month: 5, day: 20 },
  ];
  return candidates
    .map(({ name, month, day }) => {
      let d = new Date(year, month, day);
      if (d < now) d = new Date(year + 1, month, day);
      const days    = Math.ceil((d - now) / 86400000);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return { name, date: dateStr, days };
    })
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const WHY_MENTORA = [
  { icon: BrainCircuit, title: 'Adaptive AI Tutoring',    desc: 'Our AI identifies exactly where you struggle and crafts personalised explanations in real time.', gradient: 'from-violet-600/12 to-dark-card', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', accent: '#7c3aed' },
  { icon: Target,       title: 'National Exam Focus',      desc: 'Built around the Georgian national math curriculum. Every topic aligns with real exam standards.',    gradient: 'from-cyan-600/12 to-dark-card',   iconBg: 'bg-cyan-500/15',   iconColor: 'text-cyan-400',   accent: '#06b6d4' },
  { icon: Zap,          title: 'Instant Feedback',         desc: 'Get step-by-step solutions and real-time corrections the moment you submit an answer.',             gradient: 'from-amber-600/12 to-dark-card',  iconBg: 'bg-amber-500/15',  iconColor: 'text-amber-400',  accent: '#f59e0b' },
  { icon: TrendingUp,   title: 'Progress Analytics',       desc: 'Visual dashboards track improvement and flag weak spots before they cost you points on exam day.',    gradient: 'from-emerald-600/12 to-dark-card',iconBg: 'bg-emerald-500/15',iconColor: 'text-emerald-400',accent: '#10b981' },
  { icon: ShieldCheck,  title: 'Proven Results',           desc: 'Students using Mentora AI report an average score increase of 23% within 4 weeks of practice.',      gradient: 'from-primary-600/12 to-dark-card',iconBg: 'bg-primary-500/15',iconColor: 'text-primary-400',accent: '#7c3aed' },
  { icon: Globe,        title: 'Georgian & English',       desc: 'Fully bilingual — switch between Georgian and English at any time. Study in your native language.',  gradient: 'from-accent-600/12 to-dark-card', iconBg: 'bg-accent-500/15', iconColor: 'text-accent-400', accent: '#06b6d4' },
];

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { t } = useTranslation();
  const { user } = useAuth();

  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todaySolved   = stats?.weeklyActivity?.[stats.weeklyActivity.length - 1]?.problems ?? 0;
  const todayProgress = Math.min(Math.round((todaySolved / DAILY_GOAL) * 100), 100);
  const upcomingExams = getUpcomingExams();
  const insight       = generateInsight(stats, todaySolved);
  const firstName     = user?.fullname?.split(' ')[0] || 'there';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">

        {/* ── Hero Header ─────────────────────────────────────────────────────── */}
        <div className="slide-down relative overflow-hidden rounded-2xl border border-primary-500/15
                        bg-gradient-to-br from-primary-600/10 via-dark-card to-accent-500/5 p-6 sm:p-7">
          {/* Mesh background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.07),transparent_60%)]" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1">
                {getGreeting()}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-primary-400 via-violet-300 to-accent-400 bg-clip-text text-transparent">
                  {firstName}
                </span>{' '}
                <span className="inline-block animate-float" style={{ animationDuration: '3s' }}>👋</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">{t('dashboard.subtitle')}</p>

              {/* Quick stats row */}
              {!loading && stats && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">{stats.streak} day streak</span>
                  </div>
                  <span className="text-dark-border">·</span>
                  <div className="flex items-center gap-1.5">
                    <Target size={13} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">{stats.accuracy}% accuracy</span>
                  </div>
                  <span className="text-dark-border">·</span>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-primary-400" />
                    <span className="text-xs font-semibold text-primary-400">{stats.problemsSolved} solved</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2.5 sm:flex-col sm:items-end lg:flex-row lg:items-center shrink-0">
              <Link to="/tutor">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                   bg-gradient-to-r from-primary-600 to-violet-600
                                   text-white text-sm font-semibold
                                   hover:from-primary-500 hover:to-violet-500
                                   hover:shadow-lg hover:shadow-primary-600/30
                                   active:scale-95 transition-all duration-200">
                  <Sparkles size={15} />
                  <span className="hidden sm:inline">{t('dashboard.continueSession')}</span>
                  <span className="sm:hidden">AI Tutor</span>
                </button>
              </Link>
              <Link to="/exam">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                   bg-dark-card border border-dark-border
                                   text-slate-300 text-sm font-semibold
                                   hover:border-primary-500/40 hover:text-white hover:bg-dark-surface
                                   active:scale-95 transition-all duration-200">
                  <ClipboardCheck size={15} />
                  <span className="hidden sm:inline">{t('dashboard.startExam')}</span>
                  <span className="sm:hidden">Exam</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ──────────────────────────────────────────────────────── */}
        <OverviewCards
          streak={stats?.streak}
          problemsSolved={stats?.problemsSolved}
          accuracy={stats?.accuracy}
          latestExamScore={stats?.latestExamScore}
          latestExamMax={stats?.latestExamMaxScore}
          loading={loading}
        />

        {/* ── Main Grid ────────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left column — chart + topics */}
          <div className="lg:col-span-2 space-y-5 slide-from-left" style={{ animationDelay: '100ms' }}>
            <ProgressChart weeklyActivity={stats?.weeklyActivity} loading={loading} />

            {/* Topics to review */}
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-white">{t('dashboard.topicsToReview')}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Sorted by lowest accuracy first</p>
                </div>
                <Link to="/analytics">
                  <button className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300
                                     px-3 py-1.5 rounded-lg hover:bg-primary-500/10 transition-all">
                    {t('dashboard.viewAnalytics')} <ArrowRight size={11} />
                  </button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="flex justify-between">
                        <div className="h-3 w-28 bg-dark-muted rounded" />
                        <div className="h-3 w-10 bg-dark-muted rounded" />
                      </div>
                      <div className="w-full h-2 bg-dark-muted rounded-full" />
                    </div>
                  ))}
                </div>
              ) : !stats?.topicBreakdown?.length ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                    <BookOpen size={22} className="text-primary-400/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">No practice data yet</p>
                    <p className="text-xs text-slate-500 mt-0.5">Complete exams to see your topic scores here.</p>
                  </div>
                  <Link to="/exam">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
                                       bg-primary-600/15 text-primary-400 border border-primary-500/20
                                       hover:bg-primary-600/25 transition-all">
                      <ClipboardCheck size={13} /> Take an Exam
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...stats.topicBreakdown]
                    .sort((a,b) => a.accuracy - b.accuracy)
                    .slice(0, 5)
                    .map(({ name, accuracy, problems, status }, i) => (
                      <div key={name} className="card-enter" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[status] || 'bg-slate-500'}`} />
                            <span className="text-slate-200 font-medium">{name}</span>
                            <span className="text-xs text-slate-600 font-mono">{problems} problems</span>
                          </div>
                          <span className={`font-black text-sm font-mono ${STATUS_TEXT[status] || 'text-slate-400'}`}>
                            {accuracy}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${STATUS_COLOR[status] || 'bg-slate-500'} rounded-full transition-all duration-700`}
                            style={{ width: `${accuracy}%`, animationDelay: `${i * 100}ms` }}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Right column — insight, exams, goal */}
          <div className="space-y-4 slide-from-right" style={{ animationDelay: '140ms' }}>

            {/* AI Insight */}
            <div className="relative overflow-hidden rounded-2xl border border-primary-500/25
                            bg-gradient-to-br from-primary-600/12 via-dark-card to-violet-600/8 p-5">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.15),transparent_70%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/20
                                  flex items-center justify-center">
                    <BrainCircuit size={16} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t('dashboard.aiInsight')}</p>
                    <Badge variant="primary" dot className="mt-0.5">Personalised</Badge>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-2.5 bg-primary-600/15 rounded w-full" />
                    <div className="h-2.5 bg-primary-600/15 rounded w-5/6" />
                    <div className="h-2.5 bg-primary-600/15 rounded w-4/6" />
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                )}

                <Link to="/analytics" className="mt-4 block">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                                     bg-primary-600/15 border border-primary-500/20 text-primary-400
                                     text-xs font-semibold hover:bg-primary-600/25 hover:text-primary-300
                                     transition-all active:scale-95">
                    View Full Analysis <ChevronRight size={13} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-accent-500/15 flex items-center justify-center">
                  <Calendar size={14} className="text-accent-400" />
                </div>
                <h3 className="text-sm font-bold text-white">{t('dashboard.upcoming')}</h3>
              </div>
              <div className="space-y-2">
                {upcomingExams.map(({ name, date, days }) => (
                  <div key={name}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface/60
                               border border-dark-border hover:border-primary-500/20 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{name}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{date}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-lg ml-2 ${
                      days <= 14 ? 'bg-red-500/15 text-red-400'       :
                      days <= 30 ? 'bg-amber-500/15 text-amber-400'   :
                                   'bg-primary-500/15 text-primary-400'
                    }`}>
                      {days}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Target size={14} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white">{t('dashboard.todayGoal')}</h3>
              </div>

              <div className="flex items-center gap-5">
                {/* SVG ring */}
                {loading ? (
                  <div className="w-20 h-20 rounded-full bg-dark-muted animate-pulse shrink-0" />
                ) : (
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9155" fill="none"
                        stroke="rgba(124,58,237,0.1)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9155"
                        fill="none"
                        stroke={todayProgress >= 100 ? '#10b981' : 'url(#gGoal)'}
                        strokeWidth="3"
                        strokeDasharray={`${todayProgress} 100`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                      <defs>
                        <linearGradient id="gGoal" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%"   stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-lg font-black leading-none ${todayProgress >= 100 ? 'text-emerald-400' : 'text-white'}`}>
                        {todaySolved}
                      </span>
                      <span className="text-[10px] text-slate-600 mt-0.5">/{DAILY_GOAL}</span>
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white mb-1">
                    {loading ? 'Loading…'
                      : todayProgress >= 100 ? '🎉 Goal complete!'
                      : `${DAILY_GOAL - todaySolved} more to go`}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                    {todayProgress >= 100
                      ? 'Amazing work today! Keep the momentum going.'
                      : `Solve ${DAILY_GOAL} problems a day to stay on track.`}
                  </p>
                  <Link to="/tutor">
                    <button className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold
                                        active:scale-95 transition-all ${
                      todayProgress >= 100
                        ? 'bg-dark-surface border border-dark-border text-slate-300 hover:text-white hover:border-primary-500/30'
                        : 'bg-gradient-to-r from-primary-600 to-violet-600 text-white hover:from-primary-500 hover:to-violet-500 hover:shadow-lg hover:shadow-primary-600/25'
                    }`}>
                      <MessageSquare size={12} />
                      {todayProgress >= 100 ? 'Keep Practicing' : 'Continue Practicing'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ─────────────────────────────────────────────────── */}
        <RecentActivity activities={stats?.latestActivity} loading={loading} />

        {/* ── Why Choose Mentora ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1.5">
                Your Competitive Edge
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Mentora AI
                </span>?
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Everything you need to ace national exams — powered by AI, built for Georgian students.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_MENTORA.map(({ icon: Icon, title, desc, gradient, iconBg, iconColor, accent }, i) => (
              <div
                key={title}
                className={`card-enter relative overflow-hidden rounded-2xl border border-dark-border p-5
                            bg-gradient-to-br ${gradient} group cursor-default
                            hover:border-opacity-40 transition-all duration-300`}
                style={{ animationDelay: `${i * 60}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}33`; e.currentTarget.style.boxShadow = `0 0 30px ${accent}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4
                                 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={19} className={iconColor} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                {/* Decorative glow */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `${accent}20` }} />
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary-500/25
                          bg-gradient-to-r from-primary-600/15 via-dark-card to-accent-500/10 p-6 sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_60%)]" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="text-lg font-black text-white mb-1">Ready to unlock your full potential?</p>
                <p className="text-sm text-slate-400">Join thousands of students already scoring higher with Mentora AI.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/tutor">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                                     bg-gradient-to-r from-primary-600 to-violet-600
                                     hover:from-primary-500 hover:to-violet-500
                                     hover:shadow-lg hover:shadow-primary-600/30
                                     active:scale-95 transition-all duration-200">
                    <Sparkles size={15} /> Start AI Session
                  </button>
                </Link>
                <Link to="/exam">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                                     text-slate-300 bg-dark-card border border-dark-border
                                     hover:border-primary-500/40 hover:text-white
                                     active:scale-95 transition-all duration-200">
                    <ClipboardCheck size={15} /> Take a Mock Exam
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
