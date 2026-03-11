import { InsightCard } from './InsightCard';
import type { InsightItem } from '../../types';

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

export function InsightsSection() {
  return (
    <div>
      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {INSIGHTS.map((insight) => (
          <InsightCard key={insight.id} item={insight} />
        ))}
      </div>

      {/* Attribution */}
      <div className="mt-8 text-center">
        <p className="text-sm text-chrome-400">
          Curated by StablecoinStats · Updated February 2026
        </p>
      </div>
    </div>
  );
}
