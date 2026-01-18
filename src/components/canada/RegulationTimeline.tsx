import { Check, ShieldCheck, CircleDollarSign, Zap } from 'lucide-react';
import type { TimelineEvent } from '../../api';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

function TimelineItem({ event, isLast }: TimelineItemProps) {
  const typeStyles = {
    milestone: {
      bg: 'bg-red-600',
      icon: <Check className="w-3.5 h-3.5 text-white" />,
    },
    regulatory: {
      bg: 'bg-blue-600',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-white" />,
    },
    funding: {
      bg: 'bg-green-600',
      icon: <CircleDollarSign className="w-3.5 h-3.5 text-white" />,
    },
    launch: {
      bg: 'bg-purple-600',
      icon: <Zap className="w-3.5 h-3.5 text-white" />,
    },
  };

  const style = typeStyles[event.type];

  return (
    <div className="flex gap-4">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full ${style.bg} flex items-center justify-center shadow-sm`}>
          {style.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-2" />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
            {event.date}
          </span>
          {event.stablecoinId && (
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              {event.stablecoinId.toUpperCase()}
            </span>
          )}
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
        <p className="text-sm text-gray-600">{event.description}</p>
      </div>
    </div>
  );
}

interface RegulationTimelineProps {
  events: TimelineEvent[];
}

export function RegulationTimeline({ events }: RegulationTimelineProps) {
  // Sort events by date (most recent first for display, but we'll reverse for chronological)
  const sortedEvents = [...events];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Canadian Stablecoin Timeline</h2>
        <p className="text-sm text-gray-500 mt-1">Key milestones and regulatory developments</p>
      </div>
      <div className="p-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-xs text-gray-600">Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs text-gray-600">Regulatory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-xs text-gray-600">Funding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-xs text-gray-600">Launch</span>
          </div>
        </div>

        {/* Timeline */}
        <div>
          {sortedEvents.map((event, index) => (
            <TimelineItem
              key={`${event.date}-${event.title}`}
              event={event}
              isLast={index === sortedEvents.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
