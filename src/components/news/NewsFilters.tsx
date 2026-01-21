import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
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
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFilterChange({ ...filters, search: value || undefined });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleSearchClear = () => {
    setSearchValue('');
    onFilterChange({ ...filters, search: undefined });
  };

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
    setSearchValue('');
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.search || filters.topic || filters.source;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchValue && (
          <button
            onClick={handleSearchClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

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
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="ml-auto px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all duration-150 ease-out active:scale-95"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showMoreFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4">
            {/* More Topics */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">More Topics</p>
              <div className="flex flex-wrap gap-1">
                {TOPIC_FILTERS.slice(4).map((topic) => {
                  const isActive = filters.topic === topic.value;
                  return (
                    <button
                      key={topic.value}
                      onClick={() => handleTopicChange(topic.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <p className="text-xs font-medium text-gray-500 mb-2">Sources</p>
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
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
