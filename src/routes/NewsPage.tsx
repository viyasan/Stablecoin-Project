import { useState } from 'react';
import { Newspaper, BookOpen } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { NewsHero, NewsGrid, InsightsSection } from '../components/news';
import { usePaginatedNews } from '../api';

type TabType = 'news' | 'insights';

// Skeleton loader for the hero section
function HeroSkeleton() {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Featured skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-[16/9] bg-gray-200" />
            <div className="p-5">
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
        {/* Secondary skeletons */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/9] bg-gray-200" />
              <div className="p-4">
                <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
                <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
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
          className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse ${
            i === 5 ? 'sm:col-span-2' : ''
          }`}
        >
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('news');
  const {
    data: news,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    refetch,
  } = usePaginatedNews({}, 12);

  // Split news into hero (first 3) and grid (rest)
  const heroItems = news?.slice(0, 3) || [];
  const gridItems = news?.slice(3) || [];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Newspaper className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">News & Insights</h1>
        </div>
        <p className="text-gray-600">
          Stay updated on the latest stablecoin developments and explore curated research from industry experts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
            activeTab === 'news'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Latest News
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
            activeTab === 'insights'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Research & Insights
        </button>
      </div>

      {/* News Tab Content */}
      {activeTab === 'news' && (
        <>
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center">
              <p className="text-red-600 mb-4">Failed to load news articles</p>
              <button
                onClick={refetch}
                className="text-red-700 hover:text-red-800 font-medium"
              >
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
          {!isLoading && news && (
            <>
              {/* Hero Section - Featured Articles */}
              {heroItems.length > 0 && <NewsHero items={heroItems} />}

              {/* Grid Section - Remaining Articles */}
              <NewsGrid
                items={gridItems}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </>
          )}

          {/* Empty State */}
          {!isLoading && news?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">
                Check back later for new content.
              </p>
            </div>
          )}

          {/* Attribution */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-400">
              Powered by{' '}
              <a
                href="https://www.coindesk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                CoinDesk
              </a>
              {' · '}
              <a
                href="https://cointelegraph.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                CoinTelegraph
              </a>
            </p>
          </div>
        </>
      )}

      {/* Insights Tab Content */}
      {activeTab === 'insights' && <InsightsSection />}
    </PageContainer>
  );
}
