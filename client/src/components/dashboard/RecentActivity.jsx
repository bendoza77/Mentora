import { useTranslation } from 'react-i18next';
import { Check, X, BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'danger' };

/** Format a timestamp into a relative "X ago" string */
function timeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1)    return 'just now';
    if (minutes < 60)   return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours   < 24)   return `${hours}h ago`;
    const days  = Math.floor(hours / 24);
    return `${days}d ago`;
}

/**
 * RecentActivity — last N problem attempts from the backend.
 *
 * Props:
 *   activities  {Array}   from /api/users/stats/me → latestActivity
 *   loading     {boolean}
 */
export default function RecentActivity({ activities = [], loading = false }) {
    const { t } = useTranslation();

    return (
        <Card className="border-dark-border">
            <CardHeader>
                <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
                <Badge variant="ghost">
                    {activities.length > 0 ? `${activities.length} recent` : 'No activity yet'}
                </Badge>
            </CardHeader>

            {loading ? (
                <div className="space-y-1">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                            <div className="w-7 h-7 rounded-lg bg-dark-border shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 bg-dark-border rounded w-2/3" />
                                <div className="h-2 bg-dark-border rounded w-1/4" />
                            </div>
                            <div className="w-14 h-5 bg-dark-border rounded-lg" />
                        </div>
                    ))}
                </div>
            ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                        <BookOpen size={22} className="text-primary-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">No activity yet</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Solve your first problem to see your history here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-1">
                    {activities.map((act, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors group"
                        >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                act.correct ? 'bg-emerald-500/15' : 'bg-red-500/15'
                            }`}>
                                {act.correct
                                    ? <Check size={13} className="text-emerald-400" />
                                    : <X     size={13} className="text-red-400"     />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 truncate group-hover:text-white transition-colors">
                                    {act.topic}
                                </p>
                                <p className="text-xs text-slate-600">{timeAgo(act.timestamp)}</p>
                            </div>
                            <Badge variant={difficultyVariant[act.difficulty] || 'ghost'} className="shrink-0">
                                {act.difficulty}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
