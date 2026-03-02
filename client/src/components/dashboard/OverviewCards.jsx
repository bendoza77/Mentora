import { useTranslation } from 'react-i18next';
import { Flame, BookOpen, Target, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

/**
 * OverviewCards — shows the user's 4 key stats from the backend.
 *
 * Props (all from Dashboard.jsx via /api/users/stats/me):
 *   streak          {number}       days in a row the user has logged in
 *   problemsSolved  {number}       total problems ever attempted
 *   accuracy        {number}       0-100, derived from correctAnswers / totalAttempts
 *   latestExamScore {number|null}  most recent exam score (null = never taken one)
 *   latestExamMax   {number}       max score for that exam (default 100)
 *   loading         {boolean}      show skeleton while fetching
 */
export default function OverviewCards({
    streak          = 0,
    problemsSolved  = 0,
    accuracy        = 0,
    latestExamScore = null,
    latestExamMax   = 100,
    loading         = false,
}) {
    const { t } = useTranslation();

    // Format accuracy as "78%" or "—" when no attempts yet
    const accuracyDisplay = problemsSolved > 0 ? `${accuracy}%` : '—';

    // Format exam score as "74 / 100" or "—" when never taken an exam
    const examDisplay = latestExamScore !== null
        ? `${latestExamScore}`
        : '—';
    const examUnit = latestExamScore !== null ? `/ ${latestExamMax}` : '';

    const CARDS = [
        {
            key:     'streak',
            icon:    Flame,
            value:   streak,
            unit:    streak === 1 ? 'day' : 'days',
            color:   'text-amber-400',
            bg:      'bg-amber-500/10',
            border:  'border-amber-500/20',
            // Trend: encouraging message based on streak length
            trend:   streak >= 7  ? '🔥 On fire!'    :
                     streak >= 3  ? 'Keep it up!'    :
                     streak === 1 ? 'Day 1 — start!' : null,
            trendUp: streak >= 3 ? true : null,
        },
        {
            key:     'problemsSolved',
            icon:    BookOpen,
            value:   problemsSolved,
            unit:    'total',
            color:   'text-primary-400',
            bg:      'bg-primary-500/10',
            border:  'border-primary-500/20',
            trend:   problemsSolved > 0 ? `${problemsSolved} solved` : 'Start practicing!',
            trendUp: problemsSolved > 0 ? true : null,
        },
        {
            key:     'accuracy',
            icon:    Target,
            value:   accuracyDisplay,
            unit:    '',
            color:   'text-emerald-400',
            bg:      'bg-emerald-500/10',
            border:  'border-emerald-500/20',
            // Trend based on how good the accuracy is
            trend:   problemsSolved === 0 ? 'No attempts yet' :
                     accuracy >= 80 ? 'Excellent!'          :
                     accuracy >= 60 ? 'Good progress'       :
                     accuracy >= 40 ? 'Keep practicing'     : 'Needs work',
            trendUp: accuracy >= 60 ? true : accuracy > 0 ? false : null,
        },
        {
            key:     'examScore',
            icon:    TrendingUp,
            value:   examDisplay,
            unit:    examUnit,
            color:   'text-accent-400',
            bg:      'bg-accent-500/10',
            border:  'border-accent-500/20',
            trend:   latestExamScore !== null
                         ? `${Math.round((latestExamScore / latestExamMax) * 100)}% score`
                         : 'Take a mock exam',
            trendUp: latestExamScore !== null
                         ? latestExamScore / latestExamMax >= 0.6
                         : null,
        },
    ];

    if (loading) {
        return (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-dark-border animate-pulse">
                        <div className="w-10 h-10 bg-dark-border rounded-xl mb-4" />
                        <div className="h-8 w-16 bg-dark-border rounded mb-2" />
                        <div className="h-3 w-24 bg-dark-border rounded" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {CARDS.map(({ key, icon: Icon, value, unit, color, bg, border, trend, trendUp }) => (
                <Card key={key} className={`border ${border} card-hover`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                            <Icon size={20} className={color} />
                        </div>
                        {trend && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                                trendUp === true  ? 'bg-emerald-500/10 text-emerald-400' :
                                trendUp === false ? 'bg-red-500/10 text-red-400'         :
                                'bg-dark-border text-slate-500'
                            }`}>
                                {trendUp === true && '↑ '}{trendUp === false && '↓ '}{trend}
                            </span>
                        )}
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-extrabold text-white">{value}</span>
                        {unit && <span className="text-sm text-slate-500 mb-1 ml-0.5">{unit}</span>}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{t(`dashboard.${key}`)}</p>
                </Card>
            ))}
        </div>
    );
}
