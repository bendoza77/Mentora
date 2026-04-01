import { useTranslation } from 'react-i18next';
import { Check, X, BookOpen, Activity } from 'lucide-react';
import Badge from '../ui/Badge';

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'danger' };
const difficultyColor   = {
  easy:   'text-emerald-400 bg-emerald-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  hard:   'text-red-400 bg-red-500/10',
};

function timeAgo(timestamp) {
  const diff    = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentActivity({ activities = [], loading = false }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <Activity size={15} className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('dashboard.recentActivity')}</h3>
            <p className="text-xs text-slate-500">Your latest problem attempts</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
          activities.length > 0 ? 'bg-primary-500/10 text-primary-400' : 'bg-dark-muted text-slate-600'
        }`}>
          {activities.length > 0 ? `${activities.length} recent` : 'No activity'}
        </span>
      </div>

      {loading ? (
        <div className="divide-y divide-dark-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-dark-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-dark-muted rounded w-1/3" />
                <div className="h-2.5 bg-dark-muted rounded w-1/5" />
              </div>
              <div className="w-16 h-6 bg-dark-muted rounded-full" />
              <div className="w-12 h-5 bg-dark-muted rounded" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-4 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <BookOpen size={24} className="text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">No activity yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Complete your first practice problem or exam to start tracking your progress here.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-dark-border/60">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2 bg-dark-surface/40">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Topic</span>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Result</span>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Difficulty</span>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Time</span>
          </div>
          {activities.map((act, i) => (
            <div
              key={i}
              className="flex sm:grid sm:grid-cols-[1fr_auto_auto_auto] items-center gap-3 sm:gap-4
                         px-5 py-3.5 hover:bg-white/[0.02] transition-colors group card-enter"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Topic */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  act.correct ? 'bg-emerald-500/12' : 'bg-red-500/12'
                }`}>
                  {act.correct
                    ? <Check size={14} className="text-emerald-400" />
                    : <X     size={14} className="text-red-400" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {act.topic}
                  </p>
                  <p className="text-xs text-slate-600 sm:hidden">{timeAgo(act.timestamp)}</p>
                </div>
              </div>

              {/* Result badge */}
              <span className={`shrink-0 hidden sm:flex text-xs font-bold px-2.5 py-1 rounded-lg ${
                act.correct
                  ? 'bg-emerald-500/12 text-emerald-400'
                  : 'bg-red-500/12 text-red-400'
              }`}>
                {act.correct ? '✓ Correct' : '✗ Wrong'}
              </span>

              {/* Difficulty */}
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg capitalize
                              ${difficultyColor[act.difficulty] || 'bg-dark-muted text-slate-500'}`}>
                {act.difficulty}
              </span>

              {/* Time */}
              <span className="shrink-0 hidden sm:block text-xs text-slate-600 text-right min-w-[60px]">
                {timeAgo(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
