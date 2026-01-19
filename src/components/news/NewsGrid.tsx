import { Loader2 } from 'lucide-react';
import type { NewsItem } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  items: NewsItem[];
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

// Calculate how many items fill complete rows (4 columns, every 5th item is 2 cols)
function getCompleteRowItemCount(totalItems: number): number {
  const COLS = 4;
  let columnUnits = 0;
  let lastCompleteRowIndex = 0;

  for (let i = 0; i < totalItems; i++) {
    const isWide = (i + 1) % 5 === 0 && i > 0;
    columnUnits += isWide ? 2 : 1;

    if (columnUnits % COLS === 0) {
      lastCompleteRowIndex = i + 1;
    }
  }

  return lastCompleteRowIndex;
}

export function NewsGrid({
  items,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: NewsGridProps) {
  // Trim items to only show complete rows
  const completeRowCount = getCompleteRowItemCount(items.length);
  const displayItems = items.slice(0, completeRowCount);

  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No articles found matching your filters.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayItems.map((item, index) => {
          // Create visual variety with different sized cards
          // Every 5th card (starting at index 4) spans 2 columns on larger screens
          const isWide = (index + 1) % 5 === 0 && index > 0;

          return (
            <div
              key={item.id}
              className={isWide ? 'sm:col-span-2' : ''}
            >
              <NewsCard
                item={item}
                variant={isWide ? 'secondary' : 'standard'}
              />
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </button>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && displayItems.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">You've reached the end</p>
        </div>
      )}
    </section>
  );
}
