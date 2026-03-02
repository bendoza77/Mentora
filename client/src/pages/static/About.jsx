import StaticLayout from '../../components/layout/StaticLayout';
import useInView from '../../hooks/useInView';
import usePageTitle from '../../hooks/usePageTitle';
import { BrainCircuit, Target, Globe, Users, TrendingUp, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const scaleIn = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'scale(1)' : 'scale(0.88)',
  transition: `opacity 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
});
const revealLeft = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(-22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
const revealRight = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0)' : 'translateX(22px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});

const TEAM = [
  { name: 'Gabriel Jobava', role: 'Co-Founder & CEO', bio: 'Former national math olympiad winner. Passionate about making quality education accessible to every Georgian student.', grad: 'from-primary-600 to-accent-500', initials: 'GB' },
  { name: 'Lile Jobava', role: 'Co-Founder & CTO', bio: 'Full-stack engineer with 6 years building EdTech products. Previously at TBC Tech.', grad: 'from-accent-500 to-emerald-500', initials: 'NK' },
  { name: 'Misha Jobava', role: 'Chief Curriculum Officer', bio: 'ENT math examiner for 8 years. Designed the problem bank and AI tutoring curriculum.', grad: 'from-amber-500 to-primary-500', initials: 'DC' },
  { name: 'Inga Sichinava', role: 'Head of Growth', bio: 'Built the community from 0 to 12,000 students through organic content and school partnerships.', grad: 'from-pink-500 to-primary-500', initials: 'AS' },
];

const VALUES = [
  { icon: Target, title: 'Precision Over Shortcuts', desc: "Every explanation is built to create deep understanding — not just the right answer for one question, but the mental model for all similar ones.", color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  { icon: Heart, title: 'Student-First Always', desc: "Every product decision starts with one question: does this help a student score higher? If not, it doesn't ship.", color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { icon: Globe, title: 'Georgian Roots, Global Vision', desc: 'We are proud to be built in Tbilisi. We are building for Georgian students first — and then for the world.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: TrendingUp, title: 'Measurable Impact', desc: "We track real exam scores. Our goal is not engagement metrics — it's the moment a student opens their results and smiles.", color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
];

const STATS = [
  { val: '12,400+', label: 'Active Students' },
  { val: '890K+', label: 'Problems Solved' },
  { val: '+34 pts', label: 'Avg. Score Increase' },
  { val: '40+', label: 'School Partners' },
];

export default function About() {
  usePageTitle('About');
  const hero    = useInView();
  const stats   = useInView();
  const mission = useInView();
  const values  = useInView();
  const team    = useInView();
  const cta     = useInView();

  return (
    <StaticLayout breadcrumb="About Us">

      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-600/8 blur-[100px] rounded-full pointer-events-none" />
        <div ref={hero.ref} className="max-w-4xl mx-auto px-6 text-center relative">
          <div style={reveal(hero.inView, 0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="animate-pulse" />
            Our Story
          </div>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            We Believe Every Student
            <br />
            <span className="gradient-text">Deserves a Great Tutor</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Mentora AI was born in Tbilisi in 2025, from a simple frustration: the best math tutors in Georgia were only available to families who could afford 100+ GEL per hour. We decided to change that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-dark-border bg-dark-surface/40">
        <div ref={stats.ref} className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ val, label }, i) => (
              <div key={label} style={scaleIn(stats.inView, i * 70)} className="text-center">
                <div className="text-4xl font-extrabold gradient-text mb-1">{val}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div ref={mission.ref} className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div style={revealLeft(mission.inView, 0)}>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 block">Our Mission</span>
            <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              Making Expert Tutoring Accessible to Every Student
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              In Georgia, your exam score determines your university. Your university determines your career. And yet, the quality of help you get to prepare depends almost entirely on how much money your family has.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              We use AI to collapse that inequality. Mentora AI gives a student in Kutaisi the same quality of math guidance as a student in Tbilisi whose parents pay top tutors. No commute. No schedule. No financial barrier.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Try it free <ArrowRight size={16} />
            </Link>
          </div>
          <div style={revealRight(mission.inView, 80)} className="space-y-4">
            {[
              { icon: BrainCircuit, title: 'AI That Explains, Not Just Answers', desc: 'Our AI breaks every solution into understandable steps, building real comprehension.' },
              { icon: Target, title: 'Aligned to Georgian ENT Curriculum', desc: 'Every problem and explanation is specifically tailored to the national exam format.' },
              { icon: Users, title: 'Built With Students, Not Just For Them', desc: 'Our problem bank and UX were designed with input from 200+ Georgian students.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} style={reveal(mission.inView, i * 80 + 120)} className="flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-primary-500/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-dark-surface/30">
        <div ref={values.ref} className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span style={reveal(values.inView, 0)} className="text-xs font-semibold text-accent-400 uppercase tracking-widest mb-4 block">What We Stand For</span>
            <h2 style={reveal(values.inView, 80)} className="text-4xl font-extrabold text-white">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} style={reveal(values.inView, i * 80 + 120)} className={`rounded-2xl border ${bg} p-7 card-hover`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-card flex items-center justify-center shrink-0">
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div ref={team.ref} className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span style={reveal(team.inView, 0)} className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4 block">The People Behind Mentora</span>
            <h2 style={reveal(team.inView, 80)} className="text-4xl font-extrabold text-white">Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, bio, grad, initials }, i) => (
              <div key={name} style={reveal(team.inView, i * 80 + 120)} className="bg-dark-card border border-dark-border rounded-2xl p-6 card-hover text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg`}>
                  {initials}
                </div>
                <h3 className="text-sm font-bold text-white">{name}</h3>
                <p className="text-xs text-primary-400 mt-0.5 mb-3">{role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-900/20 to-dark-bg">
        <div ref={cta.ref} className="max-w-3xl mx-auto px-6 text-center">
          <h2 style={reveal(cta.inView, 0)} className="text-3xl font-extrabold text-white mb-4">Join Us on the Mission</h2>
          <p style={reveal(cta.inView, 80)} className="text-slate-400 mb-8">Help us make exam prep fair for every student in Georgia.</p>
          <div style={reveal(cta.inView, 160)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold hover:opacity-90 transition-opacity">
              Start Free <ArrowRight size={16} />
            </Link>
            <Link to="/careers" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-primary-500/40 text-primary-400 font-semibold hover:bg-primary-500/10 transition-colors">
              Join the Team
            </Link>
          </div>
        </div>
      </section>

    </StaticLayout>
  );
}
