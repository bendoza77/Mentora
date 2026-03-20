import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import {
  Clock, ChevronLeft, ChevronRight, Flag, CheckCircle,
  ClipboardCheck, AlertTriangle, TrendingUp, RotateCcw, Lock, Zap,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';
import { useExam } from '../context/ExamContext';
import { ALL_QUESTIONS, TOPIC_NAMES, SECS_PER_QUESTION } from '../data/examQuestions';

// ── Sub-components ────────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const mins   = Math.floor(seconds / 60);
  const secs   = seconds % 60;
  const urgent = seconds < 180;
  return (
    <div className={clsx(
      'flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold',
      urgent
        ? 'bg-red-500/15 border-red-500/30 text-red-400 animate-pulse'
        : 'bg-dark-card border-dark-border text-white'
    )}>
      <Clock size={16} className={urgent ? 'text-red-400' : 'text-slate-400'} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

function QuestionNav({ questions, answers, flagged, current, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {questions.map((q, i) => (
        <button
          key={q.id}
          onClick={() => onSelect(i)}
          className={clsx(
            'w-full aspect-square rounded-lg text-xs font-bold transition-all',
            i === current
              ? 'bg-primary-600 text-white'
              : flagged.has(i)
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
              : answers[i] !== undefined
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-dark-card border border-dark-border text-slate-500 hover:border-primary-500/40'
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExamSim() {
  usePageTitle('Exam Simulation');
  const { t } = useTranslation();
  const { user } = useAuth();

  // ── Plan / monthly exam usage ───────────────────────────────────────────────
  const isFree = user?.plan === 'free' || !user?.plan;
  const [examPlanData, setExamPlanData] = useState({ thisMonthExams: 0, monthlyExamLimit: null });
  const examLimitReached = isFree && examPlanData.monthlyExamLimit !== null
    && examPlanData.thisMonthExams >= examPlanData.monthlyExamLimit;

  // Fetch on mount so the select screen knows the monthly count
  useEffect(() => {
    if (!isFree) return;
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setExamPlanData({
            thisMonthExams:   d.data.thisMonthExams   ?? 0,
            monthlyExamLimit: d.data.monthlyExamLimit ?? 1,
          });
        }
      })
      .catch(() => {});
  }, [isFree]);

  const {
    phase,
    topicFilter, setTopicFilter,
    activeQuestions,
    current, setCurrent,
    answers, setAnswers,
    flagged, setFlagged,
    timeLeft,
    startExam,
    handleSubmit,
    resetExam,
  } = useExam();

  const [showMobileNav, setShowMobileNav] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getFiltered = (topic) =>
    topic === 'All' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.topic === topic);

  const handleStart = () => {
    const qs = getFiltered(topicFilter);
    startExam(qs, topicFilter);
  };

  const selectAnswer = (optIdx) =>
    setAnswers(prev => ({ ...prev, [current]: optIdx }));

  const toggleFlag = () =>
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });

  const buildRadarData = () => {
    const map = {};
    activeQuestions.forEach((q, i) => {
      if (!map[q.topic]) map[q.topic] = { correct: 0, total: 0 };
      if (answers[i] !== undefined) {
        map[q.topic].total  += 1;
        if (answers[i] === q.correct) map[q.topic].correct += 1;
      }
    });
    return Object.entries(map).map(([topic, { correct, total }]) => ({
      topic,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
    }));
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SELECT PHASE
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 'select') {
    const filtered     = getFiltered(topicFilter);
    const qCount       = filtered.length;
    const durationMins = Math.ceil(qCount * SECS_PER_QUESTION / 60);

    return (
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto page-enter">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('exam.title')}</h1>
          <p className="text-slate-400 text-sm mt-1">{t('exam.subtitle')}</p>
        </div>

        {/* Topic filter pills */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
            Filter by Topic
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_NAMES.map(topic => (
              <button
                key={topic}
                onClick={() => setTopicFilter(topic)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all border',
                  topicFilter === topic
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-dark-card border-dark-border text-slate-400 hover:border-primary-500/40 hover:text-white'
                )}
              >
                {topic}
                {topic !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-50">
                    {ALL_QUESTIONS.filter(q => q.topic === topic).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Start exam card — locked if free user hit monthly limit */}
        {examLimitReached ? (
          <div className="rounded-2xl border border-primary-500/20 bg-primary-600/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={15} className="text-primary-400" />
                  <h3 className="text-base font-bold text-white">Monthly Exam Limit Reached</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Free plan allows <span className="text-white font-semibold">1 mock exam per month</span>.
                  You've already used yours this month.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Used: {examPlanData.thisMonthExams}/{examPlanData.monthlyExamLimit} this month
                </p>
              </div>
              <Link
                to="/pricing"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                <Zap size={14} /> Upgrade to Pro
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="glass rounded-2xl border border-primary-500/30 p-6 cursor-pointer group hover:border-primary-500/60 transition-all"
            onClick={handleStart}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                  {topicFilter === 'All' ? 'Full Math Exam' : `${topicFilter} Exam`}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ClipboardCheck size={13} /> {qCount} questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> ~{durationMins} min
                  </span>
                  <Badge variant="ghost">
                    {topicFilter === 'All' ? 'Mixed Topics' : 'Topic Focus'}
                  </Badge>
                  {isFree && examPlanData.monthlyExamLimit !== null && (
                    <span className="text-xs text-amber-400 font-medium">
                      {examPlanData.thisMonthExams}/{examPlanData.monthlyExamLimit} used this month
                    </span>
                  )}
                </div>
              </div>
              <Button variant="gradient" size="sm">{t('exam.start')}</Button>
            </div>
          </div>
        )}

        {/* Topic overview grid */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
            Questions per Topic
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOPIC_NAMES.filter(tp => tp !== 'All').map(topic => {
              const count    = ALL_QUESTIONS.filter(q => q.topic === topic).length;
              const isActive = topicFilter === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setTopicFilter(topic)}
                  className={clsx(
                    'p-3 rounded-xl border text-left transition-all',
                    isActive
                      ? 'bg-primary-600/20 border-primary-500/40'
                      : 'bg-dark-card border-dark-border hover:border-primary-500/30'
                  )}
                >
                  <p className={clsx('text-sm font-semibold', isActive ? 'text-primary-300' : 'text-white')}>
                    {topic}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{count} questions</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULTS PHASE
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 'results') {
    const correctCount = Object.entries(answers)
      .filter(([i, a]) => activeQuestions[+i]?.correct === a).length;
    const total     = activeQuestions.length;
    const pct       = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed    = pct >= 60;
    const skipped   = total - Object.keys(answers).length;
    const incorrect = Object.keys(answers).length - correctCount;
    const radarData = buildRadarData();

    return (
      <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full page-enter">
        {/* Score circle */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-primary-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-extrabold gradient-text">{pct}%</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{t('exam.results')}</h2>
          <Badge variant={passed ? 'success' : 'danger'} dot className="mt-2">
            {passed ? 'Passed' : 'Keep Practicing'}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: t('exam.correct'),   val: correctCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: t('exam.incorrect'), val: incorrect,    color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
            { label: t('exam.skipped'),   val: skipped,      color: 'text-slate-400',   bg: 'bg-dark-card border-dark-border' },
          ].map(({ label, val, color, bg }, i) => (
            <div key={label} className={`card-enter rounded-2xl border ${bg} p-5 text-center`} style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`text-3xl font-extrabold ${color} mb-1`}>{val}</div>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Per-topic breakdown */}
          <div className="glass rounded-2xl border border-dark-border p-5">
            <h3 className="text-sm font-semibold text-white mb-4">{t('exam.breakdown')}</h3>
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-3">
                {radarData.length === 0
                  ? <p className="text-xs text-slate-500">No answered questions to display.</p>
                  : radarData.map(({ topic, score }) => (
                    <div key={topic}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{topic}</span>
                        <span className="text-slate-500 font-mono">{score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Answer review */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            <h3 className="text-sm font-semibold text-white">{t('exam.reviewAnswers')}</h3>
            {activeQuestions.map((q, i) => {
              const answered = answers[i] !== undefined;
              const correct  = answers[i] === q.correct;
              return (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-dark-card border border-dark-border">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    !answered ? 'bg-slate-700' : correct ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {!answered
                      ? <span className="text-xs text-slate-500">–</span>
                      : correct
                      ? <CheckCircle size={12} className="text-emerald-400" />
                      : <AlertTriangle size={12} className="text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed truncate">{q.text}</p>
                    {!correct && answered && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Correct: {q.options[q.correct]}
                      </p>
                    )}
                  </div>
                  <Badge variant="ghost" className="shrink-0 text-[10px]">{q.topic}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <Button
            variant="secondary"
            icon={<RotateCcw size={15} />}
            onClick={resetExam}
          >
            {t('exam.retake')}
          </Button>
          <Link to="/analytics">
            <Button variant="gradient" icon={<TrendingUp size={15} />}>
              {t('dashboard.viewAnalytics')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EXAM PHASE
  // ══════════════════════════════════════════════════════════════════════════
  const q         = activeQuestions[current];
  const answered  = Object.keys(answers).length;
  const isFlagged = flagged.has(current);

  if (!q) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-dark-border bg-dark-surface gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ClipboardCheck size={16} className="text-primary-400 shrink-0" />
          <span className="text-sm font-semibold text-white truncate">
            {topicFilter === 'All' ? 'Full Math Exam' : `${topicFilter}`}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="text-emerald-400 font-medium">{answered} {t('exam.answered')}</span>
            <span className="text-amber-400 font-medium">{flagged.size} {t('exam.flagged')}</span>
          </div>
          <Timer seconds={timeLeft} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-dark-muted">
        <div
          className="progress-bar h-full"
          style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Question content — key forces re-animation on every question change */}
          <div key={current} className="question-enter">
          {/* Question meta */}
          <div className="flex items-start sm:items-center justify-between mb-5 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                {t('exam.question')} {current + 1}/{activeQuestions.length}
              </span>
              <Badge variant="ghost">{q.topic}</Badge>
              <Badge variant={
                q.difficulty === 'easy' ? 'success' :
                q.difficulty === 'hard' ? 'danger' : 'warning'
              }>
                {q.difficulty}
              </Badge>
            </div>
            <button
              onClick={toggleFlag}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
                isFlagged
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                  : 'bg-dark-card border border-dark-border text-slate-500 hover:text-amber-400'
              )}
            >
              <Flag size={13} />
              <span className="hidden sm:inline">{isFlagged ? t('exam.flagged') : t('exam.mark')}</span>
            </button>
          </div>

          {/* Question text */}
          <div className="math-block text-base mb-8 font-medium text-slate-100 leading-relaxed">
            {q.text}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={clsx(
                  'card-enter w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200',
                  answers[current] === i
                    ? 'bg-primary-600/20 border-primary-500/50 text-white'
                    : 'bg-dark-card border-dark-border text-slate-300 hover:border-primary-500/30 hover:text-white'
                )}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span className={clsx(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                  answers[current] === i
                    ? 'border-primary-500 bg-primary-600 text-white'
                    : 'border-dark-muted text-slate-600'
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-mono text-sm">{opt}</span>
              </button>
            ))}
          </div>
          </div>{/* end question-enter wrapper */}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 flex-col border-l border-dark-border bg-dark-surface/60 p-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
              {t('exam.questions')}
            </p>
            <QuestionNav
              questions={activeQuestions}
              answers={answers}
              flagged={flagged}
              current={current}
              onSelect={setCurrent}
            />
          </div>
          <div className="space-y-2 text-xs">
            {[
              { color: 'bg-primary-600',                                 label: 'Current' },
              { color: 'bg-emerald-500/30 border border-emerald-500/30', label: t('exam.answered') },
              { color: 'bg-amber-500/20 border border-amber-500/30',     label: t('exam.flagged') },
              { color: 'bg-dark-card border border-dark-border',         label: t('exam.unanswered') },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded ${color}`} />
                <span className="text-slate-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <Button variant="danger" full size="sm" onClick={handleSubmit}>
              {t('exam.submit')}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-t border-dark-border bg-dark-surface gap-2">
        <Button
          variant="ghost" size="sm"
          icon={<ChevronLeft size={16} />}
          disabled={current === 0}
          onClick={() => setCurrent(c => c - 1)}
        >
          <span className="hidden sm:inline">{t('exam.prev')}</span>
        </Button>

        {/* Mobile: Questions button */}
        <button
          onClick={() => setShowMobileNav(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-400 hover:text-white transition-all"
        >
          <span className="font-mono font-bold text-white">{current + 1}/{activeQuestions.length}</span>
          <span className="text-slate-600">·</span>
          <span>{Object.keys(answers).length} answered</span>
        </button>

        {/* Desktop counter */}
        <span className="hidden lg:block text-sm text-slate-500">{current + 1} / {activeQuestions.length}</span>

        {current === activeQuestions.length - 1 ? (
          <Button variant="gradient" size="sm" onClick={handleSubmit}>
            {t('exam.submit')}
          </Button>
        ) : (
          <Button
            variant="ghost" size="sm"
            iconRight={<ChevronRight size={16} />}
            onClick={() => setCurrent(c => c + 1)}
          >
            <span className="hidden sm:inline">{t('exam.next')}</span>
          </Button>
        )}
      </div>

      {/* Mobile Question Navigator Modal */}
      {showMobileNav && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
          onClick={() => setShowMobileNav(false)}
        >
          <div
            className="w-full bg-dark-surface border-t border-dark-border rounded-t-2xl p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">{t('exam.questions')}</p>
              <button
                onClick={() => setShowMobileNav(false)}
                className="text-slate-500 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border transition-colors"
              >
                Close
              </button>
            </div>
            <QuestionNav
              questions={activeQuestions}
              answers={answers}
              flagged={flagged}
              current={current}
              onSelect={(i) => { setCurrent(i); setShowMobileNav(false); }}
            />
            <div className="flex gap-3 mt-5">
              <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1 text-xs">
                {[
                  { color: 'bg-primary-600', label: 'Current' },
                  { color: 'bg-emerald-500/30 border border-emerald-500/30', label: t('exam.answered') },
                  { color: 'bg-amber-500/20 border border-amber-500/30', label: t('exam.flagged') },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
              <Button variant="danger" size="sm" onClick={() => { setShowMobileNav(false); handleSubmit(); }}>
                {t('exam.submit')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
