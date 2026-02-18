import { useEffect } from 'react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { prefetchNews } from '../api';
import {
  AboutOurData,
  ChainBreakdownChart,
  GlobalKpiCard,
  MarketCapChart,
  MarketSharePieChart,
  QuickInsightsCarousel,
  ReserveCompositionCard,
  TopHeadlinesList,
  TransactionKpiCard,
  TreasuryHoldingsCard,
} from '../components/overview';

export function OverviewPage() {
  // Kick off news fetch immediately on page mount so it's ready by the time
  // the user scrolls down to the headlines section
  useEffect(() => {
    prefetchNews();
  }, []);

  return (
    <PageContainer>
      {/* Hero Section */}
      <FadeInSlide>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-chrome-800 mb-2">
            Stablecoin Market Overview
          </h1>
          <p className="text-lg text-chrome-500">
            Your single destination for stablecoin market data, regulation
            tracking, and insights.
          </p>
        </div>
      </FadeInSlide>

      {/* KPI Cards - Side by side */}
      {/* GlobalKpiCard manages its own FadeInSlide (delay=0) */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlobalKpiCard />
          <FadeInSlide delay={100}>
            <TransactionKpiCard />
          </FadeInSlide>
        </div>
      </section>

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

      {/* Top Headlines Section */}
      <section className="mb-8">
        <FadeInSlide delay={0}>
          <TopHeadlinesList />
        </FadeInSlide>
      </section>

      {/* Quick Market Insights Carousel */}
      <section className="mb-8">
        <FadeInSlide delay={0}>
          <QuickInsightsCarousel />
        </FadeInSlide>
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
