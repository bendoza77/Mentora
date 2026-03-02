import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import {
  Send, Sparkles, Lightbulb, Trash2,
  BrainCircuit, Copy, Check, RefreshCw,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
    <div className="flex justify-end">
      <div className="bg-primary-600/85 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[78%] leading-relaxed shadow-sm">
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
    <div className="flex gap-3 items-start group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
        <Sparkles size={13} className="text-white" />
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[88%]">
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-4 space-y-0.5 relative">
          {text.split('\n').map((line, i) => (
            <AILine key={i} line={line} idx={i} />
          ))}

          {/* Blinking cursor while streaming */}
          {isStreaming && (
            <span className="inline-block w-[2px] h-4 bg-primary-400 ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Copy button (only when done streaming) */}
        {!isStreaming && (
          <button
            onClick={copyText}
            className="mt-1.5 ml-1 flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0">
        <Sparkles size={13} className="text-white animate-pulse" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center mb-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500">Mentora AI is thinking…</p>
      </div>
    </div>
  );
}

function WelcomeMessage({ user }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0">
        <Sparkles size={13} className="text-white" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-4 max-w-md">
        <p className="text-sm text-slate-200 leading-relaxed">
          Hey{user?.fullname ? `, ${user.fullname.split(' ')[0]}` : ''}! 👋 I'm <span className="text-primary-300 font-semibold">Mentora AI</span> — your personal math tutor.
        </p>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Ask me <span className="text-white">any math question</span> — I'll walk you through it step by step. I'm especially good at topics on the <span className="text-accent-300">Georgian National Exam</span>. 📐
        </p>
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText, isStreaming]);

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isStreaming) return;

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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
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
    <div className="flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-dark-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">{t('tutor.title')}</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('tutor.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">Llama 3.3 · 70B</Badge>
          {history.length > 0 && (
            <button
              onClick={clear}
              title="Clear conversation"
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Quick prompts ───────────────────────────────────────────────────── */}
      <div className="px-6 py-3 border-b border-dark-border bg-dark-surface/50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_PROMPTS.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={isStreaming}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-slate-400 hover:text-primary-300 hover:border-primary-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
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
      <div className="px-6 py-4 border-t border-dark-border bg-dark-surface shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t('tutor.inputPlaceholder')}
              rows={1}
              style={{ resize: 'none' }}
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {/* Hint button */}
            <button
              onClick={() => send('Give me a hint for this problem')}
              disabled={isStreaming || history.length === 0}
              title="Ask for a hint"
              className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Lightbulb size={18} />
            </button>

            {/* New problem button */}
            <button
              onClick={() => send('Give me a random 10th-grade math problem to practice')}
              disabled={isStreaming}
              title="Give me a random problem"
              className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 hover:bg-accent-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={18} />
            </button>

            {/* Send / Stop */}
            {isStreaming ? (
              <button
                onClick={() => { abortRef.current?.abort(); setIsStreaming(false); setStreaming(''); }}
                className="px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-medium transition-all"
              >
                Stop
              </button>
            ) : (
              <Button
                variant="gradient"
                size="md"
                onClick={() => send()}
                disabled={!input.trim()}
                icon={<Send size={16} />}
              >
                {t('tutor.send')}
              </Button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-700 mt-2 text-center">
          Mentora AI · Enter to send · Shift+Enter for new line · Powered by Llama 3.3 70B via Groq
        </p>
      </div>
    </div>
  );
}
