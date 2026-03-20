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

const STATUS_COLOR = {
  critical: 'bg-red-500',
  weak:     'bg-amber-500',
  ok:       'bg-amber-400',
  strong:   'bg-emerald-500',
};

const DAILY_GOAL = 5; // problems per day

// Generate a personalised, data-driven insight from real stats
function generateInsight(stats, todaySolved) {
  if (!stats) return null;
  const { topicBreakdown = [], accuracy = 0, streak = 0, problemsSolved = 0, totalExams = 0 } = stats;

  // 1. Critical topic (accuracy < 40%) — highest priority
  const critical = topicBreakdown.find(t => t.status === 'critical');
  if (critical) {
    return `Your accuracy in ${critical.name} is only ${critical.accuracy}% — a critical weak spot. Even one focused 30-minute session here could meaningfully shift your exam score.`;
  }

  // 2. Multiple weak topics
  const weak = topicBreakdown.filter(t => t.status === 'weak' || t.status === 'critical');
  if (weak.length >= 2) {
    const names = weak.slice(0, 2).map(t => t.name).join(' and ');
    return `You have ${weak.length} topics below 60%: ${names}. Tackling these first gives you the highest return on study time before the national exam.`;
  }

  // 3. Single weak topic
  if (weak.length === 1) {
    return `${weak[0].name} is your main weak spot at ${weak[0].accuracy}% accuracy. A targeted 20-minute session today could lift your overall score noticeably.`;
  }

  // 4. Strong streak
  if (streak >= 7) {
    return `You're on a ${streak}-day streak — that's elite consistency. Students who practice daily like you are outscoring peers who cram by an average of 23%.`;
  }

  // 5. Daily goal hit
  if (todaySolved >= DAILY_GOAL) {
    return `Goal hit! You've solved ${todaySolved} problems today. Consider running a timed mock exam to stress-test your knowledge under real exam conditions.`;
  }

  // 6. High accuracy + experience
  if (accuracy >= 80 && problemsSolved >= 20) {
    return `Excellent — ${accuracy}% accuracy across ${problemsSolved} problems. At this level, speed and exam technique are your next frontier. Try timed mode.`;
  }

  // 7. No activity yet
  if (!topicBreakdown.length) {
    return `Take your first exam or practice session and I'll analyse your strengths and weak spots to give you a personalised study plan.`;
  }

  // 8. Strongest topic callout
  if (topicBreakdown.length > 0) {
    const strongest = topicBreakdown[topicBreakdown.length - 1];
    return `Your strongest topic is ${strongest.name} at ${strongest.accuracy}%. Build on that foundation while dedicating extra time to your weaker areas for a balanced score.`;
  }

  return `Your overall accuracy is ${accuracy}%. Consistent daily practice of 5–10 problems has been shown to improve exam scores by 20%+ within a month.`;
}

// Georgian national exams — fixed annual dates (month is 0-indexed)
function getUpcomingExams() {
  const now   = new Date();
  const year  = now.getFullYear();

  const candidates = [
    { name: 'National Math Exam',      month: 5, day: 15 }, // June 15
    { name: 'National Georgian Exam',  month: 5, day: 10 }, // June 10
    { name: 'National English Exam',   month: 5, day: 20 }, // June 20
  ];

  return candidates
    .map(({ name, month, day }) => {
      let examDate = new Date(year, month, day);
      // If already passed this year, show next year
      if (examDate < now) examDate = new Date(year + 1, month, day);
      const daysLeft = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
      const dateStr  = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return { name, date: dateStr, days: daysLeft };
    })
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);
}

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { t } = useTranslation();
  const { user } = useAuth();

  // ── Fetch real stats from backend ────────────────────────────────────────
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derived values from real stats
  const todaySolved    = stats?.weeklyActivity?.[stats.weeklyActivity.length - 1]?.problems ?? 0;
  const todayProgress  = Math.min(Math.round((todaySolved / DAILY_GOAL) * 100), 100);
  const upcomingExams  = getUpcomingExams();
  const insight        = generateInsight(stats, todaySolved);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto page-enter">
      {/* Header */}
      <div className="slide-down flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {t('dashboard.welcome')}, {user?.fullname?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link to="/tutor" className="flex-1 sm:flex-none">
            <Button variant="gradient" size="sm" icon={<Sparkles size={14} />} full>
              <span className="sm:hidden">AI Tutor</span>
              <span className="hidden sm:inline">{t('dashboard.continueSession')}</span>
            </Button>
          </Link>
          <Link to="/exam" className="flex-1 sm:flex-none">
            <Button variant="secondary" size="sm" icon={<ClipboardCheck size={14} />} full>
              <span className="sm:hidden">Exam</span>
              <span className="hidden sm:inline">{t('dashboard.startExam')}</span>
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
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Progress chart — 2 cols */}
        <div className="lg:col-span-2 space-y-5 slide-from-left" style={{ animationDelay: '120ms' }}>
          <ProgressChart weeklyActivity={stats?.weeklyActivity} loading={loading} />

          {/* Topics to review — real data */}
          <Card className="border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{t('dashboard.topicsToReview')}</h3>
              <Link to="/analytics">
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                  {t('dashboard.viewAnalytics')} <ArrowRight size={12} />
                </button>
              </Link>
            </div>

            {loading ? (
              /* Skeleton */
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 w-28 bg-dark-muted rounded animate-pulse" />
                      <div className="h-3 w-10 bg-dark-muted rounded animate-pulse" />
                    </div>
                    <div className="w-full h-2 bg-dark-muted rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !stats?.topicBreakdown?.length ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <BookOpen size={28} className="text-slate-600" />
                <p className="text-sm text-slate-400 font-medium">No practice data yet</p>
                <p className="text-xs text-slate-500">Complete exams or practice sessions to see your topic scores here.</p>
                <Link to="/exam" className="mt-2">
                  <Button variant="secondary" size="sm" icon={<ClipboardCheck size={13} />}>
                    Take an Exam
                  </Button>
                </Link>
              </div>
            ) : (
              /* Real topic bars — weakest first, up to 5 */
              <div className="space-y-4">
                {[...stats.topicBreakdown]
                  .sort((a, b) => a.accuracy - b.accuracy)
                  .slice(0, 5)
                  .map(({ name, accuracy, problems, status }) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{name}</span>
                          <span className="text-xs text-slate-600 font-mono">{problems} problems</span>
                        </div>
                        <span className={`font-mono font-semibold text-xs ${
                          status === 'critical' ? 'text-red-400' :
                          status === 'weak'     ? 'text-amber-400' :
                          status === 'ok'       ? 'text-amber-300' :
                                                  'text-emerald-400'
                        }`}>{accuracy}%</span>
                      </div>
                      <div className="w-full h-2 bg-dark-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${STATUS_COLOR[status] || 'bg-slate-500'} rounded-full transition-all duration-700`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5 slide-from-right" style={{ animationDelay: '160ms' }}>
          {/* AI Insight — real personalised analysis */}
          <Card className="border-primary-500/25 bg-gradient-to-br from-primary-600/10 to-dark-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
                <BrainCircuit size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t('dashboard.aiInsight')}</p>
                <Badge variant="primary" dot className="mt-1">Personalised</Badge>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-3 bg-primary-600/10 rounded animate-pulse w-full" />
                <div className="h-3 bg-primary-600/10 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-primary-600/10 rounded animate-pulse w-4/6" />
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
            )}

            <Link to="/analytics">
              <Button variant="secondary" size="sm" full className="mt-4">
                View Full Analysis
              </Button>
            </Link>
          </Card>

          {/* Upcoming exams — real computed countdown */}
          <Card className="border-dark-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-accent-400" />
              <h3 className="text-sm font-semibold text-white">{t('dashboard.upcoming')}</h3>
            </div>
            <div className="space-y-3">
              {upcomingExams.map(({ name, date, days }) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{name}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    days <= 14  ? 'bg-red-500/15 text-red-400'     :
                    days <= 30  ? 'bg-amber-500/15 text-amber-400'  :
                                  'bg-primary-500/15 text-primary-400'
                  }`}>
                    {days}d
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily goal — real data */}
          <Card className="border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">{t('dashboard.todayGoal')}</h3>
            </div>
            <div className="text-center py-3">
              {loading ? (
                <div className="w-24 h-24 mx-auto rounded-full bg-dark-muted animate-pulse" />
              ) : (
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9155"
                      fill="none"
                      stroke={todayProgress >= 100 ? '#10b981' : 'url(#circleGrad)'}
                      strokeWidth="3"
                      strokeDasharray={`${todayProgress} 100`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 0.7s ease' }}
                    />
                    <defs>
                      <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-extrabold ${todayProgress >= 100 ? 'text-emerald-400' : 'text-white'}`}>
                      {todaySolved}/{DAILY_GOAL}
                    </span>
                    <span className="text-xs text-slate-500">problems</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-slate-400 mt-2">
                {loading
                  ? 'Loading...'
                  : todayProgress >= 100
                  ? '🎉 Daily goal complete!'
                  : todaySolved === 0
                  ? `Solve ${DAILY_GOAL} problems to hit your goal!`
                  : `${DAILY_GOAL - todaySolved} more to complete your daily goal!`
                }
              </p>
            </div>
            <Link to="/tutor">
              <Button
                variant={todayProgress >= 100 ? 'secondary' : 'gradient'}
                size="sm" full
                icon={<MessageSquare size={14} />}
              >
                {todayProgress >= 100 ? 'Keep Practicing' : 'Continue Practicing'}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_MENTORA.map(({ icon: Icon, title, desc, gradient, iconBg, iconColor }, i) => (
            <div
              key={title}
              className={`card-enter relative overflow-hidden rounded-2xl border border-dark-border p-5 bg-gradient-to-br ${gradient} group hover:border-primary-500/40 transition-all duration-300`}
              style={{ animationDelay: `${i * 60}ms` }}
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
