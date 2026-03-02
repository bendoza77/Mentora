import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Mentora AI` : 'Mentora AI — გამოცდის მომზადება';
    return () => {
      document.title = 'Mentora AI — გამოცდის მომზადება';
    };
  }, [title]);
}
