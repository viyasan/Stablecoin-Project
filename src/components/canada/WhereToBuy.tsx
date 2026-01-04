import type { Exchange, CanadianStablecoin } from '../../api';

interface ExchangeCardProps {
  exchange: Exchange;
}

function ExchangeCard({ exchange }: ExchangeCardProps) {
  return (
    <a
      href={exchange.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors group"
    >
      <div className="flex items-center gap-3">
        {/* Placeholder for logo */}
        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-600">
            {exchange.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900 group-hover:text-red-700">{exchange.name}</p>
          <p className="text-xs text-gray-500">{exchange.type}</p>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

interface StablecoinExchangesProps {
  stablecoin: CanadianStablecoin;
  exchanges: Exchange[];
}

function StablecoinExchanges({ stablecoin, exchanges }: StablecoinExchangesProps) {
  const availableExchanges = exchanges.filter((e) =>
    e.stablecoins.includes(stablecoin.id)
  );

  if (stablecoin.status !== 'live' || availableExchanges.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{stablecoin.name}</h3>
          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
            {stablecoin.statusLabel}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {stablecoin.status === 'live'
            ? 'Exchange partnerships coming soon.'
            : 'Not yet available for purchase. Check back after launch.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{stablecoin.name}</h3>
        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
          {availableExchanges.length} {availableExchanges.length === 1 ? 'exchange' : 'exchanges'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableExchanges.map((exchange) => (
          <ExchangeCard key={exchange.name} exchange={exchange} />
        ))}
      </div>
    </div>
  );
}

interface WhereToBuyProps {
  stablecoins: CanadianStablecoin[];
  exchanges: Exchange[];
}

export function WhereToBuy({ stablecoins, exchanges }: WhereToBuyProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Where to Buy</h2>
        <p className="text-sm text-gray-500 mt-1">
          Canadian exchanges supporting CAD stablecoins
        </p>
      </div>
      <div className="p-6 space-y-8">
        {stablecoins.map((stablecoin) => (
          <StablecoinExchanges
            key={stablecoin.id}
            stablecoin={stablecoin}
            exchanges={exchanges}
          />
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          More platforms coming as regulatory approvals progress
        </p>
      </div>
    </div>
  );
}
