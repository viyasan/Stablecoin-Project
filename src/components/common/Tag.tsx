import type { TopicTag } from '../../types';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const topicColors: Record<TopicTag, { bg: string; text: string }> = {
  regulation: { bg: 'bg-gold-100', text: 'text-gold-600' },
  depeg: { bg: 'bg-status-negative/10', text: 'text-status-negative' },
  integration: { bg: 'bg-status-positive/10', text: 'text-status-positive' },
  infrastructure: { bg: 'bg-chrome-200', text: 'text-chrome-700' },
  payments: { bg: 'bg-gold-100', text: 'text-gold-600' },
  reserve: { bg: 'bg-bronze-400/10', text: 'text-bronze-500' },
  launch: { bg: 'bg-status-positive/10', text: 'text-status-positive' },
  partnership: { bg: 'bg-status-positive/10', text: 'text-status-positive' },
};

export function Tag({ label, onClick, active, className = '' }: TagProps) {
  // Lookup colors using lowercase key to match topicColors
  const colorKey = label.toLowerCase() as TopicTag;
  const colors = topicColors[colorKey] || {
    bg: 'bg-chrome-100',
    text: 'text-chrome-600',
  };

  const baseClasses = `inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${colors.bg} ${colors.text}`;
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
    : '';
  const activeClasses = active ? 'ring-2 ring-offset-1 ring-gold-400 bg-chrome-800 text-white' : '';

  return (
    <span
      className={`${baseClasses} ${interactiveClasses} ${activeClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </span>
  );
}
