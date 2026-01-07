import type { CanadianStablecoin } from '../../api';

interface StatusBadgeProps {
  status: CanadianStablecoin['status'];
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    live: 'bg-green-100 text-green-800 border-green-200',
    coming_soon: 'bg-amber-100 text-amber-800 border-amber-200',
    pending_approval: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const icons = {
    live: (
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    ),
    coming_soon: (
      <span className="w-2 h-2 rounded-full bg-amber-500" />
    ),
    pending_approval: (
      <span className="w-2 h-2 rounded-full bg-amber-500" />
    ),
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}
    >
      {icons[status]}
      {label}
    </span>
  );
}

interface CompanyCardProps {
  stablecoin: CanadianStablecoin;
}

function CompanyCard({ stablecoin }: CompanyCardProps) {
  const { parentCompany } = stablecoin;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{stablecoin.issuer}</h3>
            <p className="text-red-100 text-sm">Stablecoin: <span className="font-bold text-white">{stablecoin.name}</span></p>
          </div>
          <StatusBadge status={stablecoin.status} label={stablecoin.statusLabel} />
        </div>
      </div>

      <div className="p-6">
        {/* Parent Company Section */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Parent Company
          </h4>
          <p className="text-sm font-medium text-gray-900 mb-2">{parentCompany.name}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{parentCompany.description}</p>
        </div>

        {/* Key Facts */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Key Facts
          </h4>
          <ul className="space-y-2">
            {parentCompany.keyFacts.slice(0, 3).map((fact, index) => (
              <li key={index} className="flex items-center gap-2.5 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stablecoin Details */}
        <div className="mb-5 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Stablecoin Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Founded</span>
              <p className="font-medium text-gray-900">{stablecoin.founded}</p>
            </div>
            <div>
              <span className="text-gray-500">Headquarters</span>
              <p className="font-medium text-gray-900">{stablecoin.headquarters}</p>
            </div>
          </div>
        </div>

        {/* Blockchains */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Blockchains
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {stablecoin.blockchains.map((chain) => (
              <span
                key={chain}
                className="inline-block px-2.5 py-1 text-xs bg-red-50 text-red-700 rounded-full border border-red-100"
              >
                {chain}
              </span>
            ))}
          </div>
        </div>

        {/* Backers */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Key Backers
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {stablecoin.backers.map((backer) => (
              <span
                key={backer}
                className="inline-block px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {backer}
              </span>
            ))}
          </div>
        </div>

        {/* Strategic Partners */}
        {stablecoin.strategicPartners && stablecoin.strategicPartners.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Strategic Partners
            </h4>
            <div className="space-y-1.5">
              {stablecoin.strategicPartners.map((partner) => (
                <div key={partner.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{partner.name}</span>
                  <span className="text-xs text-gray-500">{partner.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Partners */}
        {stablecoin.designPartners && stablecoin.designPartners.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Design Partners
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stablecoin.designPartners.map((partner) => (
                <span
                  key={partner.name}
                  className="inline-block px-2.5 py-1 text-xs bg-amber-50 text-amber-700 rounded-full border border-amber-100"
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Platform Integrations */}
        {stablecoin.platformIntegrations && stablecoin.platformIntegrations.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Platform Integrations
            </h4>
            <div className="space-y-1.5">
              {stablecoin.platformIntegrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{integration.name}</span>
                  <span className="text-gray-500">{integration.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <a
          href={stablecoin.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Learn More
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
