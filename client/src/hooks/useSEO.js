import { useEffect } from 'react';

const BASE_URL = 'https://mentora.com.ge';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(property, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(path) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', `${BASE_URL}${path}`);
}

export default function useSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  noindex = false,
} = {}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Mentora AI`
      : 'Mentora AI — AI-Powered Exam Prep for Georgian Students';

    document.title = fullTitle;

    if (description) setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:url', `${BASE_URL}${path}`, 'property');
    setMeta('og:image', image, 'property');

    // Twitter
    setMeta('twitter:title', fullTitle);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    setCanonical(path);

    return () => {
      document.title = 'Mentora AI — AI-Powered Exam Prep for Georgian Students';
    };
  }, [title, description, path, image, noindex]);
}
