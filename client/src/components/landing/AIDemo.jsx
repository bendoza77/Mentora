import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Send, Lightbulb, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function AIDemo() {
  const { t } = useTranslation();
  const [messages, setMessages]       = useState([]); // [{role, content}]
  const [streamingText, setStreaming] = useState('');
  const [typing, setTyping]           = useState(false);
  const [input, setInput]             = useState('');
  const chatRef = useRef(null);

  // Auto-scroll to bottom as new text streams in
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleAsk = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg     = { role: 'user', content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setTyping(true);
    setStreaming('');

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/demo`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: nextHistory }),
      });

      if (!res.ok) throw new Error('AI unavailable');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const { text: chunk } = JSON.parse(data);
            if (chunk) { full += chunk; setStreaming(full); }
          } catch { /* ignore malformed chunks */ }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, the demo is temporarily unavailable. Sign up to access the full AI tutor!',
      }]);
    } finally {
      setStreaming('');
      setTyping(false);
    }
  };

  return (
    <section id="aiDemo" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-600/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('aiDemo.badge')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
            {t('aiDemo.headline')}
          </h2>
        </div>

        {/* Demo container */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Chat ── */}
          <div className="glass rounded-3xl p-6 border border-primary-500/15">
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-border">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center animate-pulse-glow">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mentora AI</p>
                <p className="text-xs text-emerald-400">● Live Demo</p>
              </div>
              <Badge variant="accent" className="ml-auto">LLaMA 3.3</Badge>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="space-y-4 mb-5 min-h-[200px] max-h-[340px] overflow-y-auto pr-1 scrollbar-none">

              {/* Static greeting */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-200 max-w-[280px] leading-relaxed">
                  {t('aiDemo.greeting')}
                </div>
              </div>

              {/* Conversation history */}
              {messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-primary-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[280px] leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-200 max-w-[280px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                )
              )}

              {/* Streaming / typing indicator */}
              {typing && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  {streamingText ? (
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-200 max-w-[280px] leading-relaxed whitespace-pre-wrap">
                      {streamingText}
                      <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-primary-400 animate-pulse rounded-sm" />
                    </div>
                  ) : (
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{t('aiDemo.thinking')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder={t('aiDemo.placeholder')}
                disabled={typing}
                className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-colors"
              />
              <Button variant="gradient" size="sm" onClick={handleAsk} loading={typing} icon={<Send size={14} />}>
                {t('aiDemo.send')}
              </Button>
            </div>
          </div>

          {/* ── Right: Feature cards (unchanged) ── */}
          <div className="space-y-5">
            {[
              {
                icon: Lightbulb,
                title: 'Smart Hint System',
                desc: 'Progressive hints that guide students to the answer without giving it away directly.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20',
              },
              {
                icon: RefreshCw,
                title: 'Similar Problem Generator',
                desc: 'AI generates variant problems at the same difficulty to reinforce understanding.',
                color: 'text-accent-400',
                bg: 'bg-accent-500/10 border-accent-500/20',
              },
              {
                icon: Sparkles,
                title: 'Context Memory',
                desc: 'Mentora remembers your session history and builds on prior explanations.',
                color: 'text-primary-400',
                bg: 'bg-primary-500/10 border-primary-500/20',
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`rounded-2xl border ${bg} p-5 card-hover`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-card flex items-center justify-center shrink-0">
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Confidence widget */}
            <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">AI Confidence Score</p>
              <div className="space-y-3">
                {[
                  { topic: 'Quadratic Equations', val: 98 },
                  { topic: 'Trigonometry',        val: 91 },
                  { topic: 'Algebra',             val: 95 },
                ].map(({ topic, val }) => (
                  <div key={topic}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{topic}</span>
                      <span className="text-primary-400 font-semibold">{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-dark-muted rounded-full">
                      <div className="progress-bar h-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
