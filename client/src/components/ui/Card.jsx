import clsx from 'clsx';

export default function Card({
  children,
  className = '',
  glow = false,
  hover = false,
  glass = false,
  padding = 'p-6',
  ...props
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'glass'
          : 'bg-dark-card border-dark-border',
        glow && 'glow-primary',
        hover && 'card-hover',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-base font-semibold text-dark-text', className)}>
      {children}
    </h3>
  );
}
