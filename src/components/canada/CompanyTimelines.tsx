import type { CanadianStablecoin, CompanyTimelineEvent } from '../../api';

interface TimelineEventItemProps {
  event: CompanyTimelineEvent;
  isLast: boolean;
}

function TimelineEventItem({ event, isLast }: TimelineEventItemProps) {
  const typeStyles = {
    milestone: 'bg-green-500',
    regulatory: 'bg-blue-500',
    funding: 'bg-purple-500',
    launch: 'bg-red-500',
    partnership: 'bg-amber-500',
  };

  const typeLabels = {
    milestone: 'Milestone',
    regulatory: 'Regulatory',
    funding: 'Funding',
    launch: 'Launch',
    partnership: 'Partnership',
  };

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Dot */}
      <div
        className={`absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm ${typeStyles[event.type]}`}
      />

      {/* Content */}
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500">{event.date}</span>
          <span
            className={`inline-block px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${typeStyles[event.type]}`}
          >
            {typeLabels[event.type]}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{event.title}</h4>
        <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

interface CompanyTimelineColumnProps {
  stablecoin: CanadianStablecoin;
}

function CompanyTimelineColumn({ stablecoin }: CompanyTimelineColumnProps) {
  const statusColors = {
    live: 'border-green-500',
    coming_soon: 'border-amber-500',
    pending_approval: 'border-amber-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-t-4 ${statusColors[stablecoin.status]} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">{stablecoin.name}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              stablecoin.status === 'live'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {stablecoin.statusLabel}
          </span>
        </div>
        <p className="text-sm text-gray-500">{stablecoin.parentCompany.name}</p>
      </div>

      {/* Timeline Events */}
      <div className="p-5">
        {stablecoin.companyTimeline.map((event, index) => (
          <TimelineEventItem
            key={`${event.date}-${event.title}`}
            event={event}
            isLast={index === stablecoin.companyTimeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface CompanyTimelinesProps {
  stablecoins: CanadianStablecoin[];
}

export function CompanyTimelines({ stablecoins }: CompanyTimelinesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Company Timelines</h2>
        <p className="text-sm text-gray-500 mt-1">
          Key milestones and events for each Canadian stablecoin issuer
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Launch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Milestone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">Regulatory</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-600">Funding</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-600">Partnership</span>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stablecoins.map((stablecoin) => (
          <CompanyTimelineColumn key={stablecoin.id} stablecoin={stablecoin} />
        ))}
      </div>
    </div>
  );
}
