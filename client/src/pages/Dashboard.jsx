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
import Card from '../components/ui/Card';
import {
  MessageSquare, ClipboardCheck, BarChart3,
  Sparkles, BookOpen, Calendar, ArrowRight, BrainCircuit,
  Target, Zap, ShieldCheck, TrendingUp, Users, Globe
} from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const TOPICS_TO_REVIEW = [
  { name: 'Trigonometry', score: 42, color: 'bg-red-500' },
  { name: 'Functions', score: 55, color: 'bg-amber-500' },
  { name: 'Calculus', score: 63, color: 'bg-amber-400' },
];

const UPCOMING = [
  { name: 'Georgian National Math', date: 'Mar 15, 2026', days: 22 },
  { name: 'Mock Exam #3', date: 'Feb 28, 2026', days: 7 },
];

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { t } = useTranslation();
  const { user } = useAuth();

  // ── Fetch real stats from backend ────────────────────────────────────────
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(stats);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t('dashboard.welcome')}, {user?.fullname?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/tutor">
            <Button variant="gradient" size="md" icon={<Sparkles size={15} />}>
              {t('dashboard.continueSession')}
            </Button>
          </Link>
          <Link to="/exam">
            <Button variant="secondary" size="md" icon={<ClipboardCheck size={15} />}>
              {t('dashboard.startExam')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards — real data */}
      <OverviewCards
        streak={stats?.streak}
        problemsSolved={stats?.problemsSolved}
        accuracy={stats?.accuracy}
        latestExamScore={stats?.latestExamScore}
        latestExamMax={stats?.latestExamMaxScore}
        loading={loading}
      />

      {/* Main grid */}
      <div className="grid xl:grid-cols-3 gap-5">
        {/* Progress chart — 2 cols */}
        <div className="xl:col-span-2 space-y-5">
          <ProgressChart weeklyActivity={stats?.weeklyActivity} loading={loading} />

          {/* Topics to review */}
          <Card className="border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{t('dashboard.topicsToReview')}</h3>
              <Link to="/analytics">
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                  {t('dashboard.viewAnalytics')} <ArrowRight size={12} />
                </button>
              </Link>
            </div>
            <div className="space-y-4">
              {TOPICS_TO_REVIEW.map(({ name, score, color }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{name}</span>
                    <span className="text-slate-500 font-mono">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Insight */}
          <Card className="border-primary-500/25 bg-gradient-to-br from-primary-600/10 to-dark-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
                <BrainCircuit size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t('dashboard.aiInsight')}</p>
                <Badge variant="primary" dot className="mt-1">Live</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('dashboard.aiInsightMsg')}
            </p>
            <Link to="/analytics">
              <Button variant="secondary" size="sm" full className="mt-4">
                View Full Analysis
              </Button>
            </Link>
          </Card>

          {/* Upcoming exams */}
          <Card className="border-dark-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-accent-400" />
              <h3 className="text-sm font-semibold text-white">{t('dashboard.upcoming')}</h3>
            </div>
            <div className="space-y-3">
              {UPCOMING.map(({ name, date, days }) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{name}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    days <= 7 ? 'bg-red-500/15 text-red-400' : 'bg-primary-500/15 text-primary-400'
                  }`}>
                    {days}d
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily goal */}
          <Card className="border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">{t('dashboard.todayGoal')}</h3>
            </div>
            <div className="text-center py-3">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9155"
                    fill="none"
                    stroke="url(#circleGrad)"
                    strokeWidth="3"
                    strokeDasharray="80 100"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">4/5</span>
                  <span className="text-xs text-slate-500">problems</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-2">1 more to complete your daily goal!</p>
            </div>
            <Link to="/tutor">
              <Button variant="gradient" size="sm" full icon={<MessageSquare size={14} />}>
                Continue Practicing
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity — real data */}
      <RecentActivity activities={stats?.latestActivity} loading={loading} />

      {/* Why Choose Mentora AI */}
      <div className="space-y-5">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-1">Your Competitive Edge</p>
            <h2 className="text-xl font-bold text-white">Why Choose <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Mentora AI</span>?</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">Everything you need to ace national exams — powered by AI, built for Georgian students.</p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {WHY_MENTORA.map(({ icon: Icon, title, desc, gradient, iconBg, iconColor }) => (
            <div
              key={title}
              className={`relative overflow-hidden rounded-2xl border border-dark-border p-5 bg-gradient-to-br ${gradient} group hover:border-primary-500/40 transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={iconColor} />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">{title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              {/* decorative glow blob */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary-600/10 blur-2xl group-hover:bg-primary-600/20 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-r from-primary-600/15 via-dark-card to-accent-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12),transparent_60%)]" />
          <div className="relative">
            <p className="text-base font-bold text-white">Ready to unlock your full potential?</p>
            <p className="text-sm text-slate-400 mt-0.5">Join thousands of students already scoring higher with Mentora AI.</p>
          </div>
          <div className="relative flex gap-3 shrink-0">
            <Link to="/tutor">
              <Button variant="gradient" size="md" icon={<Sparkles size={14} />}>
                Start AI Session
              </Button>
            </Link>
            <Link to="/exam">
              <Button variant="secondary" size="md" icon={<ClipboardCheck size={14} />}>
                Take a Mock Exam
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const WHY_MENTORA = [
  {
    icon: BrainCircuit,
    title: 'Adaptive AI Tutoring',
    desc: 'Our AI identifies exactly where you struggle and crafts personalized explanations — no two sessions are the same.',
    gradient: 'from-primary-600/10 to-dark-card',
    iconBg: 'bg-primary-600/20',
    iconColor: 'text-primary-400',
  },
  {
    icon: Target,
    title: 'National Exam Focus',
    desc: 'Built around the Georgian national math curriculum. Every question, hint, and topic aligns with real exam standards.',
    gradient: 'from-accent-500/10 to-dark-card',
    iconBg: 'bg-accent-500/20',
    iconColor: 'text-accent-400',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Get step-by-step solutions and real-time corrections the moment you submit an answer — not hours later.',
    gradient: 'from-amber-500/10 to-dark-card',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Visual dashboards track your improvement over time and flag weak spots before they cost you points on exam day.',
    gradient: 'from-emerald-500/10 to-dark-card',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: ShieldCheck,
    title: 'Proven Results',
    desc: 'Students using Mentora AI report an average score increase of 23% within 4 weeks of consistent practice.',
    gradient: 'from-violet-500/10 to-dark-card',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: Globe,
    title: 'Georgian & English',
    desc: 'Fully bilingual — switch between Georgian and English at any time. Study in the language you think best in.',
    gradient: 'from-cyan-500/10 to-dark-card',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
];
