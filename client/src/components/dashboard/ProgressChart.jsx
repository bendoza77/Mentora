import { useTranslation } from 'react-i18next';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="glass rounded-xl border border-primary-500/20 p-3 shadow-xl">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-white">
                    Accuracy: <span className="text-primary-400">{payload[0]?.value}%</span>
                </p>
                <p className="text-xs text-slate-400">
                    Problems: {payload[1]?.value}
                </p>
            </div>
        );
    }
    return null;
};

/**
 * ProgressChart — real 7-day activity from the backend.
 *
 * Props:
 *   weeklyActivity  {Array}   from /api/users/stats/me — 7 entries with { label, accuracy, problems }
 *   loading         {boolean}
 */
export default function ProgressChart({ weeklyActivity = [], loading = false }) {
    const { t } = useTranslation();

    // If no data at all, show a zeroed placeholder so the chart still renders
    const data = weeklyActivity.length > 0
        ? weeklyActivity
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({
              label: d, accuracy: 0, problems: 0, score: 0,
          }));

    const hasAnyActivity = weeklyActivity.some(d => d.problems > 0);

    return (
        <Card className="border-dark-border">
            <CardHeader>
                <CardTitle>{t('analytics.performance')}</CardTitle>
                <Badge variant="accent" dot>This Week</Badge>
            </CardHeader>

            {loading ? (
                <div className="h-[200px] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                </div>
            ) : !hasAnyActivity ? (
                <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-center">
                    <p className="text-sm text-slate-500">No activity this week yet.</p>
                    <p className="text-xs text-slate-600">Start solving problems to see your progress chart!</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="problemsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2} fill="url(#scoreGrad)" />
                        <Area type="monotone" dataKey="problems" stroke="#06b6d4" strokeWidth={2} fill="url(#problemsGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}

            <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-primary-500 rounded" />
                    <span className="text-xs text-slate-500">Accuracy %</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-accent-500 rounded" />
                    <span className="text-xs text-slate-500">Problems</span>
                </div>
            </div>
        </Card>
    );
}
