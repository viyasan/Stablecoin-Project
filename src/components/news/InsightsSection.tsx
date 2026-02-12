import { useState } from 'react';
import { InsightCard } from './InsightCard';
import type { InsightItem, InsightCategory } from '../../types';

// Curated insights - update monthly
// Last updated: February 2026
const INSIGHTS: InsightItem[] = [
  {
    id: '1',
    title: 'Stablecoins Are a Rail, Not a Brand',
    source: 'Artemis',
    url: 'https://www.artemis.xyz/research/stablecoins-are-a-rail-not-a-brand',
    summary: 'Why stablecoins succeed through distribution and infrastructure, not branding. A deep dive into what makes stablecoin adoption sticky.',
    category: 'infrastructure',
  },
  {
    id: '2',
    title: 'Stablecoin Payments at Scale',
    source: 'Artemis',
    url: 'https://www.artemis.xyz/research/stablecoin-payments-at-scale',
    summary: 'How stablecoins are achieving mainstream payment adoption and what infrastructure enables transactions at scale.',
    category: 'infrastructure',
  },
  {
    id: '3',
    title: 'State of Crypto 2025',
    source: 'a16z',
    url: 'https://a16zcrypto.com/posts/article/state-of-crypto-report-2025/',
    summary: 'Comprehensive annual report covering crypto adoption trends, stablecoin growth, and emerging use cases across DeFi and payments.',
    category: 'market-data',
  },
  {
    id: '4',
    title: 'State of the USDC Economy',
    source: 'Circle',
    url: 'https://www.circle.com/reports/state-of-the-usdc-economy',
    summary: 'Official Circle report on USDC circulation, use cases, and the growing ecosystem of applications built on USDC rails.',
    category: 'market-data',
  },
  {
    id: '5',
    title: '2026 Crypto Market Outlook',
    source: 'Coinbase',
    url: 'https://www.coinbase.com/institutional/research-insights/research/monthly-outlook',
    summary: 'Institutional outlook covering stablecoin regulatory progress, adoption trends, and market structure evolution.',
    category: 'emerging-markets',
  },
  {
    id: '6',
    title: 'Understanding Stablecoins',
    source: 'IMF',
    url: 'https://www.imf.org/en/Publications/fintech-notes/Issues/2024/04/stablecoins',
    summary: 'IMF analysis of stablecoin mechanics, risks, and policy considerations for monetary authorities worldwide.',
    category: 'regulation',
  },
];

// Category filter options
const CATEGORY_FILTERS: { value: InsightCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'market-data', label: 'Market Data' },
  { value: 'emerging-markets', label: 'Emerging Markets' },
  { value: 'regulation', label: 'Regulation' },
];

export function InsightsSection() {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | 'all'>('all');

  const filteredInsights = selectedCategory === 'all'
    ? INSIGHTS
    : INSIGHTS.filter((insight) => insight.category === selectedCategory);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedCategory(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              selectedCategory === filter.value
                ? 'bg-gold-500 text-white'
                : 'bg-chrome-100 text-chrome-700 hover:bg-chrome-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} item={insight} />
        ))}
      </div>

      {/* Empty state */}
      {filteredInsights.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-12 text-center">
          <p className="text-chrome-500">No insights found in this category.</p>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-8 text-center">
        <p className="text-sm text-chrome-400">
          Curated by StablecoinStats · Updated February 2026
        </p>
      </div>
    </div>
  );
}
