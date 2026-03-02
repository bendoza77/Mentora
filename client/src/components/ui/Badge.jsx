import clsx from 'clsx';

const variants = {
  primary: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  accent: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  ghost: 'bg-white/5 text-slate-400 border-white/10',
};

export default function Badge({ children, variant = 'primary', className = '', dot = false }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full',
          variant === 'success' ? 'bg-emerald-400' :
          variant === 'warning' ? 'bg-amber-400' :
          variant === 'danger' ? 'bg-red-400' :
          variant === 'accent' ? 'bg-accent-400' : 'bg-primary-400'
        )} />
      )}
      {children}
    </span>
  );
}
