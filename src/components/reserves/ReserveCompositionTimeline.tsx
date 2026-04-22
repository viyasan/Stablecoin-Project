import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { ReserveSnapshot } from '../../data/reserveHistory';
import { formatBillions } from '../../utils/formatters';

interface ReserveCompositionTimelineProps {
  snapshots: ReserveSnapshot[];
  symbol: string;
}

function SinglePointView({ snapshot }: { snapshot: ReserveSnapshot }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm font-medium text-chrome-700">{snapshot.reportPeriod}</p>
        <p className="text-sm text-chrome-500">
          Total: <span className="font-mono-numbers font-semibold text-chrome-800">{formatBillions(snapshot.totalReserves)}</span>
        </p>
      </div>
      <div className="space-y-3">
        {snapshot.assets.map((asset) => (
          <div key={asset.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                <span className="text-sm text-chrome-700">{asset.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono-numbers text-chrome-500">{asset.percentage}%</span>
                <span className="text-sm font-mono-numbers font-semibold text-chrome-800">{formatBillions(asset.value)}</span>
              </div>
            </div>
            <div className="h-2 bg-chrome-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${asset.percentage}%`, backgroundColor: asset.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-chrome-400 text-center">
        More data points will appear as reports are added
      </p>
    </div>
  );
}

function renderContent(
  snapshots: ReserveSnapshot[],
  chartData: Record<string, string | number>[],
  assetMeta: { name: string; color: string }[]
) {
  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-chrome-400">
        <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No attestation data available yet</p>
        <p className="text-xs mt-1">Reports will appear here as they are added</p>
      </div>
    );
  }

  if (snapshots.length === 1) {
    return <SinglePointView snapshot={snapshots[0]} />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => formatBillions(v)}
        />
        <Tooltip
          formatter={(value) => [formatBillions(value as number)]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #DEE2E6',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        {assetMeta.map((asset) => (
          <Area
            key={asset.name}
            type="monotone"
            dataKey={asset.name}
            stackId="1"
            stroke={asset.color}
            fill={asset.color}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ReserveCompositionTimeline({ snapshots, symbol }: ReserveCompositionTimelineProps) {
  const { chartData, assetMeta } = useMemo(() => {
    const data = snapshots.map((snap) => {
      const entry: Record<string, string | number> = { date: snap.reportPeriod };
      snap.assets.forEach((asset) => { entry[asset.name] = asset.value; });
      return entry;
    });

    const seen = new Set<string>();
    const meta: { name: string; color: string }[] = [];
    snapshots.forEach((snap) =>
      snap.assets.forEach((asset) => {
        if (!seen.has(asset.name)) {
          seen.add(asset.name);
          meta.push({ name: asset.name, color: asset.color });
        }
      })
    );

    return { chartData: data, assetMeta: meta };
  }, [snapshots]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-chrome-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold-500" />
          <h2 className="text-lg font-semibold text-chrome-900">
            Reserve Composition — {symbol}
          </h2>
        </div>
        <p className="text-xs text-chrome-500 mt-1">Asset breakdown over time</p>
      </div>

      <div className="px-6 py-6 flex-1">
        {renderContent(snapshots, chartData, assetMeta)}
      </div>
    </div>
  );
}
