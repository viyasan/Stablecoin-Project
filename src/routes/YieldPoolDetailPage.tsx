import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAaveYields } from '../api/yieldApi';
import { PageContainer } from '../components/layout';
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

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-chrome-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-chrome-600">{pool.symbol[0]}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-chrome-800">
              Aave V3 {pool.symbol} Lending Pool
            </h1>
            <p className="text-lg text-chrome-500 mt-1">
              Earn passive income by depositing {pool.symbol} into Aave V3, the leading decentralized lending protocol on Ethereum
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Card */}
      <KeyMetricsCard pool={pool} />

      {/* APY Breakdown Card */}
      <ApyBreakdownCard pool={pool} />

      {/* How It Works Section */}
      <HowItWorksSection pool={pool} />

      {/* Risks Card */}
      <RisksCard />

      {/* External Resources */}
      <ExternalResourcesSection pool={pool} />

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <CtaSection />
    </PageContainer>
  );
}

function KeyMetricsCard({ pool }: { pool: YieldPool }) {
  const formattedTVL = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(pool.tvl);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-chrome-800 mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-chrome-500 mb-1">Current APY</div>
          <div className="text-3xl font-bold text-chrome-900">{pool.apy.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-sm text-chrome-500 mb-1">Total Value Locked</div>
          <div className="text-3xl font-bold text-chrome-900">{formattedTVL}</div>
        </div>
        <div>
          <div className="text-sm text-chrome-500 mb-1">Chain</div>
          <div className="text-lg font-semibold text-chrome-800">{pool.chain}</div>
        </div>
        <div>
          <div className="text-sm text-chrome-500 mb-1">Protocol</div>
          <div className="text-lg font-semibold text-chrome-800">Aave V3</div>
        </div>
      </div>
    </div>
  );
}

function ApyBreakdownCard({ pool }: { pool: YieldPool }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-chrome-800 mb-4">Understanding Your Yield</h2>

      <div className="space-y-4">
        <div>
          <div className="text-lg font-semibold text-chrome-800 mb-2">
            Total APY: {pool.apy.toFixed(2)}%
          </div>
          <div className="ml-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-chrome-500">├─</span>
              <div>
                <span className="font-medium text-chrome-700">Base APY: {pool.apyBase.toFixed(2)}%</span>
                <span className="text-sm text-chrome-500 ml-2">(from borrower interest payments)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-chrome-500">└─</span>
              <div>
                <span className="font-medium text-chrome-700">Reward APY: {pool.apyReward.toFixed(2)}%</span>
                <span className="text-sm text-chrome-500 ml-2">(from AAVE token incentives)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-chrome-600 mt-4">
          The base APY comes from borrowers paying interest to use your deposited {pool.symbol} as liquidity.
          Reward APY comes from AAVE governance tokens distributed as incentives to lenders.
        </p>
      </div>
    </div>
  );
}

function HowItWorksSection({ pool }: { pool: YieldPool }) {
  const steps = [
    {
      number: 1,
      title: 'Deposit ' + pool.symbol,
      description: `Connect your wallet and deposit any amount of ${pool.symbol} into the Aave V3 lending pool.`,
    },
    {
      number: 2,
      title: `Receive a${pool.symbol} Tokens`,
      description: `You'll receive a${pool.symbol} (Aave interest-bearing ${pool.symbol}) as a receipt. These tokens automatically increase in value as interest accrues.`,
    },
    {
      number: 3,
      title: 'Earn Interest Automatically',
      description: `Interest compounds in real-time. Your a${pool.symbol} balance grows without any action needed.`,
    },
    {
      number: 4,
      title: 'Withdraw Anytime',
      description: `Redeem your a${pool.symbol} for ${pool.symbol} + earned interest anytime (subject to liquidity availability).`,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-chrome-800 mb-4">How It Works</h2>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold">
                {step.number}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-chrome-800 mb-1">{step.title}</h3>
              <p className="text-sm text-chrome-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RisksCard() {
  const risks = [
    {
      title: 'Smart Contract Risk',
      description: 'Aave V3 is audited but not risk-free. Vulnerabilities in the smart contract code could result in loss of funds.',
    },
    {
      title: 'Variable APY',
      description: 'Yields fluctuate based on supply and demand. The displayed APY is current but not guaranteed for the future.',
    },
    {
      title: 'Liquidation Risk',
      description: 'If you use your aTokens as collateral for borrowing, your position could be liquidated if your health factor drops.',
    },
    {
      title: 'Withdrawal Liquidity',
      description: 'In rare cases of extreme demand, pool liquidity may be low, temporarily limiting withdrawals until borrowers repay.',
    },
  ];

  return (
    <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-amber-900">Important Risks to Understand</h2>
      </div>

      <div className="space-y-4">
        {risks.map((risk) => (
          <div key={risk.title}>
            <h3 className="font-semibold text-amber-900 mb-1">{risk.title}</h3>
            <p className="text-sm text-amber-800">{risk.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExternalResourcesSection({ pool }: { pool: YieldPool }) {
  const resources = [
    {
      title: 'Aave V3 Documentation',
      url: 'https://docs.aave.com/faq/',
      description: 'Official protocol documentation and FAQ',
    },
    {
      title: 'View Pool on DeFi Llama',
      url: `https://defillama.com/yields/pool/${pool.id}`,
      description: 'Historical APY charts and analytics',
    },
    {
      title: 'Open in Aave App',
      url: `https://app.aave.com/reserve-overview/?underlyingAsset=${pool.tokenAddress}&marketName=proto_mainnet_v3`,
      description: 'Deposit interface (Phase 2)',
    },
    {
      title: 'Aave V3 Audit Reports',
      url: 'https://docs.aave.com/developers/deployed-contracts/security-and-audits',
      description: 'Security audits and reports',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-chrome-800 mb-4">Learn More About Aave V3</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <a
            key={resource.title}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-chrome-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-all group"
          >
            <div className="flex-1">
              <div className="font-semibold text-chrome-800 group-hover:text-gold-600 flex items-center gap-2">
                {resource.title}
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-chrome-500 mt-1">{resource.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    {
      question: 'What is Aave V3?',
      answer: 'Aave V3 is a decentralized lending protocol that allows users to lend and borrow cryptocurrencies. It\'s the third version of the Aave protocol, featuring improved capital efficiency, risk management, and cross-chain functionality.',
    },
    {
      question: 'What are aTokens?',
      answer: 'aTokens are interest-bearing tokens you receive when depositing assets into Aave. For example, when you deposit USDC, you receive aUSDC. These tokens automatically accrue interest in real-time and can be redeemed 1:1 for your underlying asset plus earned interest.',
    },
    {
      question: 'How often does APY change?',
      answer: 'APY changes continuously based on supply and demand dynamics in the lending pool. When more users borrow, APY for lenders increases. When borrowing decreases, APY for lenders decreases. Changes can happen block-by-block on Ethereum.',
    },
    {
      question: 'Is my deposit safe?',
      answer: 'While Aave V3 has been audited by multiple security firms and is one of the most battle-tested DeFi protocols, all smart contracts carry inherent risk. Only deposit what you can afford to lose, and always do your own research.',
    },
    {
      question: 'Can I withdraw anytime?',
      answer: 'Yes, you can withdraw your deposits anytime, subject to available liquidity in the pool. In extreme cases where utilization is very high (most funds are borrowed), you may need to wait for borrowers to repay before withdrawing.',
    },
    {
      question: 'What fees are involved?',
      answer: 'Aave does not charge deposit or withdrawal fees. However, you will pay Ethereum gas fees for transactions. The protocol does take a small percentage of interest earned, which is already reflected in the displayed APY.',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-chrome-800 mb-4">Frequently Asked Questions</h2>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-semibold text-chrome-800 mb-2">{faq.question}</h3>
            <p className="text-sm text-chrome-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaSection() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gold-50 to-chrome-50 rounded-lg shadow-sm border border-chrome-200 p-8 text-center">
      <h2 className="text-2xl font-bold text-chrome-800 mb-2">Ready to start earning?</h2>
      <p className="text-chrome-600 mb-6">Deposit feature coming soon in Phase 2</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          disabled
          className="px-6 py-3 bg-chrome-200 text-chrome-400 rounded-md font-medium cursor-not-allowed"
        >
          Connect Wallet & Deposit (Coming Soon)
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white border border-chrome-300 text-chrome-700 rounded-md font-medium hover:bg-chrome-50 transition-colors"
        >
          Back to Overview
        </button>
      </div>
    </div>
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
