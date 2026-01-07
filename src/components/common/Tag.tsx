import type { TopicTag } from '../../types';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const topicColors: Record<TopicTag, { bg: string; text: string }> = {
  regulation: { bg: 'bg-purple-100', text: 'text-purple-700' },
  depeg: { bg: 'bg-red-100', text: 'text-red-700' },
  integration: { bg: 'bg-blue-100', text: 'text-blue-700' },
  infrastructure: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  payments: { bg: 'bg-green-100', text: 'text-green-700' },
  reserve: { bg: 'bg-amber-100', text: 'text-amber-700' },
  launch: { bg: 'bg-teal-100', text: 'text-teal-700' },
  partnership: { bg: 'bg-pink-100', text: 'text-pink-700' },
};

export function Tag({ label, onClick, active, className = '' }: TagProps) {
  // Lookup colors using lowercase key to match topicColors
  const colorKey = label.toLowerCase() as TopicTag;
  const colors = topicColors[colorKey] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
  };

  const baseClasses = `inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${colors.bg} ${colors.text}`;
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:opacity-80 transition-opacity'
    : '';
  const activeClasses = active ? 'ring-2 ring-offset-1 ring-primary-500' : '';

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
