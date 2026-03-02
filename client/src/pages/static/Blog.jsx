import StaticLayout from '../../components/layout/StaticLayout';
import useInView from '../../hooks/useInView';
import usePageTitle from '../../hooks/usePageTitle';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { useState } from 'react';

const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});

const POSTS = [
  {
    id: 1, category: 'Study Tips',
    categoryColor: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    title: '7 Proven Strategies to Score 100 on the Georgian ENT Math Exam',
    excerpt: "After analyzing thousands of student attempts and real exam patterns, we've identified the highest-impact strategies for maximizing your ENT math score in the final months before exam day.",
    date: 'Feb 15, 2026', readTime: '8 min read', featured: true, grad: 'from-primary-600 to-accent-500',
  },
  {
    id: 2, category: 'AI & Education',
    categoryColor: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
    title: "How AI Tutors Outperform YouTube for Exam Prep — And When They Don't",
    excerpt: "An honest comparison of AI tutoring vs. video learning, with data from our 12,000+ student base. When each approach works best, and how to combine them.",
    date: 'Feb 10, 2026', readTime: '6 min read', grad: 'from-accent-500 to-primary-600',
  },
  {
    id: 3, category: 'Math Explained',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Trigonometry in 30 Minutes: The Only Guide You Need for ENT',
    excerpt: 'Trigonometry is the #1 source of lost points on the Georgian national math exam. This visual guide covers everything you need — sin, cos, tan, identities, and the unit circle.',
    date: 'Feb 5, 2026', readTime: '12 min read', grad: 'from-emerald-600 to-accent-500',
  },
  {
    id: 4, category: 'Product',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Introducing Exam Simulator 2.0: Real ENT Conditions, Smarter Analytics',
    excerpt: 'Our new exam simulator now matches the exact format of the 2025 Georgian national math exam, with per-question time tracking and AI-generated explanations for every wrong answer.',
    date: 'Jan 28, 2026', readTime: '4 min read', grad: 'from-amber-500 to-orange-500',
  },
  {
    id: 5, category: 'Student Stories',
    categoryColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    title: 'From 45 to 94: How Mariam Used Mentora AI to Turn Her Math Score Around',
    excerpt: "Mariam had 6 weeks and a 45-point deficit. Here's the exact plan she followed — daily sessions, weakness targeting, and three full mock exams — to score 94 on ENT math.",
    date: 'Jan 20, 2026', readTime: '5 min read', grad: 'from-pink-500 to-primary-600',
  },
  {
    id: 6, category: 'Study Tips',
    categoryColor: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    title: 'The 21-Day ENT Math Sprint: A Complete Study Plan',
    excerpt: "Three weeks out from your exam? This day-by-day plan prioritizes the highest-value topics, uses spaced repetition, and includes three full mock exam sessions.",
    date: 'Jan 15, 2026', readTime: '10 min read', grad: 'from-primary-700 to-primary-500',
  },
];

const CATEGORIES = ['All', 'Study Tips', 'AI & Education', 'Math Explained', 'Product', 'Student Stories'];

export default function Blog() {
  usePageTitle('Blog');
  const [featured, ...rest] = POSTS;
  const [activeCategory, setActiveCategory] = useState('All');
  const hero    = useInView();
  const filters = useInView();
  const featuredRef = useInView();
  const grid    = useInView();

  return (
    <StaticLayout breadcrumb="Blog">

      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary-600/7 blur-[100px] rounded-full pointer-events-none" />
        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <span style={reveal(hero.inView, 0)} className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 block">Mentora Blog</span>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl font-extrabold text-white mb-4">
            Learn <span className="gradient-text">Smarter</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400">Study tips, math guides, product updates, and student stories.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">

        {/* Category filters */}
        <div ref={filters.ref} style={reveal(filters.inView, 0)} className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-600/25'
                  : 'bg-dark-card border-dark-border text-slate-400 hover:text-white hover:border-primary-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        <div ref={featuredRef.ref} style={reveal(featuredRef.inView, 0)} className="relative rounded-3xl overflow-hidden border border-dark-border bg-dark-card mb-10 group cursor-pointer card-hover">
          <div className={`absolute inset-0 bg-gradient-to-br ${featured.grad} opacity-10`} />
          <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${featured.categoryColor} mb-5`}>
                <Tag size={10} />
                {featured.category}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight group-hover:text-primary-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime}</span>
                </div>
                <span className="text-primary-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read <ArrowRight size={14} />
                </span>
              </div>
            </div>
            <div className={`rounded-2xl bg-gradient-to-br ${featured.grad} h-52 flex items-center justify-center opacity-20`} />
          </div>
        </div>

        {/* Post grid */}
        <div ref={grid.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(({ id, category, categoryColor, title, excerpt, date, readTime, grad }, i) => (
            <article
              key={id}
              style={reveal(grid.inView, i * 70)}
              className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover cursor-pointer group flex flex-col"
            >
              <div className={`h-36 bg-gradient-to-br ${grad} opacity-30 transition-opacity duration-300 group-hover:opacity-50`} />
              <div className="p-5 flex flex-col flex-1">
                <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full border text-xs font-semibold ${categoryColor} mb-3`}>
                  {category}
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-primary-300 transition-colors flex-1">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-dark-border mt-auto">
                  <span>{date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-primary-500/40 text-sm font-medium transition-all">
            Load More Articles
          </button>
        </div>
      </div>
    </StaticLayout>
  );
}
