import type { CanadianStablecoin } from '../../api';

interface ComparisonTableProps {
  stablecoins: CanadianStablecoin[];
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}


function PendingIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
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

export function ComparisonTable({ stablecoins }: ComparisonTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Comparison</h2>
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
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider"
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

            </tbody>
        </table>
      </div>
    </div>
  );
}
