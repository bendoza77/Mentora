import clsx from 'clsx';

const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50',
  secondary:
    'bg-transparent border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:border-primary-400',
  accent:
    'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/30',
  ghost:
    'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
  danger:
    'bg-red-600 hover:bg-red-700 text-white',
  gradient:
    'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white shadow-lg hover:shadow-primary-600/40 hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  full = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
