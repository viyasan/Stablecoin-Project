import { PageContainer } from '../components/layout';
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
  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stablecoin Market Overview
        </h1>
        <p className="text-lg text-gray-600">
          Your single destination for stablecoin market data, regulation
          tracking, and insights.
        </p>
      </div>

      {/* KPI Cards - Side by side */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlobalKpiCard />
          <TransactionKpiCard />
        </div>
      </section>

      {/* Charts Section - Market Cap and Pie Chart side by side */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <MarketCapChart showBreakdown={false} />
          </div>
          <div className="lg:col-span-2">
            <MarketSharePieChart />
          </div>
        </div>
      </section>

      {/* Chain Breakdown Section */}
      <section className="mb-8">
        <ChainBreakdownChart />
      </section>

      {/* Treasury & Reserve Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreasuryHoldingsCard />
          <ReserveCompositionCard />
        </div>
      </section>

      {/* Top Headlines Section */}
      <section className="mb-8">
        <TopHeadlinesList />
      </section>

      {/* Quick Market Insights Carousel */}
      <section className="mb-8">
        <QuickInsightsCarousel />
      </section>

      {/* About Our Data - Methodology Explainer */}
      <section>
        <AboutOurData />
      </section>
    </PageContainer>
  );
}
