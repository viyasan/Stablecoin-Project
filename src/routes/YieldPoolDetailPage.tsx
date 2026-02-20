import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAaveYields } from '../api/yieldApi';
import { PageContainer } from '../components/layout';
import { TiltCard } from '../components/common/TiltCard';
import { FadeInSlide } from '../components/common/FadeInSlide';
import { ChevronLeft, ExternalLink, AlertTriangle } from 'lucide-react';
import type { YieldPool } from '../types/yield';

export function YieldPoolDetailPage() {
  const { poolId } = useParams<{ poolId: string }>();
  const { data: pools, isLoading } = useAaveYields();

  // Extract symbol from route param (e.g., "aave-v3-usdc" → "USDC")
  const poolSymbol = poolId?.replace('aave-v3-', '').toUpperCase();
  const pool = pools?.find(p => p.symbol === poolSymbol);

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonYieldDetailPage />
      </PageContainer>
    );
  }

  if (!pool) {
    return (
      <PageContainer>
        <YieldPoolNotFound />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-chrome-500 hover:text-gold-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>

      {/* Hero Section with CTA */}
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-chrome-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-chrome-600">{pool.symbol[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-chrome-900">
                  {pool.symbol} Yield Pool
                </h1>
                <span className="text-sm text-chrome-500 font-medium">
                  Powered by Aave
                </span>
              </div>
              <p className="text-lg text-chrome-500">
                Earn passive yield on Ethereum
              </p>
            </div>
          </div>
          <button
            disabled
            className="px-6 py-3 bg-gold-500 text-white rounded-md font-semibold hover:bg-gold-600 transition-colors cursor-not-allowed opacity-50 whitespace-nowrap"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Bento Box Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FeaturedStatsCard pool={pool} />
        <ApyBreakdownCard pool={pool} />
      </div>

      {/* Bento Box Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <YourPositionCard pool={pool} />
        <QuickStatsCard pool={pool} />
      </div>

      {/* Full Width Sections */}
      <HowItWorksCard pool={pool} />
      <RisksCard />
    </PageContainer>
  );
}

function FeaturedStatsCard({ pool }: { pool: YieldPool }) {
  const formattedTVL = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(pool.tvl);

  return (
    <FadeInSlide delay={0}>
      <TiltCard>
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          {/* APY Display */}
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-wide text-chrome-500 mb-2">
              Current APY
            </p>
            <p className="text-5xl font-bold font-mono text-chrome-900">
              {pool.apy.toFixed(2)}%
            </p>
          </div>

          {/* TVL Display */}
          <div className="text-center mb-6 pb-6 border-b border-chrome-100">
            <p className="text-xs uppercase tracking-wide text-chrome-500 mb-2">
              Total Value Locked
            </p>
            <p className="text-3xl font-bold font-mono text-chrome-900">
              {formattedTVL}
            </p>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-chrome-400">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live · Data updated 2m ago</span>
          </div>
        </div>
      </TiltCard>
    </FadeInSlide>
  );
}

function ApyBreakdownCard({ pool }: { pool: YieldPool }) {
  return (
    <FadeInSlide delay={100}>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-chrome-900 mb-4">
          Understanding Your Yield
        </h3>

        {/* Base APY */}
        <div className="flex items-center gap-3 p-3 bg-gold-50 rounded-lg border border-gold-100 mb-3">
          <div className="w-3 h-3 rounded-full bg-gold-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gold-700">
              Base Rate: {pool.apyBase.toFixed(2)}%
            </p>
            <p className="text-xs text-gold-600/80">
              Lending yield
            </p>
          </div>
        </div>

        {/* Reward APY */}
        <div className="flex items-center gap-3 p-3 bg-chrome-50 rounded-lg border border-chrome-100">
          <div className="w-3 h-3 rounded-full bg-chrome-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-chrome-700">
              Incentive APY: {pool.apyReward.toFixed(2)}%
            </p>
            <p className="text-xs text-chrome-500">
              AAVE rewards
            </p>
          </div>
        </div>
      </div>
    </FadeInSlide>
  );
}

function YourPositionCard({ pool }: { pool: YieldPool }) {
  return (
    <FadeInSlide delay={150}>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-chrome-900 mb-4">
          Your Position
        </h3>

        {/* Deposits */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-chrome-500 mb-1">
            Your Deposits
          </p>
          <p className="text-2xl font-bold font-mono text-chrome-900">
            0 {pool.symbol}
          </p>
        </div>

        {/* Earned Interest */}
        <div className="mb-6 pb-6 border-b border-chrome-100">
          <p className="text-xs uppercase tracking-wide text-chrome-500 mb-1">
            Earned Interest
          </p>
          <p className="text-2xl font-bold font-mono text-gold-600">
            0 {pool.symbol}
          </p>
        </div>

        {/* CTA */}
        <button
          disabled
          className="w-full px-4 py-3 bg-chrome-100 text-chrome-400 rounded-md font-medium cursor-not-allowed"
        >
          Connect Wallet to Deposit
        </button>
      </div>
    </FadeInSlide>
  );
}

function QuickStatsCard({ pool }: { pool: YieldPool }) {
  const resources = [
    {
      title: 'Aave Documentation',
      url: 'https://docs.aave.com/faq/',
    },
    {
      title: 'View on DeFi Llama',
      url: `https://defillama.com/yields/pool/${pool.id}`,
    },
    {
      title: 'Open in Aave App',
      url: `https://app.aave.com/reserve-overview/?underlyingAsset=${pool.tokenAddress}&marketName=proto_mainnet_v3`,
    },
  ];

  return (
    <FadeInSlide delay={200}>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-chrome-900 mb-4">
          Pool Details
        </h3>

        {/* Info Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-chrome-500">Network</span>
            <span className="text-sm font-semibold text-chrome-900">
              {pool.chain}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-chrome-500">Protocol</span>
            <span className="text-sm font-semibold text-chrome-900">Aave V3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-chrome-500">Asset</span>
            <span className="text-sm font-semibold text-chrome-900">{pool.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-chrome-500">Pool Type</span>
            <span className="text-sm font-semibold text-chrome-900">Lending</span>
          </div>
        </div>

        {/* External Links */}
        <div className="space-y-2">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-md hover:bg-gold-50 hover:text-gold-600 transition-colors group"
            >
              <span className="text-sm">{resource.title}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </FadeInSlide>
  );
}

function HowItWorksCard({ pool }: { pool: YieldPool }) {
  const steps = [
    {
      title: 'Deposit',
      description: `Supply ${pool.symbol} to the pool`,
    },
    {
      title: 'Receive aTokens',
      description: `Get interest-bearing a${pool.symbol}`,
    },
    {
      title: 'Auto-Compound',
      description: 'Yield accrues continuously',
    },
    {
      title: 'Withdraw',
      description: 'Redeem principal + yield anytime',
    },
  ];

  return (
    <FadeInSlide delay={250}>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-xl font-semibold text-chrome-900 mb-6">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              {/* Step Number Circle */}
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {idx + 1}
              </div>

              {/* Step Title */}
              <h4 className="font-semibold text-chrome-800 mb-2">
                {step.title}
              </h4>

              {/* Step Description */}
              <p className="text-xs text-chrome-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FadeInSlide>
  );
}

function RisksCard() {
  const risks = [
    {
      title: 'Smart Contract Risk',
      description: 'While audited by leading security firms, smart contracts carry inherent risk. Always assess your risk tolerance.',
      severity: 'high',
    },
    {
      title: 'Impermanent APY',
      description: 'Yield rates adjust dynamically based on protocol utilization and market conditions.',
      severity: 'medium',
    },
    {
      title: 'Protocol Dependencies',
      description: 'Returns depend on protocol solvency, governance decisions, and continued operation.',
      severity: 'medium',
    },
    {
      title: 'Liquidity Constraints',
      description: 'Withdrawals require available pool liquidity. High utilization may temporarily limit access.',
      severity: 'low',
    },
  ];

  return (
    <FadeInSlide delay={300}>
      <div className="bg-chrome-50 rounded-lg shadow-sm border border-gold-200 p-6 mb-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-gold-100 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-chrome-900 mb-1">
              Risk Considerations
            </h3>
            <p className="text-sm text-chrome-600">
              DeFi protocols involve risk. Review these factors before depositing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((risk) => (
            <div
              key={risk.title}
              className="p-4 bg-white rounded-lg border-l-4 border-gold-400 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-chrome-900 mb-1 text-sm">
                {risk.title}
              </h4>
              <p className="text-xs text-chrome-600 leading-relaxed">
                {risk.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-chrome-200">
          <p className="text-xs text-chrome-500 text-center">
            Not financial advice. DYOR. Only deposit capital you can afford to lose.
          </p>
        </div>
      </div>
    </FadeInSlide>
  );
}

function SkeletonYieldDetailPage() {
  return (
    <div className="space-y-8">
      <div className="h-6 w-32 bg-chrome-100 rounded animate-pulse"></div>
      <div className="h-20 bg-chrome-100 rounded animate-pulse"></div>
      <div className="h-48 bg-chrome-100 rounded animate-pulse"></div>
      <div className="h-64 bg-chrome-100 rounded animate-pulse"></div>
    </div>
  );
}

function YieldPoolNotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8 text-center">
      <h2 className="text-2xl font-bold text-chrome-800 mb-2">Yield Pool Not Found</h2>
      <p className="text-chrome-600 mb-6">
        The yield pool you're looking for doesn't exist or couldn't be loaded.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-gold-500 text-white rounded-md font-medium hover:bg-gold-600 transition-colors"
      >
        Back to Overview
      </button>
    </div>
  );
}
