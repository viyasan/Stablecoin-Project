import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Loader2 } from 'lucide-react';
import { useStablecoinReserves, type ReserveAsset } from '../../api/marketApi';

// Helper to format billions
function formatBillions(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(0)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  return `$${value.toFixed(0)}`;
}

interface ReserveAssetWithAmount extends ReserveAsset {
  amount: string;
}

function ReservePieChart({ assets }: { assets: ReserveAssetWithAmount[] }) {
  // Convert to plain objects for Recharts compatibility
  const chartData = assets.map((asset) => ({
    name: asset.name,
    percentage: asset.percentage,
    color: asset.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          dataKey="percentage"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #DEE2E6',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ReserveLegend({ assets }: { assets: ReserveAssetWithAmount[] }) {
  return (
    <div className="space-y-3 flex flex-col justify-center h-full">
      {assets.map((asset) => (
        <div key={asset.name} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: asset.color }}
            />
            <span className="text-chrome-700 font-medium">{asset.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-numbers text-chrome-500">{asset.percentage}%</span>
            <span className="font-mono-numbers text-chrome-900 font-semibold w-16 text-right">
              {asset.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReserveCompositionCard() {
  const [selectedCoin, setSelectedCoin] = useState<'USDT' | 'USDC'>('USDT');
  const { data: reservesData, isLoading, error } = useStablecoinReserves();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !reservesData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex items-center justify-center min-h-[400px]">
        <p className="text-chrome-500">Failed to load reserve data</p>
      </div>
    );
  }

  const reserve = selectedCoin === 'USDT' ? reservesData.usdt : reservesData.usdc;
  const marketCap = reserve.marketCap;

  // Use static treasury holdings from attestation reports
  const treasuryHoldings = reserve.treasuryHoldings;
  const treasuryAmount = formatBillions(treasuryHoldings);

  // Calculate dollar amounts - use static treasury value, derive others from remaining
  const treasuryPercentage = reserve.assets.find(a => a.name === 'US Treasuries')?.percentage || 0;
  const assetsWithAmounts: ReserveAssetWithAmount[] = reserve.assets.map((asset) => {
    if (asset.name === 'US Treasuries') {
      // Use static treasury holdings value
      return { ...asset, amount: treasuryAmount };
    }
    // Calculate other assets based on their proportion relative to treasuries
    const estimatedAmount = (asset.percentage / treasuryPercentage) * treasuryHoldings;
    return { ...asset, amount: formatBillions(estimatedAmount) };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-chrome-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-500" />
            <h2 className="text-lg font-semibold text-chrome-900">
              What Backs Your Stablecoins?
            </h2>
          </div>
          <a
            href={reserve.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-chrome-400 hover:text-chrome-600"
          >
            Source: {reserve.lastUpdated}
          </a>
        </div>
        <p className="text-xs text-chrome-500">
          Reserve composition breakdown by asset type
        </p>
      </div>

      <div className="px-6 py-4 flex-1 flex flex-col">
        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedCoin('USDT')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCoin === 'USDT'
                ? 'bg-green-600 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            <span className="block text-xs opacity-75">Tether</span>
            <span className="block font-bold">USDT</span>
          </button>
          <button
            onClick={() => setSelectedCoin('USDC')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCoin === 'USDC'
                ? 'bg-blue-600 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            <span className="block text-xs opacity-75">Circle</span>
            <span className="block font-bold">USDC</span>
          </button>
        </div>

        {/* Supply info */}
        <div className="text-center mb-6">
          <p className="text-sm text-chrome-500">Total Supply</p>
          <p className="text-3xl font-bold font-mono-numbers text-chrome-900">
            {formatBillions(marketCap)}
          </p>
        </div>

        {/* Chart and Legend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-center">
          <ReservePieChart assets={assetsWithAmounts} />
          <ReserveLegend assets={assetsWithAmounts} />
        </div>

        {/* Key insight */}
        <div className="mt-auto pt-6">
          <div className="p-3 bg-gold-50 rounded-lg border border-gold-100">
          <p className="text-sm text-chrome-800">
            <strong>
              {treasuryPercentage}% in US Treasuries
            </strong>
            {' — '}
            {selectedCoin === 'USDT'
              ? `Tether holds ${treasuryAmount} in Treasuries, ranking #17 globally`
              : `Circle holds ${treasuryAmount} in Treasuries, managed by BlackRock`}
          </p>
          </div>
        </div>

      </div>
    </div>
  );
}
