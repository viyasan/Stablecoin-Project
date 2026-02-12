import type { TopicTag } from '../../types';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const topicColors: Record<TopicTag, { bg: string; text: string }> = {
  regulation: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  depeg: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  integration: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  infrastructure: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  payments: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  reserve: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  launch: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  partnership: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
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
