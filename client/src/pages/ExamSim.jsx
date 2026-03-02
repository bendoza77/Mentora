import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import {
  Clock, ChevronLeft, ChevronRight, Flag, CheckCircle,
  ClipboardCheck, AlertTriangle, TrendingUp, RotateCcw,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import clsx from 'clsx';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';

const SERVER_API = import.meta.env.VITE_SERVER_URL + '/api';

// ── 38 real 10th-grade math questions ────────────────────────────────────────
const ALL_QUESTIONS = [
  // ── ALGEBRA ──────────────────────────────────────────────────────────────
  {
    id: 1, topic: 'Algebra', difficulty: 'medium',
    text: 'Solve for x: 3x² - 12x + 9 = 0',
    options: ['x = 1 or x = 3', 'x = 2 or x = 4', 'x = -1 or x = -3', 'x = 3 only'],
    correct: 0,
  },
  {
    id: 2, topic: 'Algebra', difficulty: 'easy',
    text: 'Simplify: (3x² × 2x³) / 6x',
    options: ['x⁴', 'x³', 'x²', '6x⁴'],
    correct: 0,
  },
  {
    id: 3, topic: 'Algebra', difficulty: 'medium',
    text: 'If 2(x + 3) = 5x - 9, what is x?',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    id: 4, topic: 'Algebra', difficulty: 'hard',
    text: 'Find all real solutions: x⁴ - 5x² + 4 = 0',
    options: ['x = ±1, ±2', 'x = ±1, ±4', 'x = ±2, ±4', 'x = ±1 only'],
    correct: 0,
  },
  {
    id: 5, topic: 'Algebra', difficulty: 'medium',
    text: 'Factor completely: 6x² + 7x - 3',
    options: ['(2x + 3)(3x - 1)', '(3x + 1)(2x - 3)', '(6x - 1)(x + 3)', '(2x - 1)(3x + 3)'],
    correct: 0,
  },
  {
    id: 6, topic: 'Algebra', difficulty: 'easy',
    text: 'Which values of x satisfy |2x - 6| = 10?',
    options: ['x = 8 or x = -2', 'x = 8 only', 'x = -2 only', 'x = 3 or x = -2'],
    correct: 0,
  },

  // ── GEOMETRY ─────────────────────────────────────────────────────────────
  {
    id: 7, topic: 'Geometry', difficulty: 'easy',
    text: 'The area of a circle with diameter 10 cm is:',
    options: ['25π cm²', '50π cm²', '100π cm²', '10π cm²'],
    correct: 0,
  },
  {
    id: 8, topic: 'Geometry', difficulty: 'easy',
    text: 'In a right triangle with legs 6 and 8, the hypotenuse is:',
    options: ['10', '12', '14', '100'],
    correct: 0,
  },
  {
    id: 9, topic: 'Geometry', difficulty: 'medium',
    text: 'The sum of interior angles of a regular hexagon is:',
    options: ['360°', '540°', '720°', '900°'],
    correct: 2,
  },
  {
    id: 10, topic: 'Geometry', difficulty: 'medium',
    text: 'Two parallel lines are cut by a transversal. If one alternate interior angle is 65°, the other is:',
    options: ['115°', '65°', '25°', '180°'],
    correct: 1,
  },
  {
    id: 11, topic: 'Geometry', difficulty: 'hard',
    text: 'A cone has radius 3 cm and height 4 cm. Its volume is:',
    options: ['12π cm³', '16π cm³', '36π cm³', '48π cm³'],
    correct: 0,
  },
  {
    id: 12, topic: 'Geometry', difficulty: 'medium',
    text: 'The diagonal of a square with side 5 cm is:',
    options: ['5√2 cm', '10 cm', '5√3 cm', '25 cm'],
    correct: 0,
  },

  // ── TRIGONOMETRY ──────────────────────────────────────────────────────────
  {
    id: 13, topic: 'Trigonometry', difficulty: 'easy',
    text: 'What is sin(30°) + cos(60°)?',
    options: ['0', '1', '√2', '1/2'],
    correct: 1,
  },
  {
    id: 14, topic: 'Trigonometry', difficulty: 'medium',
    text: 'If sin(θ) = 3/5 and θ is in the first quadrant, what is cos(θ)?',
    options: ['4/5', '3/4', '5/3', '4/3'],
    correct: 0,
  },
  {
    id: 15, topic: 'Trigonometry', difficulty: 'easy',
    text: 'What is tan(45°)?',
    options: ['0', '1', '√2', '√3/2'],
    correct: 1,
  },
  {
    id: 16, topic: 'Trigonometry', difficulty: 'hard',
    text: 'Using the identity sin²(x) + cos²(x) = 1, simplify: 1 + tan²(x)',
    options: ['sin²(x)', 'sec²(x)', 'csc²(x)', 'cos²(x)'],
    correct: 1,
  },
  {
    id: 17, topic: 'Trigonometry', difficulty: 'medium',
    text: 'The value of cos(120°) is:',
    options: ['-1/2', '1/2', '-√3/2', '√3/2'],
    correct: 0,
  },

  // ── FUNCTIONS ─────────────────────────────────────────────────────────────
  {
    id: 18, topic: 'Functions', difficulty: 'medium',
    text: 'If f(x) = 2x + 3, what is f(f(2))?',
    options: ['10', '13', '17', '21'],
    correct: 2,
  },
  {
    id: 19, topic: 'Functions', difficulty: 'easy',
    text: 'What is the domain of f(x) = √(x - 4)?',
    options: ['x ≥ 4', 'x > 4', 'x ≥ -4', 'all real numbers'],
    correct: 0,
  },
  {
    id: 20, topic: 'Functions', difficulty: 'medium',
    text: 'If g(x) = x² - 1, what is g(x + 1)?',
    options: ['x²', 'x² + 2x', 'x² + 1', 'x² + 2x - 1'],
    correct: 1,
  },
  {
    id: 21, topic: 'Functions', difficulty: 'medium',
    text: 'If f(x) = 3x - 1, find f⁻¹(x).',
    options: ['(x + 1)/3', '(x - 1)/3', '3x + 1', '1/(3x - 1)'],
    correct: 0,
  },
  {
    id: 22, topic: 'Functions', difficulty: 'hard',
    text: 'If h(x) = f(g(x)) where f(x) = x² and g(x) = 2x + 1, what is h(3)?',
    options: ['37', '49', '13', '25'],
    correct: 1,
  },

  // ── QUADRATICS ────────────────────────────────────────────────────────────
  {
    id: 23, topic: 'Quadratics', difficulty: 'medium',
    text: 'If f(x) = x² - 4x + 4, find the vertex of the parabola.',
    options: ['(2, 0)', '(-2, 0)', '(0, 4)', '(4, 0)'],
    correct: 0,
  },
  {
    id: 24, topic: 'Quadratics', difficulty: 'easy',
    text: 'What is the discriminant of x² - 5x + 6 = 0?',
    options: ['1', '25', '-24', '49'],
    correct: 0,
  },
  {
    id: 25, topic: 'Quadratics', difficulty: 'medium',
    text: 'The roots of x² - 7x + 10 = 0 are:',
    options: ['x = 2, x = 5', 'x = -2, x = -5', 'x = 2, x = -5', 'x = 1, x = 10'],
    correct: 0,
  },
  {
    id: 26, topic: 'Quadratics', difficulty: 'hard',
    text: 'A parabola y = ax² + bx + c has vertex (1, -3) and passes through (0, -2). Find a.',
    options: ['1', '-1', '2', '-2'],
    correct: 0,
  },

  // ── STATISTICS ────────────────────────────────────────────────────────────
  {
    id: 27, topic: 'Statistics', difficulty: 'easy',
    text: 'The mean of {4, 7, 10, 13, 16} is:',
    options: ['9', '10', '11', '12'],
    correct: 1,
  },
  {
    id: 28, topic: 'Statistics', difficulty: 'easy',
    text: 'The median of {3, 7, 5, 1, 9} is:',
    options: ['5', '7', '4', '6'],
    correct: 0,
  },
  {
    id: 29, topic: 'Statistics', difficulty: 'medium',
    text: 'Standard deviation measures the _____ of data values around the mean.',
    options: ['spread', 'center', 'frequency', 'sum'],
    correct: 0,
  },
  {
    id: 30, topic: 'Statistics', difficulty: 'medium',
    text: 'The mean of five numbers is 12. Four of them are 8, 10, 14, 16. What is the fifth?',
    options: ['12', '10', '14', '16'],
    correct: 0,
  },

  // ── PROBABILITY ───────────────────────────────────────────────────────────
  {
    id: 31, topic: 'Probability', difficulty: 'easy',
    text: 'A fair die is rolled. Probability of getting a number greater than 4:',
    options: ['1/6', '2/6', '3/6', '4/6'],
    correct: 1,
  },
  {
    id: 32, topic: 'Probability', difficulty: 'easy',
    text: 'A bag has 3 red and 5 blue balls. Probability of drawing a red ball:',
    options: ['3/8', '5/8', '3/5', '1/3'],
    correct: 0,
  },
  {
    id: 33, topic: 'Probability', difficulty: 'medium',
    text: 'Two coins are tossed. Probability of getting exactly one head:',
    options: ['1/4', '1/2', '3/4', '1'],
    correct: 1,
  },
  {
    id: 34, topic: 'Probability', difficulty: 'hard',
    text: 'Cards numbered 1–20 are shuffled. Probability of drawing a prime number:',
    options: ['2/5', '1/4', '7/20', '9/20'],
    correct: 0,
  },

  // ── CALCULUS ──────────────────────────────────────────────────────────────
  {
    id: 35, topic: 'Calculus', difficulty: 'medium',
    text: 'What is the derivative of f(x) = 3x⁴ - 2x² + 5?',
    options: ['12x³ - 4x', '12x³ - 4x + 5', '3x³ - 2x', '12x⁴ - 4x²'],
    correct: 0,
  },
  {
    id: 36, topic: 'Calculus', difficulty: 'medium',
    text: 'The indefinite integral of 2x dx is:',
    options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
    correct: 0,
  },
  {
    id: 37, topic: 'Calculus', difficulty: 'hard',
    text: 'At what x-value does f(x) = x³ - 3x² have a local minimum?',
    options: ['x = 0', 'x = 2', 'x = -2', 'x = 1'],
    correct: 1,
  },
  {
    id: 38, topic: 'Calculus', difficulty: 'hard',
    text: 'What is the limit: lim(x→0) [sin(x) / x]?',
    options: ['0', '1', '∞', 'undefined'],
    correct: 1,
  },
];

const TOPIC_NAMES = ['All', 'Algebra', 'Geometry', 'Trigonometry', 'Functions', 'Quadratics', 'Statistics', 'Probability', 'Calculus'];
const SECS_PER_QUESTION = 90; // 1.5 min per question

// ── Sub-components ────────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
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

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExamSim() {
  usePageTitle('Exam Simulation');
  const { t } = useTranslation();

  const [phase, setPhase]               = useState('select'); // select | exam | results
  const [topicFilter, setTopicFilter]   = useState('All');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [current, setCurrent]           = useState(0);
  const [answers, setAnswers]           = useState({});
  const [flagged, setFlagged]           = useState(new Set());
  const [timeLeft, setTimeLeft]         = useState(0);

  const timerRef    = useRef(null);
  const submittingRef = useRef(false); // prevents double-submit (stale-closure safe)

  // Keep a ref to latest answers + activeQuestions for use inside timer callback
  const answersRef         = useRef(answers);
  const activeQuestionsRef = useRef(activeQuestions);
  const topicFilterRef     = useRef(topicFilter);
  useEffect(() => { answersRef.current = answers; },                [answers]);
  useEffect(() => { activeQuestionsRef.current = activeQuestions; }, [activeQuestions]);
  useEffect(() => { topicFilterRef.current = topicFilter; },        [topicFilter]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Fire submit through refs so we always have fresh state
          setTimeout(() => recordAndFinish(answersRef.current, activeQuestionsRef.current, topicFilterRef.current), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Core: record stats then show results ───────────────────────────────────
  const recordAndFinish = async (currentAnswers, currentQuestions, currentTopic) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    clearInterval(timerRef.current);

    const correctCount = Object.entries(currentAnswers)
      .filter(([i, a]) => currentQuestions[+i]?.correct === a).length;
    const total   = currentQuestions.length;
    const pct     = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const subject = currentTopic === 'All' ? 'Math' : currentTopic;

    try {
      // 1) Record each answered question as individual activity
      await Promise.all(
        Object.entries(currentAnswers).map(([i, a]) => {
          const q = currentQuestions[+i];
          if (!q) return Promise.resolve();
          return fetch(`${SERVER_API}/users/stats/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              topic: q.topic,
              correct: a === q.correct,
              difficulty: q.difficulty,
            }),
          });
        })
      );

      // 2) Record overall exam score
      await fetch(`${SERVER_API}/users/stats/exam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score: pct, maxScore: 100, subject }),
      });
    } catch (err) {
      console.error('[ExamSim] stats recording failed:', err);
    }

    submittingRef.current = false;
    setPhase('results');
  };

  // Called from submit buttons (has direct access to current state)
  const handleSubmit = () => recordAndFinish(answers, activeQuestions, topicFilter);

  // ── Select helpers ─────────────────────────────────────────────────────────
  const getFiltered = (topic) =>
    topic === 'All' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.topic === topic);

  const startExam = () => {
    const qs = getFiltered(topicFilter);
    submittingRef.current = false;
    setActiveQuestions(qs);
    setTimeLeft(qs.length * SECS_PER_QUESTION);
    setCurrent(0);
    setAnswers({});
    setFlagged(new Set());
    setPhase('exam');
  };

  // ── Answer helpers ─────────────────────────────────────────────────────────
  const selectAnswer = (optIdx) => setAnswers(prev => ({ ...prev, [current]: optIdx }));
  const toggleFlag   = () => setFlagged(prev => {
    const n = new Set(prev);
    n.has(current) ? n.delete(current) : n.add(current);
    return n;
  });

  // ── Radar data from actual exam answers ────────────────────────────────────
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
    const filtered   = getFiltered(topicFilter);
    const qCount     = filtered.length;
    const durationMins = Math.ceil(qCount * SECS_PER_QUESTION / 60);

    return (
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto">
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

        {/* Start exam card */}
        <div
          className="glass rounded-2xl border border-primary-500/30 p-6 cursor-pointer group hover:border-primary-500/60 transition-all"
          onClick={startExam}
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
              </div>
            </div>
            <Button variant="gradient" size="sm">{t('exam.start')}</Button>
          </div>
        </div>

        {/* Topic overview grid */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
            Questions per Topic
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOPIC_NAMES.filter(t => t !== 'All').map(topic => {
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
      <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
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
          ].map(({ label, val, color, bg }) => (
            <div key={label} className={`rounded-2xl border ${bg} p-5 text-center`}>
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
            onClick={() => { setPhase('select'); setAnswers({}); setFlagged(new Set()); }}
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
  const q          = activeQuestions[current];
  const answered   = Object.keys(answers).length;
  const isFlagged  = flagged.has(current);

  if (!q) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-border bg-dark-surface">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={18} className="text-primary-400" />
          <span className="text-sm font-semibold text-white">
            {topicFilter === 'All' ? 'Full Math Exam' : `${topicFilter} Exam`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
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
          {/* Question meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                {t('exam.question')} {current + 1} {t('exam.of')} {activeQuestions.length}
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
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                isFlagged
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                  : 'bg-dark-card border border-dark-border text-slate-500 hover:text-amber-400'
              )}
            >
              <Flag size={13} />
              {isFlagged ? t('exam.flagged') : t('exam.mark')}
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
                  'w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200',
                  answers[current] === i
                    ? 'bg-primary-600/20 border-primary-500/50 text-white'
                    : 'bg-dark-card border-dark-border text-slate-300 hover:border-primary-500/30 hover:text-white'
                )}
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
        </div>

        {/* Sidebar */}
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
              { color: 'bg-primary-600',                             label: 'Current' },
              { color: 'bg-emerald-500/30 border border-emerald-500/30', label: t('exam.answered') },
              { color: 'bg-amber-500/20 border border-amber-500/30', label: t('exam.flagged') },
              { color: 'bg-dark-card border border-dark-border',     label: t('exam.unanswered') },
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-dark-border bg-dark-surface">
        <Button
          variant="ghost" size="sm"
          icon={<ChevronLeft size={16} />}
          disabled={current === 0}
          onClick={() => setCurrent(c => c - 1)}
        >
          {t('exam.prev')}
        </Button>
        <span className="text-sm text-slate-500">{current + 1} / {activeQuestions.length}</span>
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
            {t('exam.next')}
          </Button>
        )}
      </div>
    </div>
  );
}
