import { TrendingUp, Wrench } from 'lucide-react';
import { PageContainer } from '../components/layout';

export function YieldsPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-chrome-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-chrome-600" />
          </div>
          <h1 className="text-3xl font-bold text-chrome-800">Stablecoin Yields</h1>
        </div>
        <p className="text-chrome-600">
          Coming soon: Compare live stablecoin yields
        </p>
      </div>

      {/* Under Construction Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 py-24 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gold-100 rounded-full mb-6">
          <Wrench className="w-12 h-12 text-gold-500" />
        </div>
        <h2 className="text-2xl font-semibold text-chrome-800 mb-2">
          Under Construction
        </h2>
        <p className="text-chrome-500 max-w-md">
          We're building out live yield comparisons across DeFi protocols. Check back soon for real-time stablecoin lending rates.
        </p>
      </div>
    </PageContainer>
  );
}
