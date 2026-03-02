import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { TrendingUp, TrendingDown, BrainCircuit, Target, Zap, AlertTriangle, Flame } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import clsx from 'clsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const statusColor = (s) => ({
    strong:   'bg-emerald-500',
    ok:       'bg-amber-400',
    weak:     'bg-orange-500',
    critical: 'bg-red-500',
}[s] || 'bg-slate-500');

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="glass rounded-xl border border-primary-500/20 p-3 text-xs shadow-xl">
                <p className="text-slate-400 mb-1">{label}</p>
                {payload.map(p => (
                    <p key={p.name} className="font-semibold" style={{ color: p.color }}>
                        {p.name}: {p.value}{p.name === 'accuracy' ? '%' : ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

/* ── Empty chart placeholder ─────────────────────────────────────────────── */
function EmptyChart({ message = 'No data yet' }) {
    return (
        <div className="h-[220px] flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-slate-500">{message}</p>
            <p className="text-xs text-slate-600">Solve problems to populate this chart.</p>
        </div>
    );
}

/* ── Build AI recommendations from real topic breakdown ──────────────────── */
function buildRecommendations(topicBreakdown) {
    if (!topicBreakdown || topicBreakdown.length === 0) return [];

    const recs = [];

    const criticals = topicBreakdown.filter(t => t.status === 'critical');
    const weaks     = topicBreakdown.filter(t => t.status === 'weak');
    const strongs   = topicBreakdown.filter(t => t.status === 'strong');

    criticals.slice(0, 1).forEach(t => recs.push({
        icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20',
        title: `Critical: ${t.name}`,
        desc:  `Only ${t.accuracy}% accuracy on ${t.problems} attempts. Prioritise this topic immediately.`,
    }));

    weaks.slice(0, 1).forEach(t => recs.push({
        icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
        title: `Needs Work: ${t.name}`,
        desc:  `${t.accuracy}% accuracy. A focused session could push you past 70% quickly.`,
    }));

    // Quick win: topic closest to the 75% strong threshold
    const quickWin = topicBreakdown.find(t => t.status === 'ok' && t.accuracy >= 60);
    if (quickWin) recs.push({
        icon: Zap, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20',
        title: `Quick Win: ${quickWin.name}`,
        desc:  `At ${quickWin.accuracy}% — just a bit more practice to reach strong level.`,
    });

    strongs.slice(0, 1).forEach(t => recs.push({
        icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
        title: `Maintain: ${t.name}`,
        desc:  `Great job — ${t.accuracy}% accuracy. Keep doing 2-3 problems daily to stay sharp.`,
    }));

    return recs.slice(0, 4);
}

/* ── Skeleton loader ─────────────────────────────────────────────────────── */
function StatSkeleton() {
    return (
        <Card className="border-dark-border animate-pulse">
            <div className="w-5 h-5 bg-dark-border rounded mb-3" />
            <div className="h-8 w-20 bg-dark-border rounded mb-2" />
            <div className="h-3 w-28 bg-dark-border rounded" />
        </Card>
    );
}

export default function Analytics() {
    usePageTitle('Analytics');
    const { t } = useTranslation();
    const [period,  setPeriod]  = useState('7d');
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch real stats from backend
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

    // Chart data switches based on selected period
    const chartData = period === '7d'
        ? (stats?.weeklyActivity  || [])
        : (stats?.monthlyActivity || []);

    const topicBreakdown   = stats?.topicBreakdown || [];
    const radarData        = topicBreakdown.map(t => ({ topic: t.name.slice(0, 5), score: t.accuracy }));
    const recommendations  = buildRecommendations(topicBreakdown);
    const hasChartData     = chartData.some(d => d.problems > 0);
    const hasTopics        = topicBreakdown.length > 0;

    // Overview stats — real numbers
    const overviewStats = [
        {
            label: 'Total Problems',
            val:   loading ? '…' : (stats?.problemsSolved ?? 0).toString(),
            trend: stats?.problemsSolved > 0 ? `+${stats.problemsSolved}` : '—',
            up:    (stats?.problemsSolved ?? 0) > 0,
            icon:  Target,
        },
        {
            label: 'Overall Accuracy',
            val:   loading ? '…' : stats?.problemsSolved > 0 ? `${stats.accuracy}%` : '—',
            trend: stats?.accuracy >= 60 ? `${stats.accuracy}%` : stats?.problemsSolved > 0 ? `${stats.accuracy}%` : '—',
            up:    (stats?.accuracy ?? 0) >= 60,
            icon:  TrendingUp,
        },
        {
            label: 'Study Streak',
            val:   loading ? '…' : `${stats?.streak ?? 0} ${stats?.streak === 1 ? 'day' : 'days'}`,
            trend: (stats?.streak ?? 0) >= 3 ? '🔥 On fire' : (stats?.streak ?? 0) >= 1 ? 'Keep going' : '—',
            up:    (stats?.streak ?? 0) >= 2,
            icon:  Flame,
        },
        {
            label: 'Weak Topics',
            val:   loading ? '…' : (stats?.weakTopicCount ?? 0).toString(),
            trend: (stats?.weakTopicCount ?? 0) === 0 ? 'None! Great job' : `${stats?.weakTopicCount} to fix`,
            up:    (stats?.weakTopicCount ?? 0) === 0,
            icon:  AlertTriangle,
        },
    ];

    return (
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('analytics.title')}</h1>
                    <p className="text-sm text-slate-400 mt-1">{t('analytics.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    {PERIODS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setPeriod(key)}
                            className={clsx(
                                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                                period === key
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white'
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview stats row — REAL DATA */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {loading
                    ? [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
                    : overviewStats.map(({ label, val, trend, up, icon: Icon }) => (
                        <Card key={label} className="border-dark-border">
                            <div className="flex items-start justify-between mb-3">
                                <Icon size={18} className="text-primary-400" />
                                {trend !== '—' && (
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                                        up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                        {up ? '↑' : '↓'} {trend}
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-extrabold text-white">{val}</p>
                            <p className="text-xs text-slate-500 mt-1">{label}</p>
                        </Card>
                    ))
                }
            </div>

            {/* Main charts row */}
            <div className="grid xl:grid-cols-3 gap-5">
                {/* Performance trend — 2 cols */}
                <Card className="xl:col-span-2 border-dark-border">
                    <CardHeader>
                        <CardTitle>{t('analytics.performance')}</CardTitle>
                        <Badge variant="accent" dot>Live</Badge>
                    </CardHeader>
                    {loading ? (
                        <div className="h-[220px] flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        </div>
                    ) : !hasChartData ? (
                        <EmptyChart message="No activity data for this period" />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                                <defs>
                                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} fill="url(#aGrad)" name="accuracy" />
                                <Area type="monotone" dataKey="problems" stroke="#06b6d4" strokeWidth={2} fill="url(#bGrad)" name="problems" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                    <div className="flex gap-5 mt-2">
                        {[{ c: 'bg-primary-500', l: 'Accuracy %' }, { c: 'bg-accent-500', l: 'Problems' }].map(({ c, l }) => (
                            <div key={l} className="flex items-center gap-2">
                                <span className={`w-3 h-0.5 ${c} rounded`} />
                                <span className="text-xs text-slate-500">{l}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Skills Radar */}
                <Card className="border-dark-border">
                    <CardHeader>
                        <CardTitle>Skills Radar</CardTitle>
                    </CardHeader>
                    {!hasTopics ? (
                        <div className="h-[200px] flex items-center justify-center">
                            <p className="text-xs text-slate-600 text-center px-4">
                                Solve problems across topics to see your skills map.
                            </p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                                <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            {/* Topic breakdown */}
            <div className="grid xl:grid-cols-2 gap-5">
                {/* Topic Heatmap */}
                <Card className="border-dark-border">
                    <CardHeader>
                        <CardTitle>{t('analytics.heatmap')}</CardTitle>
                        <Badge variant="ghost">{t('analytics.accuracyByTopic')}</Badge>
                    </CardHeader>
                    {!hasTopics ? (
                        <div className="py-10 text-center">
                            <p className="text-sm text-slate-500">No topic data yet.</p>
                            <p className="text-xs text-slate-600 mt-1">
                                Each problem you solve is tracked by topic here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topicBreakdown.map(({ name, accuracy, problems, status }) => (
                                <div key={name}>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${statusColor(status)}`} />
                                            <span className="text-slate-300">{name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>{problems} problem{problems !== 1 ? 's' : ''}</span>
                                            <span className={clsx(
                                                'font-bold',
                                                accuracy >= 75 ? 'text-emerald-400' :
                                                accuracy >= 60 ? 'text-amber-400'   : 'text-red-400'
                                            )}>{accuracy}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2.5 bg-dark-muted rounded-full overflow-hidden">
                                        <div
                                            className={clsx('h-full rounded-full transition-all duration-700',
                                                accuracy >= 75 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                                                accuracy >= 60 ? 'bg-gradient-to-r from-amber-600 to-amber-400'   :
                                                'bg-gradient-to-r from-red-700 to-red-500'
                                            )}
                                            style={{ width: `${accuracy}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* AI Recommendations — driven by real topic data */}
                <Card className="border-dark-border">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BrainCircuit size={16} className="text-primary-400" />
                            <CardTitle>{t('analytics.recommendations')}</CardTitle>
                        </div>
                        <Badge variant="primary" dot>AI</Badge>
                    </CardHeader>
                    {recommendations.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-sm text-slate-500">
                                {hasTopics
                                    ? 'All topics looking strong! Keep it up.'
                                    : 'Solve problems to get AI recommendations.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recommendations.map(({ icon: Icon, color, bg, title, desc }) => (
                                <div key={title} className={`rounded-xl border ${bg} p-4 flex gap-3`}>
                                    <div className="w-8 h-8 rounded-lg bg-dark-card flex items-center justify-center shrink-0">
                                        <Icon size={16} className={color} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{title}</p>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Bar chart — problems by topic */}
            <Card className="border-dark-border">
                <CardHeader>
                    <CardTitle>{t('analytics.problemsByTopic')}</CardTitle>
                    <Badge variant="ghost">Total Attempts</Badge>
                </CardHeader>
                {!hasTopics ? (
                    <div className="h-[180px] flex items-center justify-center">
                        <p className="text-sm text-slate-500">No topic data yet.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={topicBreakdown} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="problems" radius={[4, 4, 0, 0]}>
                                {topicBreakdown.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={entry.accuracy >= 75 ? '#10b981' : entry.accuracy >= 60 ? '#f59e0b' : '#ef4444'}
                                        opacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Card>
        </div>
    );
}
