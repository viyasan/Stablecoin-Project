import type { CanadianStablecoin, Exchange } from '../../api';

interface ComparisonTableProps {
  stablecoins: CanadianStablecoin[];
  exchanges: Exchange[];
}

function StatusCell({ status }: { status: CanadianStablecoin['status'] }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-status-positive font-medium">
        <span className="w-2 h-2 rounded-full bg-status-positive" />
        Live
      </span>
    );
  }
  if (status === 'coming_soon') {
    return (
      <span className="inline-flex items-center gap-1.5 text-gold-600 font-medium">
        <span className="w-2 h-2 rounded-full bg-gold-400" />
        Coming 2026
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-gold-600 font-medium">
      <span className="w-2 h-2 rounded-full bg-gold-400" />
      Pending
    </span>
  );
}

export function ComparisonTable({ stablecoins, exchanges }: ComparisonTableProps) {
  // Helper to get exchanges for a stablecoin
  const getExchangesForStablecoin = (stablecoinId: string) => {
    return exchanges.filter((e) => e.stablecoins.includes(stablecoinId));
  };

  // Get exchange-specific colors
  const getExchangeColors = (exchangeName: string) => {
    const nameLower = exchangeName.toLowerCase();
    if (nameLower.includes('netcoins')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', hover: 'hover:bg-blue-200', ring: 'ring-blue-400' };
    }
    if (nameLower.includes('newton')) {
      return { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200', ring: 'ring-green-400' };
    }
    if (nameLower.includes('coinsmart')) {
      return { bg: 'bg-purple-100', text: 'text-purple-700', hover: 'hover:bg-purple-200', ring: 'ring-purple-400' };
    }
    if (nameLower.includes('paytrie')) {
      return { bg: 'bg-chrome-800', text: 'text-white', hover: 'hover:bg-chrome-900', ring: 'ring-chrome-700' };
    }
    if (nameLower.includes('aerodrome')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', hover: 'hover:bg-blue-200', ring: 'ring-blue-400' };
    }
    // Default for unknown exchanges
    return { bg: 'bg-chrome-100', text: 'text-chrome-700', hover: 'hover:bg-chrome-200', ring: 'ring-chrome-400' };
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-chrome-100">
        <h2 className="text-lg font-semibold text-chrome-900">Canadian Stablecoins - Across the Board</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-chrome-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-chrome-500 uppercase tracking-wider">
                Feature
              </th>
              {stablecoins.map((s) => (
                <th
                  key={s.id}
                  className="px-6 py-3 text-center text-sm font-bold text-chrome-900 uppercase tracking-wider"
                >
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-chrome-100">
            {/* Status */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Status</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-center">
                  <StatusCell status={s.status} />
                </td>
              ))}
            </tr>

            {/* Issuer */}
            <tr className="bg-chrome-50/50">
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Issuer</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-900">
                  {s.issuer}
                </td>
              ))}
            </tr>

            {/* Custodian */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Custodian</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-900">
                  {s.custodian}
                </td>
              ))}
            </tr>

            {/* Backing */}
            <tr className="bg-chrome-50/50">
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Backing</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-600">
                  {s.backing}
                </td>
              ))}
            </tr>

            {/* Blockchains */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Blockchains</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-900">
                  {s.blockchains.join(', ')}
                </td>
              ))}
            </tr>

            {/* Audits */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Audits</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-600">
                  {s.audits}
                </td>
              ))}
            </tr>

            {/* Volume */}
            <tr className="bg-chrome-50/50">
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Historical Volume</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-chrome-900">
                  {s.volume || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Where to Buy */}
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-chrome-700">Where to Buy</td>
              {stablecoins.map((s) => {
                const availableExchanges = getExchangesForStablecoin(s.id);
                return (
                  <td key={s.id} className="px-6 py-4 text-sm text-center">
                    {availableExchanges.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {availableExchanges.map((e) => {
                          const colors = getExchangeColors(e.name);
                          return (
                            <a
                              key={e.name}
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text} rounded ${colors.hover} hover:scale-105 active:scale-100 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:${colors.ring}`}
                            >
                              {e.name}
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-chrome-400">Coming soon</span>
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
