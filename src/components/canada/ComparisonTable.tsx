import type { CanadianStablecoin } from '../../api';

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

interface LogoCircleProps {
  name: string;
  status: CanadianStablecoin['status'];
}

function LogoCircle({ name, status }: LogoCircleProps) {
  const bgColors = {
    live: 'bg-red-100 text-red-700',
    coming_soon: 'bg-gray-100 text-gray-600',
    pending_approval: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${bgColors[status]}`}>
      {name.charAt(0)}
    </div>
  );
}

interface StatusBadgeProps {
  status: CanadianStablecoin['status'];
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    live: 'bg-green-100 text-green-700',
    coming_soon: 'bg-amber-100 text-amber-700',
    pending_approval: 'bg-amber-100 text-amber-700',
  };

  const dotColors = {
    live: 'bg-green-500',
    coming_soon: 'bg-amber-500',
    pending_approval: 'bg-amber-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
  );
}

function TbdCell() {
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400">
      <ClockIcon className="w-4 h-4" />
      TBD
    </span>
  );
}

function CheckCell() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
      <CheckIcon className="w-4 h-4 text-green-600" />
    </span>
  );
}

function PendingCell() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
      <ClockIcon className="w-4 h-4 text-amber-500" />
    </span>
  );
}

interface ComparisonTableProps {
  stablecoins: CanadianStablecoin[];
}

export function ComparisonTable({ stablecoins }: ComparisonTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Feature Comparison
        </h2>
        <p className="text-sm text-gray-500 mt-1">Compare Canadian stablecoin issuers side by side</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                Feature
              </th>
              {stablecoins.map((s) => (
                <th key={s.id} className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <LogoCircle name={s.name} status={s.status} />
                    <span className="font-bold text-gray-900">{s.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Status */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Status</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={s.status} label={s.statusLabel} />
                  </div>
                </td>
              ))}
            </tr>

            {/* Issuer */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Issuer</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.issuer}
                </td>
              ))}
            </tr>

            {/* Custodian */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Custodian</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.custodian === 'TBD' ? <TbdCell /> : s.custodian}
                </td>
              ))}
            </tr>

            {/* Backing */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Backing</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-600">
                  {s.backing}
                </td>
              ))}
            </tr>

            {/* Blockchain */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Blockchain</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.blockchains[0] === 'TBD' ? (
                    <TbdCell />
                  ) : (
                    s.blockchains.join(', ')
                  )}
                </td>
              ))}
            </tr>

            {/* FINTRAC Registered */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">FINTRAC Registered</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4">
                  <div className="flex justify-center">
                    {s.fintracRegistered ? <CheckCell /> : <PendingCell />}
                  </div>
                </td>
              ))}
            </tr>

            {/* Audits */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Audits</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-600">
                  {s.audits === 'TBD' ? <TbdCell /> : s.audits}
                </td>
              ))}
            </tr>

            {/* Historical Volume */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Historical Volume</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.volume ? (
                    <span className="font-medium">{s.volume}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                      <ClockIcon className="w-4 h-4" />
                      N/A
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Exchange Partners */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Exchange Partners</td>
              {stablecoins.map((s) => (
                <td key={s.id} className="px-6 py-4 text-sm text-center text-gray-900">
                  {s.exchangePartners > 0 ? (
                    <span className="font-medium">{s.exchangePartners} partners</span>
                  ) : (
                    <TbdCell />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
