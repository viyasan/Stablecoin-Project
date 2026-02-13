import type { CanadianStablecoin, CompanyTimelineEvent } from '../../api';

interface TimelineEventItemProps {
  event: CompanyTimelineEvent;
  isLast: boolean;
}

function TimelineEventItem({ event, isLast }: TimelineEventItemProps) {
  const typeStyles = {
    milestone: 'bg-status-positive',
    regulatory: 'bg-purple-600',
    funding: 'bg-bronze-400',
    launch: 'bg-gold-500',
    partnership: 'bg-blue-600',
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
        <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-chrome-200" />
      )}

      {/* Dot */}
      <div
        className={`absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm ${typeStyles[event.type]}`}
      />

      {/* Content */}
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-chrome-500">{event.date}</span>
          <span
            className={`inline-block px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${typeStyles[event.type]}`}
          >
            {typeLabels[event.type]}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-chrome-900 mb-0.5">{event.title}</h4>
        <p className="text-xs text-chrome-600 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

interface CompanyTimelineColumnProps {
  stablecoin: CanadianStablecoin;
}

function CompanyTimelineColumn({ stablecoin }: CompanyTimelineColumnProps) {
  // Get header colors based on stablecoin ID (match company profile cards)
  const getHeaderColors = () => {
    switch (stablecoin.id) {
      case 'qcad':
        return 'from-[#dc2626] to-[#b91c1c]'; // red-600 to red-700
      case 'tetra':
        return 'from-[#d52424] to-[#b21a1a]'; // slightly darker
      case 'cadc':
        return 'from-[#d92525] to-[#b61b1b]'; // between
      default:
        return 'from-red-600 to-red-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getHeaderColors()} px-5 py-3 flex items-center gap-3`}>
        {stablecoin.logo && (
          <img
            src={stablecoin.logo}
            alt={`${stablecoin.issuer} logo`}
            className="w-10 h-10 rounded-lg bg-white p-1.5 object-contain flex-shrink-0"
          />
        )}
        <div>
          <h3 className="text-lg font-bold text-white">{stablecoin.name}</h3>
          <p className="text-white text-sm opacity-90">{stablecoin.parentCompany.name}</p>
        </div>
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
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-chrome-900">Company Timelines</h2>
        <p className="text-sm text-chrome-500 mt-1">
          Key milestones and events for each Canadian stablecoin issuer
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gold-500" />
          <span className="text-xs text-chrome-600">Launch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-status-positive" />
          <span className="text-xs text-chrome-600">Milestone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600" />
          <span className="text-xs text-chrome-600">Regulatory</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-bronze-400" />
          <span className="text-xs text-chrome-600">Funding</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="text-xs text-chrome-600">Partnership</span>
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
