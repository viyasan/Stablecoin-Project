import { ExternalLink } from 'lucide-react';
import type { NewsItem, TopicTag } from '../../types';

// Source logos/colors
const SOURCE_COLORS: Record<string, string> = {
  CoinDesk: '#0052FF',
  CoinTelegraph: '#F7931A',
};

// Topic tag colors
const TOPIC_COLORS: Record<TopicTag, { bg: string; text: string }> = {
  regulation: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  depeg: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  integration: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  infrastructure: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  payments: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  reserve: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  launch: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  partnership: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
};

// Asset/stablecoin colors
const ASSET_COLORS: Record<string, { bg: string; text: string }> = {
  USDT: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  USDC: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  DAI: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  PYUSD: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  BUSD: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
  FRAX: { bg: 'bg-chrome-100', text: 'text-chrome-600' },
};

function getAssetColor(asset: string) {
  return ASSET_COLORS[asset] || { bg: 'bg-chrome-100', text: 'text-chrome-600' };
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
  return gradients[source] || 'linear-gradient(135deg, #343A40 0%, #1A1D21 100%)';
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
        className="group cursor-pointer bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden hover:shadow-lg hover:border-chrome-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out"
      >
        {/* Hero Image - fixed aspect ratio */}
        <div className="relative aspect-[16/9] overflow-hidden">
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
          <h2 className="text-xl font-bold text-chrome-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors duration-150">
            {item.title}
          </h2>

          {/* Summary */}
          <p className="text-chrome-600 text-sm mb-4 line-clamp-2">{item.summary}</p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-chrome-500">
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
        className="group cursor-pointer bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden hover:shadow-lg hover:border-chrome-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out h-full flex flex-col"
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
          <h3 className="text-base font-semibold text-chrome-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors duration-150 flex-1">
            {item.title}
          </h3>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs text-chrome-500">
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
      className="group cursor-pointer bg-white rounded-lg shadow-sm border border-chrome-200 overflow-hidden hover:shadow-lg hover:border-chrome-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out h-full flex flex-col"
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
        <h3 className="text-sm font-semibold text-chrome-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors duration-150 flex-1">
          {item.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-xs text-chrome-500">
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
