import { useTranslation } from 'react-i18next';
import { BrainCircuit, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const sections = [
    {
      title: t('footer.product'),
      links: [
        { label: t('footer.features'), to: '/#features' },
        { label: t('footer.pricing'), to: '/#pricing' },
        { label: t('footer.examSim'), to: '/exam' },
        { label: t('footer.analytics'), to: '/analytics' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), to: '/about' },
        { label: t('footer.blog'), to: '/blog' },
        { label: t('footer.careers'), to: '/careers' },
        { label: t('footer.contact'), to: '/contact' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.privacy'), to: '/privacy' },
        { label: t('footer.terms'), to: '/terms' },
      ],
    },
  ];

  return (
    <footer className="border-t border-dark-border bg-dark-surface mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">Mentora <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/40 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {year} Mentora AI. {t('footer.rights')}
          </p>
          <p className="text-sm text-slate-500">{t('footer.madeIn')}</p>
        </div>
      </div>
    </footer>
  );
}
