import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
        ${isDark
          ? 'bg-dark-border hover:bg-dark-muted text-amber-400'
          : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
        } ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
