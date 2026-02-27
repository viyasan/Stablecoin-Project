import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common/FadeInSlide';
import { useAaveYields } from '../api/yieldApi';
import type { YieldPool } from '../types/yield';

const TOKEN_LOGOS = {
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  CADC: '/cadc-logo.jpg',
} as const;

export function YieldsPage() {
  const { data: pools, isLoading, error, refetch } = useAaveYields();

  const usdcPool = pools?.find(p => p.symbol === 'USDC');
  const usdtPool = pools?.find(p => p.symbol === 'USDT');
  const displayPools = [usdcPool, usdtPool].filter(Boolean) as YieldPool[];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-chrome-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-chrome-600" />
          </div>
          <h1 className="text-3xl font-bold text-chrome-800">Stablecoin Yields</h1>
        </div>
        <p className="text-chrome-600">
          Compare live stablecoin lending yields on Aave V3 (Ethereum). Click a pool to view full details.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-status-negative/5 border border-status-negative/20 rounded-lg p-6 mb-6 text-center">
          <p className="text-status-negative mb-4">Failed to load yield data</p>
          <button
            onClick={refetch}
            className="text-status-negative hover:text-status-negative/80 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <SkeletonYieldsGrid />}

      {/* Pool Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPools.map((pool, idx) => (
            <FadeInSlide key={pool.id} delay={idx * 100}>
              <YieldPoolCard pool={pool} />
            </FadeInSlide>
          ))}
          <FadeInSlide delay={displayPools.length * 100}>
            <CadcPlaceholderCard />
          </FadeInSlide>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-12 pt-6 border-t border-chrome-200 text-center">
        <p className="text-sm text-chrome-400">
          Yield data sourced from{' '}
          <a
            href="https://defillama.com/yields"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:text-gold-600"
          >
            DeFi Llama
          </a>
          {' · '}
          Powered by{' '}
          <a
            href="https://aave.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:text-gold-600"
          >
            Aave V3
          </a>
        </p>
      </div>
    </PageContainer>
  );
}

function YieldPoolCard({ pool }: { pool: YieldPool }) {
  const navigate = useNavigate();
  const formattedTVL = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(pool.tvl);

  const logoUrl = TOKEN_LOGOS[pool.symbol as keyof typeof TOKEN_LOGOS];

  return (
    <div
      onClick={() => navigate(`/yields/aave-v3-${pool.symbol.toLowerCase()}`)}
      className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gold-200 flex flex-col items-center text-center"
    >
      {/* Token Logo */}
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${pool.symbol} logo`}
            className="w-14 h-14 object-contain"
          />
        ) : (
          <span className="text-2xl font-bold text-chrome-600">{pool.symbol[0]}</span>
        )}
      </div>

      {/* Pool Name */}
      <div className="text-xs text-chrome-500 uppercase tracking-wide mb-1">
        {pool.symbol} Yield
      </div>

      {/* APY */}
      <div className="text-4xl font-bold text-chrome-900 mb-1">
        {pool.apy.toFixed(2)}%
      </div>
      <div className="text-xs text-chrome-400 mb-4">APY</div>

      {/* TVL */}
      <div className="text-sm text-chrome-600 mb-5">
        TVL {formattedTVL}
      </div>

      {/* CTA */}
      <button className="w-full px-4 py-2.5 bg-gold-500 text-white rounded-md text-sm font-medium hover:bg-gold-600 transition-colors">
        View Details
      </button>
    </div>
  );
}

function CadcPlaceholderCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 flex flex-col items-center text-center">
      {/* CADC Logo */}
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
        <img
          src={TOKEN_LOGOS.CADC}
          alt="CADC logo"
          className="w-14 h-14 object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = 'w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-4 shadow-sm';
              parent.innerHTML = '<span class="text-2xl font-bold text-white">C</span>';
            }
          }}
        />
      </div>

      {/* Pool Name */}
      <div className="text-xs text-chrome-500 uppercase tracking-wide mb-1">
        CADC Yield
      </div>

      {/* APY */}
      <div className="text-4xl font-bold text-chrome-900 mb-1">TBA</div>
      <div className="text-xs text-chrome-400 mb-4">APY</div>

      {/* TVL */}
      <div className="text-sm text-chrome-600 mb-5">TVL TBA</div>

      {/* Coming Soon */}
      <button
        disabled
        className="w-full px-4 py-2.5 bg-chrome-100 text-chrome-400 rounded-md text-sm font-medium cursor-not-allowed"
      >
        Coming Soon
      </button>
    </div>
  );
}

function SkeletonYieldsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-chrome-100 mb-4" />
            <div className="h-3 w-16 bg-chrome-100 rounded mb-3" />
            <div className="h-10 w-24 bg-chrome-100 rounded mb-2" />
            <div className="h-3 w-8 bg-chrome-100 rounded mb-4" />
            <div className="h-4 w-20 bg-chrome-100 rounded mb-5" />
            <div className="h-10 w-full bg-chrome-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
