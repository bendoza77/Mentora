import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import {
  TrendingUp, TrendingDown, BrainCircuit, Target, Zap,
  AlertTriangle, Flame, BarChart3, Lock,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import PlanGate from '../components/ui/PlanGate';
import clsx from 'clsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const statusColor = (s) => ({
  strong:   'bg-emerald-500',
  ok:       'bg-amber-400',
  weak:     'bg-orange-500',
  critical: 'bg-red-500',
}[s] || 'bg-slate-500');

const statusGradient = (acc) =>
  acc >= 75 ? 'from-emerald-600 to-emerald-400' :
  acc >= 60 ? 'from-amber-600 to-amber-400'     : 'from-red-700 to-red-500';

const statusTextColor = (acc) =>
  acc >= 75 ? 'text-emerald-400' :
  acc >= 60 ? 'text-amber-400'   : 'text-red-400';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-2xl border border-primary-500/20 p-3.5 shadow-2xl min-w-[140px]">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-slate-400 capitalize">{p.name}</span>
            <span className="text-xs font-bold ml-auto" style={{ color: p.color }}>
              {p.value}{p.name === 'accuracy' ? '%' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function EmptyChart({ icon: Icon = BarChart3, message = 'No data yet', sub }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center">
        <Icon size={20} className="text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{message}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function buildRecommendations(topicBreakdown) {
  if (!topicBreakdown?.length) return [];
  const recs = [];
  const criticals = topicBreakdown.filter(t => t.status === 'critical');
  const weaks     = topicBreakdown.filter(t => t.status === 'weak');
  const strongs   = topicBreakdown.filter(t => t.status === 'strong');
  criticals.slice(0,1).forEach(t => recs.push({
    icon: AlertTriangle, color: 'text-red-400',
    bg: 'bg-red-500/8 border-red-500/20',
    title: `Critical: ${t.name}`,
    desc: `Only ${t.accuracy}% accuracy on ${t.problems} attempts. Prioritise this topic immediately.`,
  }));
  weaks.slice(0,1).forEach(t => recs.push({
    icon: TrendingDown, color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    title: `Needs Work: ${t.name}`,
    desc: `${t.accuracy}% accuracy. A focused session could push you past 70% quickly.`,
  }));
  const quickWin = topicBreakdown.find(t => t.status === 'ok' && t.accuracy >= 60);
  if (quickWin) recs.push({
    icon: Zap, color: 'text-primary-400',
    bg: 'bg-primary-500/8 border-primary-500/20',
    title: `Quick Win: ${quickWin.name}`,
    desc: `At ${quickWin.accuracy}% — just a bit more practice to reach strong level.`,
  });
  strongs.slice(0,1).forEach(t => recs.push({
    icon: Target, color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    title: `Maintain: ${t.name}`,
    desc: `Great job — ${t.accuracy}% accuracy. Keep doing 2–3 problems daily to stay sharp.`,
  }));
  return recs.slice(0, 4);
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-dark-muted rounded-xl" />
        <div className="w-16 h-6 bg-dark-muted rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-dark-muted rounded mb-1.5" />
      <div className="h-3 w-24 bg-dark-muted rounded mb-4" />
      <div className="h-1.5 w-full bg-dark-muted rounded-full" />
    </div>
  );
}

export default function Analytics() {
  usePageTitle('Analytics');
  const { t } = useTranslation();
  const [period,  setPeriod]  = useState('7d');
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const PERIODS = [
    { key: '7d',  label: t('analytics.last7Days')  },
    { key: '30d', label: t('analytics.last30Days') },
  ];

  const chartData       = period === '7d' ? (stats?.weeklyActivity || []) : (stats?.monthlyActivity || []);
  const topicBreakdown  = stats?.topicBreakdown || [];
  const radarData       = topicBreakdown.map(t => ({ topic: t.name.slice(0, 5), score: t.accuracy }));
  const recommendations = buildRecommendations(topicBreakdown);
  const hasChartData    = chartData.some(d => d.problems > 0);
  const hasTopics       = topicBreakdown.length > 0;

  const STAT_CARDS = [
    {
      label: 'Total Problems',
      val:   loading ? '…' : (stats?.problemsSolved ?? 0).toString(),
      trend: stats?.problemsSolved > 0 ? `↑ ${stats.problemsSolved}` : '—',
      up:    (stats?.problemsSolved ?? 0) > 0,
      icon:  Target,
      iconBg: 'bg-primary-500/15', iconColor: 'text-primary-400',
      gradient: 'from-primary-500 to-violet-500',
      barPct: Math.min((stats?.problemsSolved ?? 0) * 2, 100),
    },
    {
      label: 'Overall Accuracy',
      val:   loading ? '…' : stats?.problemsSolved > 0 ? `${stats.accuracy}%` : '—',
      trend: stats?.accuracy >= 60 ? `↑ ${stats?.accuracy}%` : stats?.problemsSolved > 0 ? `↓ ${stats?.accuracy}%` : '—',
      up:    (stats?.accuracy ?? 0) >= 60,
      icon:  TrendingUp,
      iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-400',
      barPct: stats?.accuracy ?? 0,
    },
    {
      label: 'Study Streak',
      val:   loading ? '…' : `${stats?.streak ?? 0}`,
      unit:  stats?.streak === 1 ? 'day' : 'days',
      trend: (stats?.streak ?? 0) >= 3 ? '🔥 On fire' : (stats?.streak ?? 0) >= 1 ? '↑ Keep going' : '—',
      up:    (stats?.streak ?? 0) >= 2,
      icon:  Flame,
      iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-400',
      barPct: Math.min((stats?.streak ?? 0) * 10, 100),
    },
    {
      label: 'Weak Topics',
      val:   loading ? '…' : (stats?.weakTopicCount ?? 0).toString(),
      trend: (stats?.weakTopicCount ?? 0) === 0 ? '✓ None!' : `↓ ${stats?.weakTopicCount} to fix`,
      up:    (stats?.weakTopicCount ?? 0) === 0,
      icon:  AlertTriangle,
      iconBg: 'bg-red-500/15', iconColor: 'text-red-400',
      gradient: 'from-red-500 to-orange-500',
      barPct: Math.min((stats?.weakTopicCount ?? 0) * 20, 100),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="slide-down flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Data & Insights</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{t('analytics.title')}</h1>
            <p className="text-sm text-slate-400 mt-1">{t('analytics.subtitle')}</p>
          </div>
          {/* Period filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-card border border-dark-border">
            {PERIODS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  period === key
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview stat cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
            : STAT_CARDS.map(({ label, val, unit, trend, up, icon: Icon, iconBg, iconColor, gradient, barPct }, i) => (
              <div
                key={label}
                className="card-enter relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card p-5 group
                           hover:border-primary-500/20 transition-all duration-300"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  {trend !== '—' && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trend}
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1 mb-0.5">
                  <p className="text-2xl font-black text-white">{val}</p>
                  {unit && <p className="text-sm text-slate-500 mb-0.5">{unit}</p>}
                </div>
                <p className="text-xs text-slate-500 mb-4">{label}</p>
                <div className="h-1 w-full bg-dark-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
                    style={{ width: `${barPct}%` }} />
                </div>
              </div>
            ))
          }
        </div>

        {/* ── Charts row ───────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Performance trend — 2 cols */}
          <div className="lg:col-span-2 rounded-2xl border border-dark-border bg-dark-card p-5
                          slide-from-left fade-blur-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center">
                  <TrendingUp size={15} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t('analytics.performance')}</h3>
                  <p className="text-xs text-slate-500">
                    {period === '7d' ? 'Last 7 days' : 'Last 30 days'}
                  </p>
                </div>
              </div>
              <Badge variant="accent" dot>Live</Badge>
            </div>

            {loading ? (
              <div className="h-[220px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : !hasChartData ? (
              <EmptyChart icon={TrendingUp} message="No activity for this period"
                sub="Solve problems to populate this chart." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="aGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,58,237,0.15)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2.5}
                    fill="url(#aGrad2)" name="accuracy" dot={false} activeDot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="problems" stroke="#06b6d4" strokeWidth={2}
                    fill="url(#bGrad2)" name="problems" dot={false} activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-dark-border">
              {[{ c: 'bg-primary-500', l: 'Accuracy %' }, { c: 'bg-accent-500', l: 'Problems' }].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-2">
                  <span className={`w-3.5 h-0.5 ${c} rounded-full`} />
                  <span className="text-xs text-slate-500">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Radar — Pro+ */}
          <PlanGate minPlan="pro" compact>
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Skills Radar</h3>
                  <p className="text-xs text-slate-500">Topic mastery overview</p>
                </div>
                <Badge variant="primary">Pro</Badge>
              </div>
              {!hasTopics ? (
                <EmptyChart icon={BarChart3} message="No skills data yet"
                  sub="Solve problems across topics to see your map." />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fill: '#475569', fontSize: 10 }} />
                    <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </PlanGate>
        </div>

        {/* ── Topic Breakdown + AI Recommendations ──────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Topic Heatmap — Pro+ */}
          <PlanGate minPlan="pro" compact>
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-white">{t('analytics.heatmap')}</h3>
                  <p className="text-xs text-slate-500">{t('analytics.accuracyByTopic')}</p>
                </div>
                <Badge variant="ghost">Pro</Badge>
              </div>
              {!hasTopics ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500">No topic data yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Each problem you solve is tracked by topic here.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {topicBreakdown.map(({ name, accuracy, problems, status }) => (
                    <div key={name}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusColor(status)}`} />
                          <span className="text-sm font-medium text-slate-300">{name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-600">{problems} problem{problems !== 1 ? 's' : ''}</span>
                          <span className={`font-black ${statusTextColor(accuracy)}`}>{accuracy}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-dark-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${statusGradient(accuracy)} rounded-full transition-all duration-700`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PlanGate>

          {/* AI Recommendations — Pro+ */}
          <PlanGate minPlan="pro" compact>
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center">
                    <BrainCircuit size={15} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t('analytics.recommendations')}</h3>
                    <p className="text-xs text-slate-500">Personalised study plan</p>
                  </div>
                </div>
                <Badge variant="primary" dot>AI</Badge>
              </div>
              {recommendations.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500">
                    {hasTopics ? 'All topics looking great! Keep it up.' : 'Solve problems to get AI recommendations.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map(({ icon: Icon, color, bg, title, desc }) => (
                    <div key={title} className={`rounded-xl border ${bg} p-4 flex gap-3 card-enter`}>
                      <div className="w-8 h-8 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center shrink-0">
                        <Icon size={15} className={color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PlanGate>
        </div>

        {/* ── Problems by Topic bar chart — Pro+ ──────────────────────────────── */}
        <PlanGate minPlan="pro" compact>
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-white">{t('analytics.problemsByTopic')}</h3>
                <p className="text-xs text-slate-500">Total attempts per subject area</p>
              </div>
              <Badge variant="ghost">Total Attempts</Badge>
            </div>
            {!hasTopics ? (
              <EmptyChart message="No topic data yet." sub="Solve problems to see distribution." />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topicBreakdown} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="problems" radius={[6, 6, 0, 0]}>
                    {topicBreakdown.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.accuracy >= 75 ? '#10b981' : entry.accuracy >= 60 ? '#f59e0b' : '#ef4444'}
                        opacity={0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </PlanGate>

      </div>
    </div>
  );
}
