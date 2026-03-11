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
    title: 'The WhatsApp Moment for Money Is Here',
    source: 'a16z',
    url: 'https://a16zcrypto.com/posts/article/stablecoins-whatsapp-moment-money/',
    summary: 'Stablecoins are doing to money what WhatsApp did to messaging — slashing costs, speeding settlement, and going mainstream as regulatory clarity and institutional adoption accelerate.',
    category: 'infrastructure',
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
    title: 'Allium Stablecoins Report 2026',
    source: 'Allium',
    url: 'https://stablecoininsider.org/allium-stablecoins-report-2026/',
    summary: 'Stablecoins have evolved from crypto trading tools into real payment infrastructure — $266B supply, $985B monthly volume, with usage growing faster than supply as adoption embeds in domestic payments and merchant activity.',
    category: 'market-data',
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
