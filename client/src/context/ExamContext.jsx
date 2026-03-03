import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ALL_QUESTIONS, SECS_PER_QUESTION } from '../data/examQuestions';

const ExamContext = createContext(null);

const SERVER_API = import.meta.env.VITE_SERVER_URL + '/api';

export function ExamProvider({ children }) {
  const [phase, setPhase]                     = useState('select');
  const [topicFilter, setTopicFilter]         = useState('All');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [current, setCurrent]                 = useState(0);
  const [answers, setAnswers]                 = useState({});
  const [flagged, setFlagged]                 = useState(new Set());
  const [timeLeft, setTimeLeft]               = useState(0);

  const timerRef      = useRef(null);
  const submittingRef = useRef(false);

  // Refs so timer callback always reads fresh state (avoids stale closures)
  const answersRef         = useRef(answers);
  const activeQuestionsRef = useRef(activeQuestions);
  const topicFilterRef     = useRef(topicFilter);
  useEffect(() => { answersRef.current = answers; },                [answers]);
  useEffect(() => { activeQuestionsRef.current = activeQuestions; }, [activeQuestions]);
  useEffect(() => { topicFilterRef.current = topicFilter; },        [topicFilter]);

  // ── Record stats + transition to results ──────────────────────────────────
  const recordAndFinish = useCallback(async (currentAnswers, currentQuestions, currentTopic) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    clearInterval(timerRef.current);

    const correctCount = Object.entries(currentAnswers)
      .filter(([i, a]) => currentQuestions[+i]?.correct === a).length;
    const total   = currentQuestions.length;
    const pct     = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const subject = currentTopic === 'All' ? 'Math' : currentTopic;

    try {
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
      await fetch(`${SERVER_API}/users/stats/exam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score: pct, maxScore: 100, subject }),
      });
    } catch (err) {
      console.error('[ExamContext] stats recording failed:', err);
    }

    submittingRef.current = false;
    setPhase('results');
  }, []);

  // ── Global timer — keeps running even when user navigates away ─────────────
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => recordAndFinish(
            answersRef.current,
            activeQuestionsRef.current,
            topicFilterRef.current,
          ), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, recordAndFinish]);

  // ── Public API ────────────────────────────────────────────────────────────
  const startExam = useCallback((qs, topic) => {
    submittingRef.current = false;
    clearInterval(timerRef.current);
    setActiveQuestions(qs);
    setTimeLeft(qs.length * SECS_PER_QUESTION);
    setCurrent(0);
    setAnswers({});
    setFlagged(new Set());
    setTopicFilter(topic);
    setPhase('exam');
  }, []);

  const handleSubmit = useCallback(() => {
    recordAndFinish(answersRef.current, activeQuestionsRef.current, topicFilterRef.current);
  }, [recordAndFinish]);

  const resetExam = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase('select');
    setAnswers({});
    setFlagged(new Set());
    setCurrent(0);
  }, []);

  return (
    <ExamContext.Provider value={{
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
    }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExam must be used within ExamProvider');
  return ctx;
}
