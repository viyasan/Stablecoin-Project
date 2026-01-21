import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  interactive = false,
}: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-150 ease-out';
  const interactiveClasses = interactive
    ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
