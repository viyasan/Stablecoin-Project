import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { BarChart3 } from 'lucide-react';
import {
  AboutOurData,
  ChainBreakdownChart,
  MarketCapChart,
  MarketSharePieChart,
  PegStabilityChart,
  ReserveCompositionCard,
  TreasuryHoldingsCard,
} from '../components/overview';

export function MarketPage() {
  return (
    <PageContainer>
      {/* Page Header */}
      <FadeInSlide>
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-gold-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-chrome-900">Market Data</h1>
          </div>
          <p className="text-chrome-500 text-base sm:text-lg">
            Stablecoin market capitalization, chain distribution, treasury holdings, and reserve composition.
          </p>
        </div>
      </FadeInSlide>

      {/* Charts Section - Market Cap and Pie Chart side by side */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8">
          <FadeInSlide delay={0}>
            <MarketCapChart showBreakdown={false} />
          </FadeInSlide>
          <FadeInSlide delay={150}>
            <MarketSharePieChart />
          </FadeInSlide>
        </div>
      </section>

      {/* Peg Stability Section */}
      <section className="mb-8">
        <FadeInSlide>
          <PegStabilityChart />
        </FadeInSlide>
      </section>

      {/* Chain Breakdown Section */}
      <section className="mb-8">
        <FadeInSlide delay={0}>
          <ChainBreakdownChart />
        </FadeInSlide>
      </section>

      {/* Treasury & Reserve Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeInSlide delay={0}>
            <TreasuryHoldingsCard />
          </FadeInSlide>
          <FadeInSlide delay={150}>
            <ReserveCompositionCard />
          </FadeInSlide>
        </div>
      </section>

      {/* About Our Data - Methodology Explainer */}
      <section>
        <FadeInSlide delay={0}>
          <AboutOurData />
        </FadeInSlide>
      </section>
    </PageContainer>
  );
}
