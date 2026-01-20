import type { CanadianStablecoin, Exchange } from '../../api';

interface ComparisonTableProps {
  stablecoins: CanadianStablecoin[];
  exchanges: Exchange[];
}

function StatusCell({ status }: { status: CanadianStablecoin['status'] }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Live
      </span>
    );
  }
  if (status === 'coming_soon') {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Coming 2026
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      Pending
    </span>
  );
}

export function ComparisonTable({ stablecoins, exchanges }: ComparisonTableProps) {
  // Helper to get exchanges for a stablecoin
  const getExchangesForStablecoin = (stablecoinId: string) => {
    return exchanges.filter((e) => e.stablecoins.includes(stablecoinId));
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Canadian Stablecoins - Across the Board</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              {stablecoins.map((s) => (
                <th
                  key={s.id}
                  className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider"
                >
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Status */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Status</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-center">
                  <StatusCell status={s.status} />
                </td>
              ))}
            </tr>

            {/* Issuer */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Issuer</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.issuer}
                </td>
              ))}
            </tr>

            {/* Custodian */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Custodian</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.custodian}
                </td>
              ))}
            </tr>

            {/* Backing */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Backing</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-600">
                  {s.backing}
                </td>
              ))}
            </tr>

            {/* Blockchains */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Blockchains</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.blockchains.join(', ')}
                </td>
              ))}
            </tr>

            {/* Audits */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Audits</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-600">
                  {s.audits}
                </td>
              ))}
            </tr>

            {/* Volume */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Historical Volume</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.volume || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Where to Buy */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Where to Buy</td>
              {stablecoins.map((s) => {
                const availableExchanges = getExchangesForStablecoin(s.id);
                return (
                  <td key={s.id} className="px-6 py-4 text-sm text-center">
                    {availableExchanges.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {availableExchanges.map((e) => (
                          <a
                            key={e.name}
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                          >
                            {e.name}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Coming soon</span>
                    )}
                  </td>
                );
              })}
            </tr>

            </tbody>
        </table>
      </div>
    </div>
  );
}
