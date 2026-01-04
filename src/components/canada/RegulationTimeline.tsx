import type { TimelineEvent } from '../../api';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

function TimelineItem({ event, isLast }: TimelineItemProps) {
  const typeStyles = {
    milestone: {
      bg: 'bg-red-600',
      icon: (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    regulatory: {
      bg: 'bg-blue-600',
      icon: (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    funding: {
      bg: 'bg-green-600',
      icon: (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    launch: {
      bg: 'bg-purple-600',
      icon: (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
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
