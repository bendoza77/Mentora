import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import {
  Send, Sparkles, Lightbulb, Trash2,
  BrainCircuit, Copy, Check, RefreshCw,
  Zap, Lock,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const SERVER_API = import.meta.env.VITE_SERVER_URL + '/api';

// ── Quick-fire prompt suggestions ─────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Solve: 2x² + 5x − 3 = 0',
  'Derivative of f(x) = 3x³ − 2x + 7',
  'sin(60°) × cos(30°) = ?',
  'If log₂(x) = 5, find x',
  'Area of circle with radius 7 cm',
  'Find the vertex of y = x² − 4x + 1',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Replace **bold** markers with <strong> elements */
function applyBold(text) {
  const parts = text.split(/\*\*([^*]+)\*\*/);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-white font-semibold">{p}</strong>
      : p
  );
}

/** Render one line of structured AI output */
function AILine({ line, idx }) {
  if (!line.trim()) return <div key={idx} className="h-2" />;

  // ✅ Answer line → green answer box
  if (line.startsWith('✅')) {
    return (
      <div key={idx} className="mt-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-semibold text-emerald-400 font-mono text-sm">
        {line.replace('✅', '').replace('Answer:', '').trim()}
      </div>
    );
  }

  // 💡 Tip line → accent tip box
  if (line.startsWith('💡')) {
    return (
      <div key={idx} className="mt-2 px-4 py-3 rounded-xl bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs leading-relaxed">
        <span className="font-semibold">Tip · </span>
        {line.replace('💡', '').replace('Tip:', '').trim()}
      </div>
    );
  }

  // ⭐ Exam note → amber highlight
  if (line.startsWith('⭐')) {
    return (
      <div key={idx} className="mt-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium">
        {line}
      </div>
    );
  }

  // 📌 Topic/difficulty meta line → muted label
  if (line.startsWith('📌')) {
    return (
      <div key={idx} className="text-xs text-slate-500 font-medium mb-1">
        {line}
      </div>
    );
  }

  // ─── divider line
  if (/^─+$/.test(line.trim())) {
    return <hr key={idx} className="border-dark-border my-1.5" />;
  }

  // Step N: title → step header with badge
  const stepMatch = line.match(/^Step (\d+):\s*(.+)/);
  if (stepMatch) {
    return (
      <div key={idx} className="flex items-center gap-2.5 mt-4 mb-0.5">
        <span className="w-6 h-6 rounded-full bg-primary-600/30 text-primary-300 text-xs font-bold flex items-center justify-center shrink-0">
          {stepMatch[1]}
        </span>
        <span className="text-sm font-semibold text-primary-200">
          {stepMatch[2]}
        </span>
      </div>
    );
  }

  // Regular text with bold support
  return (
    <p key={idx} className="text-sm text-slate-200 leading-relaxed">
      {applyBold(line)}
    </p>
  );
}

// ── Message components ────────────────────────────────────────────────────────

function UserMessage({ text }) {
  return (
    <div className="flex justify-end slide-from-right">
      <div className="bg-gradient-to-br from-primary-600 to-violet-600
                      text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[78%]
                      leading-relaxed shadow-md shadow-primary-600/20">
        {text}
      </div>
    </div>
  );
}

function AIMessage({ text, isStreaming }) {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 items-start group slide-from-left">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500
                      flex items-center justify-center shrink-0 mt-0.5
                      shadow-md shadow-primary-600/20">
        <Sparkles size={13} className="text-white" />
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[88%]">
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-4 space-y-0.5 relative
                        border border-primary-500/10">
          {text.split('\n').map((line, i) => (
            <AILine key={i} line={line} idx={i} />
          ))}
          {isStreaming && (
            <span className="inline-block w-[2px] h-4 bg-primary-400 ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Copy button */}
        {!isStreaming && (
          <button
            onClick={copyText}
            className="mt-1.5 ml-1 flex items-center gap-1.5 text-[11px] text-slate-600
                       hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy response'}
          </button>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3 items-center slide-from-left">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/25">
        <Sparkles size={13} className="text-white animate-pulse" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-3.5 border border-primary-500/15">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
          <p className="text-xs text-slate-500 ml-2">Mentora AI is thinking…</p>
        </div>
      </div>
    </div>
  );
}

function WelcomeMessage({ user }) {
  return (
    <div className="flex gap-3 items-start slide-from-left">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/25 animate-pulse-glow">
        <Sparkles size={15} className="text-white" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-5 max-w-lg border border-primary-500/15">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Mentora AI</span>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          Hey{user?.fullname ? `, ${user.fullname.split(' ')[0]}` : ''}! 👋 I'm{' '}
          <span className="text-primary-300 font-bold">Mentora AI</span> — your personal math tutor powered by Llama 3.3 70B.
        </p>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Ask me <span className="text-white font-medium">any math question</span> — I'll walk you through it step by step with clear explanations. I specialise in topics from the{' '}
          <span className="text-accent-300 font-medium">Georgian National Exam</span>. 📐
        </p>
        <div className="flex flex-wrap gap-2 mt-3.5">
          {['Step-by-step solutions', 'Instant explanations', 'Exam-focused topics'].map(f => (
            <span key={f} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-primary-600/15 text-primary-300 border border-primary-500/20">
              ✓ {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AITutor() {
  usePageTitle('AI Tutor');
  const { t } = useTranslation();
  const { user } = useAuth();

  // conversation history: [{role: 'user'|'assistant', content: string}]
  const [history, setHistory]         = useState([]);
  const [streamingText, setStreaming] = useState(''); // live AI output
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput]             = useState('');
  const bottomRef = useRef(null);
  const abortRef  = useRef(null); // AbortController for cancelling stream

  // ── Plan / daily usage ──────────────────────────────────────────────────────
  const isFree              = user?.plan === 'free' || !user?.plan;
  const [dailyUsed, setDailyUsed]   = useState(0);
  const [dailyLimit, setDailyLimit] = useState(null); // null = unlimited
  const isLimited = dailyLimit !== null && dailyUsed >= dailyLimit;

  useEffect(() => {
    if (!isFree) return; // Pro/Premium have no limit
    fetch(`${SERVER_API}/users/stats/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setDailyUsed(d.data.dailyAIUsed  ?? 0);
          setDailyLimit(d.data.dailyAILimit ?? 5);
        }
      })
      .catch(() => {});
  }, [isFree]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText, isStreaming]);

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isStreaming || isLimited) return;

    setInput('');

    // Add user turn to history
    const updatedHistory = [...history, { role: 'user', content: userText }];
    setHistory(updatedHistory);
    setIsStreaming(true);
    setStreaming('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${SERVER_API}/ai/chat`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ messages: updatedHistory }),
        signal:      controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        // Daily limit hit — update counter so UI shows locked state
        if (res.status === 429 && errData.code === 'DAILY_AI_LIMIT') {
          setDailyUsed(errData.limit ?? dailyLimit ?? 5);
        }
        throw new Error(errData.message || `Server error ${res.status}`);
      }

      // Successful request — increment local counter for free users
      if (isFree && dailyLimit !== null) {
        setDailyUsed(prev => Math.min(prev + 1, dailyLimit));
      }

      // Read the SSE stream
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;

          try {
            const { text: chunk, error } = JSON.parse(payload);
            if (error) throw new Error(error);
            if (chunk) {
              accumulated += chunk;
              setStreaming(accumulated);
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }

      // Commit the full AI turn to history
      if (accumulated) {
        setHistory(prev => [...prev, { role: 'assistant', content: accumulated }]);
      }
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled
      const errorMsg = `⚠️ ${err.message || 'Mentora AI is unavailable. Please try again.'}`;
      setHistory(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsStreaming(false);
      setStreaming('');
      abortRef.current = null;
    }
  }, [input, history, isStreaming]);

  const clear = () => {
    abortRef.current?.abort();
    setHistory([]);
    setStreaming('');
    setIsStreaming(false);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full page-enter">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="slide-down flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-dark-border bg-dark-surface shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500
                          flex items-center justify-center shadow-lg shadow-primary-600/25 animate-pulse-glow">
            <BrainCircuit size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-white truncate tracking-tight">{t('tutor.title')}</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate font-medium">{t('tutor.subtitle')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary-600/15 text-primary-300 border border-primary-500/20">
            Llama 3.3 · 70B
          </span>

          {/* Daily usage counter (free plan only) */}
          {isFree && dailyLimit !== null && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isLimited
                ? 'bg-red-500/15 border-red-500/25 text-red-400'
                : dailyUsed >= dailyLimit - 1
                ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                : 'bg-dark-card border-dark-border text-slate-400'
            }`}>
              {dailyUsed}/{dailyLimit} uses
            </span>
          )}

          {history.length > 0 && (
            <button
              onClick={clear}
              title="Clear conversation"
              className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Quick prompts ───────────────────────────────────────────────────── */}
      <div className="slide-down px-3 sm:px-5 py-2.5 border-b border-dark-border bg-dark-surface/60
                      flex gap-2 overflow-x-auto no-scrollbar shrink-0" style={{ animationDelay: '60ms' }}>
        <span className="shrink-0 text-[11px] font-bold text-slate-600 flex items-center pr-1">Try:</span>
        {QUICK_PROMPTS.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={isStreaming}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border
                       text-slate-400 hover:text-primary-300 hover:border-primary-500/30 hover:bg-primary-600/8
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Welcome */}
        <WelcomeMessage user={user} />

        {/* Conversation history */}
        {history.map((msg, i) =>
          msg.role === 'user'
            ? <UserMessage key={i} text={msg.content} />
            : <AIMessage   key={i} text={msg.content} isStreaming={false} />
        )}

        {/* Live streaming AI message */}
        {isStreaming && streamingText && (
          <AIMessage text={streamingText} isStreaming={true} />
        )}

        {/* Thinking dots (while waiting for first chunk) */}
        {isStreaming && !streamingText && <ThinkingBubble />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ──────────────────────────────────────────────────────── */}
      <div className="slide-up px-3 sm:px-5 py-3 sm:py-4 border-t border-dark-border bg-dark-surface shrink-0" style={{ animationDelay: '80ms' }}>

        {/* Upgrade banner when daily limit is reached */}
        {isLimited && (
          <div className="mb-3 flex items-center justify-between gap-4 px-4 py-3 rounded-xl
                          bg-gradient-to-r from-primary-600/12 to-violet-600/8 border border-primary-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-600/20 flex items-center justify-center shrink-0">
                <Lock size={13} className="text-primary-400" />
              </div>
              <p className="text-sm text-slate-300">
                You've used all <span className="text-white font-bold">{dailyLimit} free questions</span> for today.
              </p>
            </div>
            <Link
              to="/pricing"
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                         bg-gradient-to-r from-primary-600 to-violet-600
                         text-white text-xs font-bold hover:from-primary-500 hover:to-violet-500
                         active:scale-95 transition-all shadow-sm shadow-primary-600/25"
            >
              <Zap size={11} /> Upgrade to Pro
            </Link>
          </div>
        )}

        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isLimited ? 'Daily limit reached — upgrade to Pro for unlimited access' : t('tutor.inputPlaceholder')}
              rows={1}
              disabled={isLimited}
              style={{ resize: 'none' }}
              className={`w-full rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600
                          focus:outline-none transition-all duration-200 ${
                isLimited
                  ? 'bg-dark-card border border-dark-border opacity-50 cursor-not-allowed'
                  : 'bg-dark-card border border-dark-border focus:border-primary-500/50 focus:bg-dark-card/80 focus:shadow-lg focus:shadow-primary-600/10'
              }`}
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Hint button */}
            <button
              onClick={() => send('Give me a hint for this problem')}
              disabled={isStreaming || history.length === 0 || isLimited}
              title="Ask for a hint"
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400
                         hover:bg-amber-500/20 disabled:opacity-25 disabled:cursor-not-allowed
                         transition-all active:scale-95"
            >
              <Lightbulb size={17} />
            </button>

            {/* New problem button */}
            <button
              onClick={() => send('Give me a random 10th-grade math problem to practice')}
              disabled={isStreaming || isLimited}
              title="Random problem"
              className="p-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400
                         hover:bg-accent-500/20 disabled:opacity-25 disabled:cursor-not-allowed
                         transition-all active:scale-95"
            >
              <RefreshCw size={17} />
            </button>

            {/* Send / Stop */}
            {isStreaming ? (
              <button
                onClick={() => { abortRef.current?.abort(); setIsStreaming(false); setStreaming(''); }}
                className="px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400
                           hover:bg-red-500/25 text-sm font-semibold transition-all active:scale-95"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={() => send()}
                disabled={!input.trim() || isLimited}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white
                           bg-gradient-to-r from-primary-600 to-violet-600
                           hover:from-primary-500 hover:to-violet-500
                           disabled:opacity-30 disabled:cursor-not-allowed
                           hover:shadow-lg hover:shadow-primary-600/25
                           active:scale-95 transition-all duration-200"
              >
                <Send size={15} />
                <span className="hidden sm:inline">{t('tutor.send')}</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-700 mt-2 text-center">
          Enter to send · Shift+Enter for new line · Powered by Llama 3.3 70B via Groq
        </p>
      </div>
    </div>
  );
}
