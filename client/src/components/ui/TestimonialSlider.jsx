import { useState, useEffect } from 'react';
import clsx from 'clsx';

const TESTIMONIALS = [
  {
    text: "I went from 61 to 89 on my math ENT in just 3 months. Mentora's AI explains things exactly the way my brain works — I stopped dreading math.",
    name: "ლუკა კვარაცხელია",
    meta: "ENT 2025 · Math Score: 89/100",
    initials: "LK",
    gradient: "from-violet-500 to-cyan-500",
    stars: 5,
  },
  {
    text: "The personalized practice is unreal. It figures out exactly where I'm weak and drills those spots until they become strengths.",
    name: "Mariam Jgerenaia",
    meta: "Tbilisi · ENT 2025",
    initials: "MJ",
    gradient: "from-cyan-500 to-emerald-500",
    stars: 5,
  },
  {
    text: "I failed two mock exams before Mentora. Six weeks of daily sessions later — 94 on the real thing. This app is genuinely special.",
    name: "Giorgi Beridze",
    meta: "Kutaisi · ENT 2025",
    initials: "GB",
    gradient: "from-emerald-500 to-violet-500",
    stars: 5,
  },
  {
    text: "Finally, step-by-step Georgian math explanations I can actually follow. My confidence went from zero to passing in two months.",
    name: "Nino Kvaratskhelia",
    meta: "Batumi · ENT 2025",
    initials: "NK",
    gradient: "from-amber-500 to-violet-500",
    stars: 5,
  },
  {
    text: "The exam simulations are eerily accurate. By exam day I'd already done it 30 times — I walked in calm and confident.",
    name: "Davit Chikvania",
    meta: "Gori · ENT 2024",
    initials: "DC",
    gradient: "from-violet-600 to-pink-500",
    stars: 5,
  },
  {
    text: "My parents couldn't afford a private tutor. Mentora gave me better explanations than any tutor I've ever seen — for free.",
    name: "Ana Surmanidze",
    meta: "Rustavi · ENT 2025",
    initials: "AS",
    gradient: "from-pink-500 to-cyan-500",
    stars: 5,
  },
];

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  /* Auto-advance every 4.5 s */
  useEffect(() => {
    const id = setInterval(() => advance((active + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(id);
  }, [active]);

  function advance(next) {
    setVisible(false);
    setTimeout(() => {
      setActive(next);
      setVisible(true);
    }, 380);
  }

  const t = TESTIMONIALS[active];

  return (
    <div className="glass rounded-2xl border border-primary-500/15 overflow-hidden">
      {/* Slide area */}
      <div className="p-5"
        style={{
          transition: 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {[...Array(t.stars)].map((_, i) => (
            <span key={i} className="text-amber-400 text-sm leading-none">★</span>
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          &ldquo;{t.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br shadow-md',
              t.gradient
            )}
          >
            {t.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{t.name}</p>
            <p className="text-xs text-slate-500 truncate">{t.meta}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
