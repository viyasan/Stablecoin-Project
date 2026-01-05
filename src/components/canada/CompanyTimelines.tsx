import { useState } from 'react';
import type { CanadianStablecoin, CompanyTimelineEvent } from '../../api';

type EventType = CompanyTimelineEvent['type'];
type FilterType = 'all' | EventType;

interface StatusBadgeProps {
  status: CanadianStablecoin['status'];
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    live: 'bg-green-100 text-green-700',
    coming_soon: 'bg-amber-100 text-amber-700',
    pending_approval: 'bg-amber-100 text-amber-700',
  };

  const dotColors = {
    live: 'bg-green-500',
    coming_soon: 'bg-amber-500',
    pending_approval: 'bg-amber-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
  );
}

interface EventTypeBadgeProps {
  type: EventType;
}

function EventTypeBadge({ type }: EventTypeBadgeProps) {
  const styles: Record<EventType, string> = {
    launch: 'bg-green-100 text-green-700',
    milestone: 'bg-red-100 text-red-700',
    regulatory: 'bg-blue-100 text-blue-700',
    funding: 'bg-purple-100 text-purple-700',
    partnership: 'bg-amber-100 text-amber-700',
  };

  const labels: Record<EventType, string> = {
    launch: 'Launch',
    milestone: 'Milestone',
    regulatory: 'Regulatory',
    funding: 'Funding',
    partnership: 'Partnership',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

const dotColors: Record<EventType, string> = {
  launch: 'bg-green-500',
  milestone: 'bg-red-500',
  regulatory: 'bg-blue-500',
  funding: 'bg-purple-500',
  partnership: 'bg-amber-500',
};

interface TimelineEventItemProps {
  event: CompanyTimelineEvent;
  isLast: boolean;
}

function TimelineEventItem({ event, isLast }: TimelineEventItemProps) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Dot */}
      <div
        className={`absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm ${dotColors[event.type]}`}
      />

      {/* Content */}
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500">{event.date}</span>
          <EventTypeBadge type={event.type} />
        </div>
        <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
      </div>
    </div>
  );
}

interface CompanyTimelineColumnProps {
  stablecoin: CanadianStablecoin;
  filter: FilterType;
}

function CompanyTimelineColumn({ stablecoin, filter }: CompanyTimelineColumnProps) {
  const filteredEvents = filter === 'all'
    ? stablecoin.companyTimeline
    : stablecoin.companyTimeline.filter(event => event.type === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">{stablecoin.name}</h3>
            <p className="text-sm text-gray-500">{stablecoin.parentCompany.name}</p>
          </div>
          <StatusBadge status={stablecoin.status} label={stablecoin.statusLabel} />
        </div>
      </div>

      {/* Timeline Events */}
      <div className="p-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <TimelineEventItem
              key={`${event.date}-${event.title}`}
              event={event}
              isLast={index === filteredEvents.length - 1}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No events in this category</p>
        )}
      </div>
    </div>
  );
}

interface FilterTabProps {
  label: string;
  value: FilterType;
  active: boolean;
  onClick: () => void;
}

function FilterTab({ label, value, active, onClick }: FilterTabProps) {
  const dotColor = value === 'all' ? '' : dotColors[value as EventType];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
        active
          ? 'bg-red-100 text-red-700'
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      {value !== 'all' && (
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      )}
      {label}
    </button>
  );
}

interface CompanyTimelinesProps {
  stablecoins: CanadianStablecoin[];
}

export function CompanyTimelines({ stablecoins }: CompanyTimelinesProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Launch', value: 'launch' },
    { label: 'Milestone', value: 'milestone' },
    { label: 'Regulatory', value: 'regulatory' },
    { label: 'Funding', value: 'funding' },
    { label: 'Partnership', value: 'partnership' },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Company Timelines
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Key milestones and events for each Canadian stablecoin issuer
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <FilterTab
            key={f.value}
            label={f.label}
            value={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
          />
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stablecoins.map((stablecoin) => (
          <CompanyTimelineColumn
            key={stablecoin.id}
            stablecoin={stablecoin}
            filter={filter}
          />
        ))}
      </div>
    </div>
  );
}
