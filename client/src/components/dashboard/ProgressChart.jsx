import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Badge from '../ui/Badge';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-2xl border border-primary-500/20 p-3.5 shadow-2xl shadow-primary-900/30 min-w-[130px]">
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-400" />
            <span className="text-xs text-slate-400">Accuracy</span>
            <span className="text-xs font-bold text-primary-300 ml-auto">{payload[0]?.value}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-400" />
            <span className="text-xs text-slate-400">Problems</span>
            <span className="text-xs font-bold text-accent-300 ml-auto">{payload[1]?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProgressChart({ weeklyActivity = [], loading = false }) {
  const { t } = useTranslation();

  const data = weeklyActivity.length > 0
    ? weeklyActivity
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({
        label: d, accuracy: 0, problems: 0, score: 0,
      }));

  const hasAnyActivity = weeklyActivity.some(d => d.problems > 0);

  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <TrendingUp size={15} className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('analytics.performance')}</h3>
            <p className="text-xs text-slate-500">Weekly overview</p>
          </div>
        </div>
        <Badge variant="accent" dot>This Week</Badge>
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-600">Loading chart…</p>
          </div>
        </div>
      ) : !hasAnyActivity ? (
        <div className="h-[200px] flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <TrendingUp size={22} className="text-primary-400/50" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">No activity this week</p>
            <p className="text-xs text-slate-600 mt-0.5">Solve problems to see your chart appear here.</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="problemsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,58,237,0.2)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2.5}
              fill="url(#scoreGrad)" dot={false} activeDot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="problems" stroke="#06b6d4" strokeWidth={2}
              fill="url(#problemsGrad)" dot={false} activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-dark-border">
        {[
          { color: 'bg-primary-500', label: 'Accuracy %', dotColor: '#7c3aed' },
          { color: 'bg-accent-500',  label: 'Problems',   dotColor: '#06b6d4' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-3.5 h-0.5 ${color} rounded-full`} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
