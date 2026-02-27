import { useNavigate } from 'react-router-dom';
import { useAaveYields } from '../../api/yieldApi';
import { TiltCard } from '../common';
import type { YieldPool } from '../../types/yield';

// Token logo URLs
const TOKEN_LOGOS = {
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  CADC: '/cadc-logo.jpg',
} as const;

export function YieldCard() {
  const { data: pools, isLoading, error, refetch } = useAaveYields();

  if (isLoading) {
    return <SkeletonYieldCard />;
  }

  if (error || !pools || pools.length === 0) {
    return (
      <TiltCard>
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <p className="text-chrome-500 text-sm">
            Unable to load yield data.{' '}
            <button onClick={refetch} className="text-gold-500 underline">
              Try again
            </button>
          </p>
        </div>
      </TiltCard>
    );
  }

  // Get specific pools in order: USDC, USDT
  const usdcPool = pools.find(p => p.symbol === 'USDC');
  const usdtPool = pools.find(p => p.symbol === 'USDT');
  const displayPools = [usdcPool, usdtPool].filter(Boolean) as YieldPool[];

  return (
    <TiltCard>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 transition-all duration-200 hover:shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-chrome-100">
          <h2 className="text-lg font-semibold text-chrome-900">
            Stablecoin Yields
          </h2>
        </div>

        {/* Pool Grid - 3 columns (USDC, USDT, CADC) */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* USDC and USDT pools */}
            {displayPools.map(pool => (
              <YieldPoolColumn key={pool.id} pool={pool} />
            ))}
            {/* CADC placeholder */}
            <CadcPlaceholderColumn />
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-chrome-100 text-xs text-chrome-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-status-positive animate-pulse flex-shrink-0" />
            <span>Yield data refreshed just now</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function YieldPoolColumn({ pool }: { pool: YieldPool }) {
  const navigate = useNavigate();
  const formattedTVL = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(pool.tvl);

  const handleLearnMore = () => {
    navigate(`/yields/aave-v3-${pool.symbol.toLowerCase()}`);
  };

  const logoUrl = TOKEN_LOGOS[pool.symbol as keyof typeof TOKEN_LOGOS];

  return (
    <div className="flex flex-col items-center text-center p-4 border border-chrome-100 rounded-lg hover:border-gold-200 transition-colors">
      {/* Token Logo */}
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${pool.symbol} logo`}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <span className="text-lg font-bold text-chrome-600">{pool.symbol[0]}</span>
        )}
      </div>

      {/* Pool Name */}
      <div className="text-xs text-chrome-500 uppercase tracking-wide mb-1">
        {pool.symbol} Yield
      </div>

      {/* APY (most prominent) */}
      <div className="text-3xl font-bold text-chrome-900 mb-1">
        {pool.apy.toFixed(2)}%
      </div>
      <div className="text-xs text-chrome-400 mb-3">APY</div>

      {/* TVL */}
      <div className="text-sm text-chrome-600 mb-4">
        TVL {formattedTVL}
      </div>

      {/* Learn More Button */}
      <button
        onClick={handleLearnMore}
        className="w-full px-4 py-2 bg-gold-500 text-white rounded-md text-sm font-medium hover:bg-gold-600 transition-colors"
      >
        Learn More
      </button>
    </div>
  );
}

function CadcPlaceholderColumn() {
  return (
    <div className="flex flex-col items-center text-center p-4 border border-chrome-100 rounded-lg">
      {/* CADC Logo */}
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3">
        <img
          src={TOKEN_LOGOS.CADC}
          alt="CADC logo"
          className="w-12 h-12 object-contain"
          onError={(e) => {
            // Fallback to styled red circle if image fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = 'w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-3 shadow-sm';
              parent.innerHTML = '<span class="text-2xl font-bold text-white">C</span>';
            }
          }}
        />
      </div>

      {/* Pool Name */}
      <div className="text-xs text-chrome-500 uppercase tracking-wide mb-1">
        CADC Yield
      </div>

      {/* APY (TBA) */}
      <div className="text-3xl font-bold text-chrome-900 mb-1">
        TBA
      </div>
      <div className="text-xs text-chrome-400 mb-3">APY</div>

      {/* TVL Placeholder */}
      <div className="text-sm text-chrome-600 mb-4">
        TVL TBA
      </div>

      {/* Coming Soon Button (disabled) */}
      <button
        disabled
        className="w-full px-4 py-2 bg-chrome-100 text-chrome-400 rounded-md text-sm font-medium cursor-not-allowed"
      >
        Coming Soon
      </button>
    </div>
  );
}

function SkeletonYieldCard() {
  return (
    <TiltCard>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
        <div className="h-6 w-48 bg-chrome-100 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-chrome-50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
