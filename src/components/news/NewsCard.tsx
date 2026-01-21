import { ExternalLink } from 'lucide-react';
import type { NewsItem, TopicTag } from '../../types';

// Source logos/colors
const SOURCE_COLORS: Record<string, string> = {
  CoinDesk: '#0052FF',
  CoinTelegraph: '#F7931A',
};

// Topic tag colors
const TOPIC_COLORS: Record<TopicTag, { bg: string; text: string }> = {
  regulation: { bg: 'bg-purple-100', text: 'text-purple-700' },
  depeg: { bg: 'bg-red-100', text: 'text-red-700' },
  integration: { bg: 'bg-blue-100', text: 'text-blue-700' },
  infrastructure: { bg: 'bg-gray-100', text: 'text-gray-700' },
  payments: { bg: 'bg-green-100', text: 'text-green-700' },
  reserve: { bg: 'bg-amber-100', text: 'text-amber-700' },
  launch: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  partnership: { bg: 'bg-pink-100', text: 'text-pink-700' },
};

// Asset/stablecoin colors
const ASSET_COLORS: Record<string, { bg: string; text: string }> = {
  USDT: { bg: 'bg-green-100', text: 'text-green-700' },
  USDC: { bg: 'bg-blue-100', text: 'text-blue-700' },
  DAI: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PYUSD: { bg: 'bg-sky-100', text: 'text-sky-700' },
  BUSD: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  FRAX: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

function getAssetColor(asset: string) {
  return ASSET_COLORS[asset] || { bg: 'bg-gray-100', text: 'text-gray-600' };
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Fallback image based on source
function getFallbackImage(source: string): string {
  // Use colored gradients as fallback
  const gradients: Record<string, string> = {
    CoinDesk: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
    CoinTelegraph: 'linear-gradient(135deg, #F7931A 0%, #FFD700 100%)',
  };
  return gradients[source] || 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
}

export type NewsCardVariant = 'hero' | 'secondary' | 'standard';

interface NewsCardProps {
  item: NewsItem;
  variant?: NewsCardVariant;
}

export function NewsCard({ item, variant = 'standard' }: NewsCardProps) {
  const sourceColor = SOURCE_COLORS[item.source] || '#6B7280';
  const hasImage = !!item.imageUrl;

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'hero') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out h-full flex flex-col"
      >
        {/* Hero Image - grows to fill available space */}
        <div className="relative flex-1 min-h-[200px] overflow-hidden">
          {hasImage ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
              onError={(e) => {
                // Hide broken image and show gradient fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = getFallbackImage(item.source);
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: getFallbackImage(item.source) }}
            />
          )}
          {/* Source badge overlay */}
          <div className="absolute top-4 left-4">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: sourceColor }}
            >
              {item.source}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {item.assetSymbols.slice(0, 2).map((asset) => {
              const colors = getAssetColor(asset);
              return (
                <span
                  key={asset}
                  className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  {asset}
                </span>
              );
            })}
            {item.topics.slice(0, 1).map((topic) => {
              const colors = TOPIC_COLORS[topic];
              return (
                <span
                  key={topic}
                  className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
                >
                  {topic}
                </span>
              );
            })}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-150">
            {item.title}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.summary}</p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatTimeAgo(item.publishedAt)}</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'secondary') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {hasImage ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = getFallbackImage(item.source);
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: getFallbackImage(item.source) }}
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.assetSymbols.slice(0, 1).map((asset) => {
              const colors = getAssetColor(asset);
              return (
                <span
                  key={asset}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  {asset}
                </span>
              );
            })}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-150 flex-1">
            {item.title}
          </h3>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span style={{ color: sourceColor }} className="font-medium">
              {item.source}
            </span>
            <span>·</span>
            <span>{formatTimeAgo(item.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Standard (compact) variant
  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.background = getFallbackImage(item.source);
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: getFallbackImage(item.source) }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-150 flex-1">
          {item.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span style={{ color: sourceColor }} className="font-medium">
            {item.source}
          </span>
          <span>·</span>
          <span>{formatTimeAgo(item.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
