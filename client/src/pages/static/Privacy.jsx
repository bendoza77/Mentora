import StaticLayout from '../../components/layout/StaticLayout';
import useInView from '../../hooks/useInView';
import useSEO from '../../hooks/useSEO';
import { Shield } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: [
      { subtitle: '1.1 Account Information', text: 'When you create a Mentora AI account, we collect your name, email address, and profile photo (via Google OAuth). We do not store your Google password.' },
      { subtitle: '1.2 Usage Data', text: 'We collect data about how you interact with Mentora AI — problems you attempt, your answers, time spent, exam simulation results, and AI chat messages. This data is essential to powering our personalization engine.' },
      { subtitle: '1.3 Device & Technical Data', text: 'We collect your IP address, browser type, device type, operating system, and referring URLs for security and analytics purposes.' },
      { subtitle: '1.4 Payment Information', text: 'Subscription payments are processed by Stripe. Mentora AI does not store your full credit card number. We receive only the last 4 digits and card type for display purposes.' },
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      { subtitle: '2.1 To Provide the Service', text: 'Your learning data is used to power the AI tutoring experience — personalizing which problems you see, detecting your weak areas, and adapting difficulty levels.' },
      { subtitle: '2.2 To Improve Our Product', text: 'Aggregated, anonymized usage data helps us improve the platform. We may use anonymized attempt data to improve our AI models.' },
      { subtitle: '2.3 Communications', text: 'We send you product updates, streak reminders, and exam countdown notifications. You can opt out of non-essential communications at any time in Settings.' },
      { subtitle: '2.4 Legal Compliance', text: 'We may disclose your information if required by law, court order, or to protect the rights and safety of our users.' },
    ],
  },
  {
    title: '3. Data Storage & Security',
    content: [
      { subtitle: '3.1 Storage Location', text: 'Your data is stored on MongoDB Atlas servers located in the European Union (Frankfurt, Germany), ensuring compliance with GDPR standards.' },
      { subtitle: '3.2 Security Measures', text: 'We use industry-standard encryption (TLS 1.3 in transit, AES-256 at rest), JWT authentication with short-lived tokens, and regular security audits.' },
      { subtitle: '3.3 Data Retention', text: 'Free account chat history is retained for 90 days. Paid account chat history is retained indefinitely unless you request deletion. Attempt and progress data is retained for the lifetime of your account.' },
    ],
  },
  {
    title: '4. Data Sharing',
    content: [
      { subtitle: '4.1 We Do Not Sell Your Data', text: 'Mentora AI does not sell, rent, or trade your personal information to third parties for their marketing purposes. Period.' },
      { subtitle: '4.2 Service Providers', text: 'We share data with trusted third-party service providers (OpenAI for AI processing, Stripe for payments, Resend for email) solely to provide the service. These providers are contractually obligated to protect your data.' },
      { subtitle: '4.3 School Partnerships', text: 'If your account was created through a school partnership, your academic progress data (accuracy, topics covered, time spent) may be shared with your school administrator. Personal chat history is never shared.' },
    ],
  },
  {
    title: '5. Your Rights',
    content: [
      { subtitle: '5.1 Access & Export', text: 'You have the right to request a full export of your personal data. Email privacy@mentora.ai with subject "Data Export Request".' },
      { subtitle: '5.2 Correction', text: 'You can update your name and email directly in Settings → Profile.' },
      { subtitle: '5.3 Deletion', text: 'You can delete your account at any time in Settings → Danger Zone. All personal data will be permanently deleted within 30 days.' },
      { subtitle: '5.4 GDPR & Georgian Law', text: 'We comply with both GDPR (for European users) and Georgian data protection legislation. You may lodge a complaint with the Personal Data Protection Service of Georgia.' },
    ],
  },
  {
    title: '6. Cookies',
    content: [
      { subtitle: '6.1 Essential Cookies', text: 'We use strictly necessary cookies for authentication (session tokens) and user preferences (theme, language). These cannot be disabled.' },
      { subtitle: '6.2 Analytics Cookies', text: 'We use PostHog for product analytics to understand how students use the platform. This data is anonymized and does not identify individuals.' },
    ],
  },
  {
    title: '7. Children\'s Privacy',
    content: [
      { subtitle: '7.1 Age Requirement', text: 'Mentora AI is designed for students aged 14 and above. For users under 18, we recommend parental awareness. We do not knowingly collect personal data from children under 13.' },
    ],
  },
  {
    title: '8. Contact & Changes',
    content: [
      { subtitle: '8.1 Privacy Contact', text: 'For any privacy-related questions or requests, contact our Data Protection Officer at privacy@mentora.ai.' },
      { subtitle: '8.2 Policy Updates', text: 'We may update this Privacy Policy from time to time. Material changes will be communicated via email and a banner on the platform. Continued use after changes constitutes acceptance.' },
    ],
  },
];

export default function Privacy() {
  useSEO({
    title: 'Privacy Policy',
    description: 'Read Mentora AI\'s privacy policy to understand how we collect, use, and protect your data in compliance with Georgian data protection law.',
    path: '/privacy',
  });
  const hero     = useInView();
  const content  = useInView();

  return (
    <StaticLayout breadcrumb="Privacy Policy">
      {/* Header */}
      <section className="relative py-20 overflow-hidden border-b border-dark-border">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div ref={hero.ref} className="max-w-3xl mx-auto px-6 relative">
          <div
            style={{ opacity: hero.inView ? 1 : 0, transform: hero.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <Shield size={22} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
              <p className="text-sm text-slate-500 mt-0.5">Last updated: February 15, 2026</p>
            </div>
          </div>
          <div
            style={{ opacity: hero.inView ? 1 : 0, transform: hero.inView ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.6s ease 120ms, transform 0.6s ease 120ms' }}
            className="bg-emerald-500/8 border border-emerald-500/15 rounded-2xl p-5"
          >
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">TL;DR:</strong> We collect your learning data to make Mentora AI work. We do not sell it. You can delete your account and all data at any time. We store data in the EU and comply with GDPR and Georgian data protection law.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <article ref={content.ref} className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {SECTIONS.map(({ title, content: items }, si) => (
          <section
            key={title}
            style={{ opacity: content.inView ? 1 : 0, transform: content.inView ? 'translateY(0)' : 'translateY(18px)', transition: `opacity 0.5s ease ${si * 60}ms, transform 0.5s ease ${si * 60}ms` }}
          >
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-dark-border">{title}</h2>
            <div className="space-y-5">
              {items.map(({ subtitle, text }) => (
                <div key={subtitle}>
                  <h3 className="text-sm font-semibold text-primary-300 mb-1.5">{subtitle}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="pt-8 border-t border-dark-border text-center">
          <p className="text-xs text-slate-600">Mentora AI is operated by Mentora Technologies, Tbilisi, Georgia. © 2026</p>
          <a href="mailto:privacy@mentora.ai" className="text-sm text-primary-400 hover:text-primary-300 transition-colors mt-2 inline-block">privacy@mentora.ai</a>
        </div>
      </article>
    </StaticLayout>
  );
}
