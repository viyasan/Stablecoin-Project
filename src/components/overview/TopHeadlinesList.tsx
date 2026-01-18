import { Link } from 'react-router-dom';
import { useTopHeadlines } from '../../api';
import { Spinner, Tag, Badge } from '../common';
import type { NewsItem } from '../../types';

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

interface HeadlineItemProps {
  item: NewsItem;
}

function HeadlineItem({ item }: HeadlineItemProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 line-clamp-2 leading-snug">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(item.publishedAt)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.assetSymbols.slice(0, 2).map((symbol) => (
              <Badge key={symbol} variant="info" size="sm">
                {symbol}
              </Badge>
            ))}
            {item.topics.slice(0, 2).map((topic) => (
              <Tag key={topic} label={topic.charAt(0).toUpperCase() + topic.slice(1)} />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export function TopHeadlinesList() {
  const { data: headlines, isLoading, error, refetch } = useTopHeadlines(5);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !headlines) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load headlines</p>
            <button
              onClick={refetch}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Today's Top Headlines</h2>
          <span className="text-xs text-gray-400">
            Powered by{' '}
            <a
              href="https://www.coindesk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              CoinDesk
            </a>
            ,{' '}
            <a
              href="https://cointelegraph.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              CoinTelegraph
            </a>
            , and{' '}
            <a
              href="https://decrypt.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Decrypt
            </a>
          </span>
        </div>
        <Link
          to="/news"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all news →
        </Link>
      </div>
      <div className="px-6 py-2">
        {headlines.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No headlines available
          </p>
        ) : (
          headlines.map((item) => <HeadlineItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
