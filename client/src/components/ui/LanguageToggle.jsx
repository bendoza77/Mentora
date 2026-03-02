import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation();
  const isKa = i18n.language === 'ka';

  const toggle = () => {
    const next = isKa ? 'en' : 'ka';
    i18n.changeLanguage(next);
    localStorage.setItem('mentora_lang', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
        bg-dark-border hover:bg-dark-muted text-dark-text-muted hover:text-dark-text ${className}`}
    >
      <Globe size={14} />
      <span>{isKa ? 'ENG' : 'ქარ'}</span>
    </button>
  );
}
