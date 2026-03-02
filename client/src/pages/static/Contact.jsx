import { useState } from 'react';
import StaticLayout from '../../components/layout/StaticLayout';
import useInView from '../../hooks/useInView';
import usePageTitle from '../../hooks/usePageTitle';
import { Mail, MessageSquare, Building2, HelpCircle, Send, CheckCircle, MapPin, Clock } from 'lucide-react';

const reveal = (inView, delay = 0) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
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

const TOPICS = [
  { value: 'support', label: 'Technical Support', icon: HelpCircle },
  { value: 'school', label: 'School Partnership', icon: Building2 },
  { value: 'press', label: 'Press & Media', icon: MessageSquare },
  { value: 'other', label: 'Other', icon: Mail },
];

const INFO_ITEMS = [
  { icon: Mail, label: 'General Inquiries', value: 'hello@mentora.ai', href: 'mailto:hello@mentora.ai' },
  { icon: Building2, label: 'School Partnerships', value: 'schools@mentora.ai', href: 'mailto:schools@mentora.ai' },
  { icon: MessageSquare, label: 'Support', value: 'support@mentora.ai', href: 'mailto:support@mentora.ai' },
  { icon: MapPin, label: 'Office', value: 'Tbilisi, Georgia', href: null },
  { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: null },
];

export default function Contact() {
  usePageTitle('Contact');
  const [topic, setTopic] = useState('support');
  const [sent, setSent]   = useState(false);
  const [form, setForm]   = useState({ name: '', email: '', message: '' });
  const hero   = useInView();
  const body   = useInView();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <StaticLayout breadcrumb="Contact">

      {/* Header */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent-500/6 blur-[100px] rounded-full pointer-events-none" />
        <div ref={hero.ref} className="max-w-3xl mx-auto px-6 text-center relative">
          <span style={reveal(hero.inView, 0)} className="text-xs font-semibold text-accent-400 uppercase tracking-widest mb-4 block">Get in Touch</span>
          <h1 style={reveal(hero.inView, 80)} className="text-5xl font-extrabold text-white mb-4">
            We'd Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p style={reveal(hero.inView, 160)} className="text-lg text-slate-400">
            Whether you're a student, parent, teacher, or school administrator — reach out. We respond to every message.
          </p>
        </div>
      </section>

      <section ref={body.ref} className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-12">

        {/* Form */}
        <div style={revealLeft(body.inView, 0)} className="lg:col-span-3">
          {sent ? (
            <div className="bg-dark-card border border-emerald-500/25 rounded-3xl p-12 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={30} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-slate-400 text-sm">We'll get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                className="mt-6 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-7">
                {TOPICS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTopic(value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      topic === value
                        ? 'bg-primary-600/20 border-primary-500/40 text-primary-300'
                        : 'bg-dark-surface border-dark-border text-slate-500 hover:text-white hover:border-dark-muted'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Full Name</label>
                    <input
                      required type="text" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Email Address</label>
                    <input
                      required type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Message</label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary-600/25 active:scale-[0.98]"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={revealRight(body.inView, 80)} className="lg:col-span-2 space-y-5">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-7">
            <h3 className="text-base font-bold text-white mb-5">Contact Information</h3>
            <div className="space-y-4">
              {INFO_ITEMS.map(({ icon: Icon, label, value, href }, i) => (
                <div key={label} style={reveal(body.inView, i * 50 + 200)} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    {href
                      ? <a href={href} className="text-sm font-medium text-white hover:text-primary-400 transition-colors">{value}</a>
                      : <p className="text-sm font-medium text-white">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={reveal(body.inView, 400)} className="bg-gradient-to-br from-primary-600/15 to-dark-card border border-primary-500/20 rounded-3xl p-7">
            <h3 className="text-sm font-bold text-white mb-2">For Schools & Institutions</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Interested in bringing Mentora AI to your school? We offer institutional pricing, teacher dashboards, and curriculum alignment for Georgian schools.
            </p>
            <a href="mailto:schools@mentora.ai" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors flex items-center gap-1">
              Book a Demo →
            </a>
          </div>
        </div>
      </section>
    </StaticLayout>
  );
}
