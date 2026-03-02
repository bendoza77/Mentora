import { Link } from 'react-router-dom';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import Footer from './Footer';

export default function StaticLayout({ children, breadcrumb }) {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-50 glass border-b border-primary-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md shadow-primary-600/30">
              <BrainCircuit size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-base">
              Mentora <span className="gradient-text">AI</span>
            </span>
          </Link>

          {breadcrumb && (
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
              <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-slate-300">{breadcrumb}</span>
            </nav>
          )}

          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Open App →
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
