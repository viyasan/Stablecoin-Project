import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStablecoinList } from '../api';
import { ProDetailHeader } from '../components/pro/detail/ProDetailHeader';
import { ProPriceHistoryChart } from '../components/pro/detail/ProPriceHistoryChart';
import { ProChainBreakdownPie } from '../components/pro/detail/ProChainBreakdownPie';
import { ProReserveComposition } from '../components/pro/detail/ProReserveComposition';
import { ProYieldOpportunities } from '../components/pro/detail/ProYieldOpportunities';

export function ProDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: stablecoins, isLoading } = useStablecoinList();

  const coin = stablecoins?.find(
    (c) => c.symbol.toLowerCase() === symbol?.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-pro-surface border border-pro-border rounded-lg p-6 animate-pulse"
          >
            <div className="h-6 w-48 bg-pro-elevated rounded mb-4" />
            <div className="h-4 w-32 bg-pro-elevated rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-pro-surface border border-pro-border rounded-lg p-8 text-center">
          <p className="text-pro-text-secondary text-lg mb-4">
            Stablecoin "{symbol?.toUpperCase()}" not found
          </p>
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Back link */}
      <Link
        to="/pro"
        className="inline-flex items-center gap-2 text-pro-text-secondary hover:text-pro-text font-mono text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Dashboard
      </Link>

      <ProDetailHeader coin={coin} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProPriceHistoryChart geckoId={coin.externalId ?? coin.symbol.toLowerCase()} />
        <ProChainBreakdownPie chainBreakdown={coin.chainBreakdown} />
      </div>

      <ProReserveComposition symbol={coin.symbol} />
      <ProYieldOpportunities symbol={coin.symbol} />
    </div>
  );
}
