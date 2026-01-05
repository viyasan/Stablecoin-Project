import type { CanadianStablecoin } from '../../api';

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

interface StatusBadgeProps {
  status: CanadianStablecoin['status'];
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    live: 'bg-green-100 text-green-700 border-green-200',
    coming_soon: 'bg-amber-100 text-amber-700 border-amber-200',
    pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const dotColors = {
    live: 'bg-green-500',
    coming_soon: 'bg-amber-500',
    pending_approval: 'bg-amber-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
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
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${bgColors[status]}`}>
      {name.charAt(0)}
    </div>
  );
}

interface CompanyCardProps {
  stablecoin: CanadianStablecoin;
}

function CompanyCard({ stablecoin }: CompanyCardProps) {
  const { parentCompany } = stablecoin;
  const hasReserves = stablecoin.reserves || stablecoin.volume;
  const reserveLabel = stablecoin.status === 'live' ? 'Reserves' : 'Reserves';
  const reserveValue = stablecoin.reserves || stablecoin.volume || 'TBD';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <LogoCircle name={stablecoin.name} status={stablecoin.status} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{stablecoin.name}</h3>
                <StatusBadge status={stablecoin.status} label={stablecoin.statusLabel} />
              </div>
              <p className="text-sm text-gray-500">{parentCompany.name}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">"{stablecoin.tagline}"</p>
      </div>

      <div className="p-6">
        {/* Reserves/Volume Hero */}
        {hasReserves && (
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <TrendUpIcon className="w-4 h-4" />
              <span className="text-sm">{reserveLabel}</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {reserveValue}
            </span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-start gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Founded</p>
              <p className="text-sm font-medium text-gray-900">{stablecoin.founded}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <LocationIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Headquarters</p>
              <p className="text-sm font-medium text-gray-900">{stablecoin.headquarters}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BuildingIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Custodian</p>
              <p className="text-sm font-medium text-gray-900">{stablecoin.custodian}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Backing</p>
              <p className="text-sm font-medium text-gray-900 leading-tight">{stablecoin.backing}</p>
            </div>
          </div>
        </div>

        {/* Blockchains */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blockchains</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stablecoin.blockchains.map((chain) => (
              <span
                key={chain}
                className="inline-block px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {chain}
              </span>
            ))}
          </div>
        </div>

        {/* Key Facts */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <InfoIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Facts</span>
          </div>
          <ul className="space-y-1.5">
            {parentCompany.keyFacts.slice(0, 3).map((fact, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-500 mt-1 text-xs">●</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Backers */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Backers</span>
          </div>
          <p className="text-sm text-gray-600">
            {stablecoin.backers.slice(0, 4).join(' • ')}
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={stablecoin.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Learn More
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

interface CompanyProfileCardsProps {
  stablecoins: CanadianStablecoin[];
}

export function CompanyProfileCards({ stablecoins }: CompanyProfileCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {stablecoins.map((stablecoin) => (
        <CompanyCard key={stablecoin.id} stablecoin={stablecoin} />
      ))}
    </div>
  );
}
