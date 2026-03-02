import StaticLayout from '../../components/layout/StaticLayout';
import useInView from '../../hooks/useInView';
import usePageTitle from '../../hooks/usePageTitle';
import { MapPin, Clock, ArrowRight, Sparkles, Users, TrendingUp, Heart, Zap } from 'lucide-react';

const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const scaleIn = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'scale(1)' : 'scale(0.9)',
  transition: `opacity 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
});

const OPENINGS = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', type: 'Full-time', location: 'Tbilisi / Remote', desc: 'Build the core platform — AI integrations, backend APIs, and the frontend experience for 12,000+ students.', tags: ['React', 'Node.js', 'MongoDB', 'OpenAI'] },
  { title: 'Math Curriculum Designer', team: 'Education', type: 'Full-time', location: 'Tbilisi', desc: 'Design and curate the problem bank. Work directly with our AI team to build the most comprehensive ENT math curriculum available.', tags: ['Georgian ENT', 'Pedagogy', 'Content'] },
  { title: 'Growth Marketer', team: 'Growth', type: 'Full-time', location: 'Tbilisi / Remote', desc: "Own student acquisition across organic content, school partnerships, and paid channels. You'll take us from 12K to 100K students.", tags: ['SEO', 'Content', 'Partnerships', 'Analytics'] },
  { title: 'AI/ML Engineer', team: 'Engineering', type: 'Full-time', location: 'Remote', desc: 'Fine-tune and optimize our AI tutoring pipeline. Own confidence scoring, context memory, and the personalization engine.', tags: ['LLMs', 'LangChain', 'Python', 'Vector DBs'] },
  { title: 'Product Designer', team: 'Design', type: 'Full-time', location: 'Tbilisi / Remote', desc: 'Own the entire product design — from student onboarding to analytics dashboards. Make complex AI features feel effortless.', tags: ['Figma', 'UX Research', 'Motion Design'] },
  { title: 'Customer Success Manager', team: 'Operations', type: 'Part-time', location: 'Tbilisi', desc: 'Be the voice of our students. Own onboarding, support, and school partnership success. Build our community from the inside.', tags: ['Georgian / English', 'Support', 'Community'] },
];

const PERKS = [
  { icon: Zap, title: 'Competitive Equity', desc: "Every full-time hire gets meaningful equity. We're building something big — you should own a piece of it." },
  { icon: TrendingUp, title: 'Growth at Rocket Speed', desc: "We're growing 40% month-over-month. Your work has immediate, visible impact on thousands of students." },
  { icon: Heart, title: 'Mission That Matters', desc: "We measure success in exam scores improved, not just DAU. Come build something you're proud of." },
  { icon: Users, title: 'Small Team, Big Responsibility', desc: "You won't be a cog. Every person here owns a major surface area of the product." },
];

const teamColors = {
  Engineering: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  Education: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Growth: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Operations: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
};

export default function Careers() {
  usePageTitle('Careers');
  const hero     = useInView();
  const perks    = useInView();
  const openings = useInView();

  return (
    <StaticLayout breadcrumb="Careers">

      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary-600/8 blur-[100px] rounded-full pointer-events-none" />
        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <div style={reveal(hero.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles size={14} className="animate-pulse" />
            We're hiring
          </div>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Help Us Build the Future
            <br />
            <span className="gradient-text">of Learning in Georgia</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            We're a small, ambitious team in Tbilisi building AI tools that genuinely change students' lives. If that sounds like the kind of work you want to do, let's talk.
          </p>
          <div style={reveal(hero.inView, 240)} className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-slate-500">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-primary-400" /> Tbilisi, Georgia</span>
            <span className="flex items-center gap-2"><Users size={14} className="text-primary-400" /> 8 people currently</span>
            <span className="flex items-center gap-2"><TrendingUp size={14} className="text-primary-400" /> Growing fast</span>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-dark-surface/30 border-y border-dark-border">
        <div ref={perks.ref} className="max-w-6xl mx-auto px-6">
          <h2 style={reveal(perks.inView, 0)} className="text-2xl font-extrabold text-white text-center mb-12">Why Mentora</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} style={scaleIn(perks.inView, i * 70 + 80)} className="text-center p-6 rounded-2xl bg-dark-card border border-dark-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-24">
        <div ref={openings.ref} className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 style={reveal(openings.inView, 0)} className="text-3xl font-extrabold text-white">Open Positions</h2>
            <span style={reveal(openings.inView, 80)} className="text-sm text-slate-500">{OPENINGS.length} openings</span>
          </div>
          <div className="space-y-4">
            {OPENINGS.map(({ title, team, type, location, desc, tags }, i) => (
              <div
                key={title}
                style={reveal(openings.inView, i * 60 + 120)}
                className="group bg-dark-card border border-dark-border hover:border-primary-500/40 rounded-2xl p-6 card-hover cursor-pointer transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${teamColors[team] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>{team}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} /> {type}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={11} /> {location}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-dark-muted text-slate-500 font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className="shrink-0 self-start flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-600/30 transition-all">
                    Apply <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={reveal(openings.inView, OPENINGS.length * 60 + 200)} className="mt-8 rounded-2xl border border-dashed border-dark-muted p-8 text-center">
            <p className="text-white font-semibold mb-2">Don't see a fit?</p>
            <p className="text-sm text-slate-400 mb-4">We're always looking for exceptional people. Send us your story.</p>
            <a href="mailto:careers@mentora.ai" className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
              careers@mentora.ai <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </StaticLayout>
  );
}
