import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, ExternalLink, Loader2 } from 'lucide-react';
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
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
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
            border: '1px solid #E5E7EB',
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
    <div className="space-y-2">
      {assets.map((asset) => (
        <div key={asset.name} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: asset.color }}
            />
            <span className="text-gray-600">{asset.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono-numbers text-gray-500">{asset.percentage}%</span>
            <span className="font-mono-numbers text-gray-900 font-medium w-16 text-right">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !reservesData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load reserve data</p>
      </div>
    );
  }

  const reserve = selectedCoin === 'USDT' ? reservesData.usdt : reservesData.usdc;
  const marketCap = reserve.marketCap;

  // Calculate dollar amounts from live market cap and percentages
  const assetsWithAmounts: ReserveAssetWithAmount[] = reserve.assets.map((asset) => ({
    ...asset,
    amount: formatBillions((asset.percentage / 100) * marketCap),
  }));

  // Calculate US government exposure
  const usdtGovExposure = 78 + 11; // Treasuries + Repos
  const usdcGovExposure = 53 + 32; // Repos + Treasuries

  // Calculate Treasury holdings amount
  const treasuryAmount = formatBillions((reserve.usTreasuryPercentage / 100) * marketCap);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              What Backs Your Stablecoins?
            </h2>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Reserve composition breakdown by asset type
        </p>
      </div>

      <div className="px-6 py-4">
        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedCoin('USDT')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCoin === 'USDT'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="block text-xs opacity-75">Tether</span>
            <span className="block font-bold">USDT</span>
          </button>
          <button
            onClick={() => setSelectedCoin('USDC')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCoin === 'USDC'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="block text-xs opacity-75">Circle</span>
            <span className="block font-bold">USDC</span>
          </button>
        </div>

        {/* Supply info */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">Total Supply</p>
          <p className="text-2xl font-bold font-mono-numbers text-gray-900">
            {formatBillions(marketCap)}
          </p>
        </div>

        {/* Chart and Legend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReservePieChart assets={assetsWithAmounts} />
          <ReserveLegend assets={assetsWithAmounts} />
        </div>

        {/* Key insight */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>
              {selectedCoin === 'USDT' ? usdtGovExposure : usdcGovExposure}% US Government Backed
            </strong>
            {' — '}
            {selectedCoin === 'USDT'
              ? `Tether holds ${treasuryAmount} in Treasuries, ranking 17th globally among nation holders`
              : 'Circle holds 85% in Treasury securities and repos, managed by BlackRock'}
          </p>
        </div>

        {/* Source */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Percentages from: {reserve.lastUpdated}
          </p>
          <a
            href={reserve.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View attestation
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
