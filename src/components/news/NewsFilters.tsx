import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { NewsFilters as NewsFiltersType, TopicTag } from '../../types';

interface NewsFiltersProps {
  filters: NewsFiltersType;
  onFilterChange: (filters: NewsFiltersType) => void;
}


const TOPIC_FILTERS: { value: TopicTag | 'all'; label: string }[] = [
  { value: 'all', label: 'All Topics' },
  { value: 'regulation', label: 'Regulation' },
  { value: 'payments', label: 'Payments' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'launch', label: 'Launches' },
  { value: 'depeg', label: 'De-pegs' },
  { value: 'reserve', label: 'Reserves' },
];

const SOURCE_FILTERS = [
  { value: 'all', label: 'All Sources' },
  { value: 'CoinDesk', label: 'CoinDesk' },
  { value: 'CoinTelegraph', label: 'CoinTelegraph' },
];

export function NewsFilters({ filters, onFilterChange }: NewsFiltersProps) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleTopicChange = (topic: TopicTag | 'all') => {
    onFilterChange({
      ...filters,
      topic: topic === 'all' ? undefined : topic,
    });
  };

  const handleSourceChange = (source: string) => {
    onFilterChange({
      ...filters,
      source: source === 'all' ? undefined : source,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.topic || filters.source;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-4 mb-6 sticky top-0 z-10">
      {/* Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Topic Pills (first few visible) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TOPIC_FILTERS.slice(0, 4).map((topic) => {
            const isActive =
              topic.value === 'all'
                ? !filters.topic
                : filters.topic === topic.value;
            return (
              <button
                key={topic.value}
                onClick={() => handleTopicChange(topic.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                  isActive
                    ? 'bg-gold-500 text-white'
                    : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                }`}
              >
                {topic.label}
              </button>
            );
          })}

          {/* More filters toggle */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              showMoreFilters
                ? 'bg-chrome-200 text-chrome-700'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            More
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showMoreFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Clear all button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto px-3 py-1.5 text-sm font-medium text-chrome-500 hover:text-chrome-700 transition-all duration-150 ease-out active:scale-95"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showMoreFilters && (
        <div className="mt-4 pt-4 border-t border-chrome-100">
          <div className="flex flex-wrap gap-4">
            {/* More Topics */}
            <div>
              <p className="text-xs font-medium text-chrome-500 mb-2">More Topics</p>
              <div className="flex flex-wrap gap-1">
                {TOPIC_FILTERS.slice(4).map((topic) => {
                  const isActive = filters.topic === topic.value;
                  return (
                    <button
                      key={topic.value}
                      onClick={() => handleTopicChange(topic.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                        isActive
                          ? 'bg-gold-500 text-white'
                          : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sources */}
            <div>
              <p className="text-xs font-medium text-chrome-500 mb-2">Sources</p>
              <div className="flex flex-wrap gap-1">
                {SOURCE_FILTERS.map((source) => {
                  const isActive =
                    source.value === 'all'
                      ? !filters.source
                      : filters.source === source.value;
                  return (
                    <button
                      key={source.value}
                      onClick={() => handleSourceChange(source.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                        isActive
                          ? 'bg-gold-500 text-white'
                          : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                      }`}
                    >
                      {source.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
