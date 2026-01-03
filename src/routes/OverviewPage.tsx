import { PageContainer } from '../components/layout';
import {
  ChainBreakdownChart,
  GlobalKpiCard,
  MarketCapChart,
  MarketSharePieChart,
  TopHeadlinesList,
  WeeklyBriefingCard,
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

      {/* Global KPIs */}
      <section className="mb-8">
        <GlobalKpiCard />
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

      {/* News and Briefing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeeklyBriefingCard />
        <TopHeadlinesList />
      </div>
    </PageContainer>
  );
}
