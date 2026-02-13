import type { CanadianStablecoin } from '../../api';

interface CompanyCardProps {
  stablecoin: CanadianStablecoin;
}

function CompanyCard({ stablecoin }: CompanyCardProps) {
  const { parentCompany } = stablecoin;

  // Get blockchain-specific colors
  const getBlockchainColors = (chain: string) => {
    const chainLower = chain.toLowerCase();
    switch (chainLower) {
      case 'ethereum':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'base':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'polygon':
        return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
      case 'algorand':
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
      default:
        return { bg: 'bg-chrome-100', text: 'text-chrome-600', border: 'border-chrome-200' };
    }
  };

  // Determine header color based on stablecoin ID - custom hex for subtle variations
  const getHeaderColors = () => {
    switch (stablecoin.id) {
      case 'qcad':
        return { gradient: 'from-[#dc2626] to-[#b91c1c]', text: 'text-red-200' }; // red-600 to red-700
      case 'tetra':
        return { gradient: 'from-[#d52424] to-[#b21a1a]', text: 'text-red-200' }; // slightly darker
      case 'cadc':
        return { gradient: 'from-[#d92525] to-[#b61b1b]', text: 'text-red-200' }; // between
      default:
        return { gradient: 'from-red-600 to-red-700', text: 'text-red-200' };
    }
  };

  // Determine button color based on stablecoin ID
  const getButtonColors = () => {
    switch (stablecoin.id) {
      case 'qcad':
        return 'bg-chrome-800 hover:bg-chrome-900';
      case 'tetra':
        return 'bg-chrome-800 hover:bg-chrome-900';
      case 'cadc':
        return 'bg-chrome-800 hover:bg-chrome-900';
      default:
        return 'bg-chrome-800 hover:bg-chrome-900';
    }
  };

  const headerColors = getHeaderColors();
  const buttonColors = getButtonColors();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden flex flex-col h-full transition-all duration-150 ease-out hover:shadow-lg hover:border-chrome-300 hover:-translate-y-1">
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerColors.gradient} px-6 py-4`}>
        <div className="flex items-center gap-3">
          {stablecoin.logo ? (
            <img
              src={stablecoin.logo}
              alt={`${stablecoin.issuer} logo`}
              className="w-12 h-12 rounded-lg bg-white p-2 object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-chrome-900 font-bold text-xs">LOON</span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white truncate">{stablecoin.issuer}</h3>
            <p className={`${headerColors.text} text-sm`}>Stablecoin: <span className="font-bold text-white">{stablecoin.name}</span></p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Parent Company Section */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
            Parent Company
          </h4>
          <p className="text-sm font-medium text-chrome-900 mb-2">{parentCompany.name}</p>
          <p className="text-sm text-chrome-600 leading-relaxed">{parentCompany.description}</p>
        </div>

        {/* Key Facts */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
            Key Facts
          </h4>
          <ul className="space-y-2">
            {parentCompany.keyFacts.slice(0, 2).map((fact, index) => (
              <li key={index} className="flex items-center gap-2.5 text-xs text-chrome-600">
                <span className="w-1.5 h-1.5 rounded-full bg-chrome-600 flex-shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stablecoin Details */}
        <div className="mb-5 pt-4 border-t border-chrome-100">
          <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-3">
            Stablecoin Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-chrome-500">Founded</span>
              <p className="font-medium text-chrome-900">{stablecoin.founded}</p>
            </div>
            <div>
              <span className="text-chrome-500">Headquarters</span>
              <p className="font-medium text-chrome-900">{stablecoin.headquarters}</p>
            </div>
          </div>
        </div>

        {/* Blockchains */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
            Blockchains
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {stablecoin.blockchains.map((chain) => {
              const colors = getBlockchainColors(chain);
              return (
                <span
                  key={chain}
                  className={`inline-block px-2.5 py-1 text-xs ${colors.bg} ${colors.text} rounded-full border ${colors.border}`}
                >
                  {chain}
                </span>
              );
            })}
          </div>
        </div>

        {/* Backers */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
            Key Backers
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {stablecoin.backers.map((backer) => (
              <span
                key={backer}
                className="inline-block px-2.5 py-1 text-xs bg-chrome-100 text-chrome-700 rounded-full"
              >
                {backer}
              </span>
            ))}
          </div>
        </div>

        {/* Strategic Partners */}
        {stablecoin.strategicPartners && stablecoin.strategicPartners.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
              Strategic Partners
            </h4>
            <div className="space-y-1.5">
              {stablecoin.strategicPartners.map((partner) => (
                <div key={partner.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-chrome-900">{partner.name}</span>
                  <span className="text-xs text-chrome-500">{partner.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Partners */}
        {stablecoin.designPartners && stablecoin.designPartners.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
              Design Partners
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stablecoin.designPartners.map((partner) => (
                <span
                  key={partner.name}
                  className="inline-block px-2.5 py-1 text-xs bg-gold-50 text-gold-600 rounded-full border border-gold-100"
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
            <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
              Platform Integrations
            </h4>
            <div className="space-y-1.5">
              {stablecoin.platformIntegrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-chrome-900">{integration.name}</span>
                  <span className="text-chrome-500">{integration.role}</span>
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
          className={`block w-full text-center py-3 px-4 ${buttonColors} text-white font-medium rounded-lg transition-all duration-150 ease-out mt-auto hover:scale-[1.02] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chrome-500 focus-visible:ring-offset-2`}
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
