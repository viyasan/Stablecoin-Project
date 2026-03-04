import { useEffect } from 'react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { prefetchNews } from '../api';
import {
  AboutOurData,
  ChainBreakdownChart,
  HeroSection,
  MarketCapChart,
  MarketSharePieChart,
  QuickInsightsCarousel,
  ReserveCompositionCard,
  TopHeadlinesList,
  TreasuryHoldingsCard,
  EmailOptInCard,
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
        <HeroSection />
      </FadeInSlide>

      {/* Email Opt-In Card */}
      <section className="mb-8">
        <FadeInSlide delay={200}>
          <EmailOptInCard />
        </FadeInSlide>
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
