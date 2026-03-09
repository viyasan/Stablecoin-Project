import { Newspaper, RefreshCw } from 'lucide-react';
import { NewsHero, NewsGrid } from '../news';
import { useLiveNews } from '../../api/liveNewsApi';

// Skeleton loader for the hero section
function HeroSkeleton() {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/9] bg-chrome-200" />
            <div className="p-4">
              <div className="h-4 w-12 bg-chrome-200 rounded mb-2" />
              <div className="h-5 bg-chrome-200 rounded w-full mb-2" />
              <div className="h-5 bg-chrome-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Skeleton loader for the grid
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`bg-white rounded-lg shadow-sm border border-chrome-200 overflow-hidden animate-pulse ${
            i === 5 ? 'sm:col-span-2' : ''
          }`}
        >
          <div className="aspect-[4/3] bg-chrome-200" />
          <div className="p-3">
            <div className="h-4 bg-chrome-200 rounded w-full mb-2" />
            <div className="h-4 bg-chrome-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-chrome-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveNewsSection() {
  const {
    data: news,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    refetch,
  } = useLiveNews(12);

  const heroItems = news?.slice(0, 3) || [];
  const gridItems = news?.slice(3) || [];

  return (
    <div>
      {/* Error State */}
      {error && (
        <div className="bg-status-negative/5 border border-status-negative/20 rounded-lg p-6 mb-6 text-center">
          <p className="text-status-negative mb-4">Failed to load news articles</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 text-status-negative hover:text-status-negative/80 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <>
          <HeroSkeleton />
          <GridSkeleton />
        </>
      )}

      {/* Content */}
      {!isLoading && news && news.length > 0 && (
        <>
          {heroItems.length > 0 && <NewsHero items={heroItems} />}
          <NewsGrid
            items={gridItems}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </>
      )}

      {/* Empty State */}
      {!isLoading && news?.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-12 text-center">
          <Newspaper className="w-12 h-12 text-chrome-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-chrome-800 mb-2">No articles found</h3>
          <p className="text-chrome-500">Check back later for new content.</p>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-12 pt-6 border-t border-chrome-200 text-center">
        <p className="text-sm text-chrome-400">
          Powered by{' '}
          <a href="https://www.theblock.co" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">The Block</a>
          {' · '}
          <a href="https://decrypt.co" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">Decrypt</a>
          {' · '}
          <a href="https://blockworks.co" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">Blockworks</a>
          {' · '}
          <a href="https://techcrunch.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">TechCrunch</a>
          {' · '}
          <a href="https://betakit.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">BetaKit</a>
        </p>
      </div>
    </div>
  );
}
