import { ExternalLink } from 'lucide-react';
import type { InsightItem, InsightCategory } from '../../types';

// Source colors for badges
const SOURCE_COLORS: Record<string, string> = {
  'Artemis': '#6366F1',       // Indigo
  'a16z': '#000000',          // Black
  'Circle': '#00D395',        // Green
  'Chainalysis': '#1E40AF',   // Blue
  'Brevan Howard': '#4B5563', // Gray
  'Coinbase': '#0052FF',      // Blue
  'IMF': '#1E3A5F',           // Navy
  'BIS': '#8B0000',           // Dark red
  'BCG': '#00A651',           // Green
  'Castle Island': '#F59E0B', // Amber
};

// Category styling
const CATEGORY_STYLES: Record<InsightCategory, { bg: string; text: string; label: string }> = {
  'infrastructure': { bg: 'bg-chrome-100', text: 'text-chrome-600', label: 'Infrastructure' },
  'market-data': { bg: 'bg-chrome-100', text: 'text-chrome-600', label: 'Market Data' },
  'emerging-markets': { bg: 'bg-chrome-100', text: 'text-chrome-600', label: 'Emerging Markets' },
  'regulation': { bg: 'bg-chrome-100', text: 'text-chrome-600', label: 'Regulation' },
};

// Fallback gradient for cards without images
function getFallbackGradient(source: string): string {
  const color = SOURCE_COLORS[source] || '#6366F1';
  return `linear-gradient(135deg, ${color}22 0%, #1A1D2111 100%)`;
}

interface InsightCardProps {
  item: InsightItem;
}

export function InsightCard({ item }: InsightCardProps) {
  const sourceColor = SOURCE_COLORS[item.source] || '#6B7280';
  const categoryStyle = CATEGORY_STYLES[item.category];

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden hover:shadow-lg hover:border-chrome-300 hover:-translate-y-1 active:scale-[0.99] transition-all duration-150 ease-out"
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-200 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = getFallbackGradient(item.source);
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: getFallbackGradient(item.source) }}
            >
              <span
                className="text-2xl font-bold opacity-40"
                style={{ color: sourceColor }}
              >
                {item.source.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          {/* Source badge and category tag */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: sourceColor }}
            >
              {item.source}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
            >
              {categoryStyle.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-semibold text-chrome-900 mb-1 line-clamp-2 group-hover:text-gold-500 transition-colors duration-150">
            {item.title}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-chrome-600 line-clamp-2 flex-1">
            {item.summary}
          </p>

          {/* External link indicator */}
          <div className="flex items-center justify-end mt-2">
            <ExternalLink className="w-4 h-4 text-chrome-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </div>
        </div>
      </div>
    </article>
  );
}
