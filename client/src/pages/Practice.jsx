import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import { BookOpen, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const TOPIC_NAMES = [
  'Algebra', 'Geometry', 'Trigonometry', 'Calculus',
  'Statistics', 'Probability', 'Functions', 'Quadratics',
];

const SAMPLE_PROBLEM = {
  text: 'If f(x) = x² - 4x + 4, find the vertex of the parabola.',
  options: ['(2, 0)', '(-2, 0)', '(0, 4)', '(4, 0)'],
  correct: 0,
  topic: 'Quadratics',
  difficulty: 'medium',
};

export default function Practice() {
  usePageTitle('Practice');
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // ── Real problems solved per topic from stats ─────────────────────────────
  const [topicMap, setTopicMap] = useState({}); // { topicName: problemCount }

  useEffect(() => {
    fetch(`${SERVER_URL}/api/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && d.data.topicBreakdown) {
          const map = {};
          d.data.topicBreakdown.forEach(({ name, problems }) => {
            map[name] = problems;
          });
          setTopicMap(map);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('nav.practice')}</h1>
          <p className="text-sm text-slate-400 mt-1">Pick a topic or dive into a random problem.</p>
        </div>
      </div>

      {/* Quick practice card */}
      <Card className="border-primary-500/20 bg-gradient-to-br from-primary-600/10 to-dark-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-primary-400" />
            <span className="text-sm font-semibold text-white">Quick Problem</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="primary">{SAMPLE_PROBLEM.topic}</Badge>
            <Badge variant="warning">{SAMPLE_PROBLEM.difficulty}</Badge>
          </div>
        </div>

        <div className="math-block text-sm mb-5">{SAMPLE_PROBLEM.text}</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {SAMPLE_PROBLEM.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { if (!revealed) setSelected(i); }}
              className={clsx(
                'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
                revealed && i === SAMPLE_PROBLEM.correct
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : revealed && i === selected && i !== SAMPLE_PROBLEM.correct
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : selected === i
                  ? 'bg-primary-600/20 border-primary-500/50 text-white'
                  : 'bg-dark-card border-dark-border text-slate-300 hover:border-primary-500/30'
              )}
            >
              <span className="font-mono">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {!revealed ? (
            <Button
              variant="gradient"
              size="sm"
              disabled={selected === null}
              onClick={() => setRevealed(true)}
            >
              Check Answer
            </Button>
          ) : (
            <>
              <Link to="/tutor">
                <Button variant="secondary" size="sm">Explain with AI</Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelected(null); setRevealed(false); }}
              >
                Next Problem
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Topics grid */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Practice by Topic</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TOPIC_NAMES.map(name => {
            const solved = topicMap[name] ?? 0;
            return (
              <Link to="/exam" key={name}>
                <Card className="border-dark-border card-hover cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">{name}</h3>
                    <ChevronRight size={14} className="text-slate-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500">
                    <span className="text-white font-semibold">{solved}</span> problems solved
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
