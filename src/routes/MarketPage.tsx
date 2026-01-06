import { PageContainer } from '../components/layout';
import { Spinner } from '../components/common';
import {
  CompanyProfileCards,
  ComparisonTable,
  RegulatoryStatusTracker,
  CompanyTimelines,
} from '../components/canada';
import { useCanadianStablecoins } from '../api';

// Maple Leaf icon for the header
function MapleLeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.9-7.4-11.5-5-17.4 2.4-7.6 20.1-67.3 20.1-67.3s-47.7 10-57.7 12.5c-7.5 2.4-10-2.5-12.5-7.5s-15-32.4-15-32.4-52.6 59.9-55.1 62.3c-10 7.5-20.1 0-17.6-10 0-10 27.6-129.6 27.6-129.6s-30.1 17.4-40.1 22.4c-7.5 5-12.6 5-17.6-5C293.5 72.3 255.9 0 255.9 0s-37.5 72.3-42.5 79.8c-5 10-10 10-17.6 5-10-5-40.1-22.4-40.1-22.4S183.3 182 183.3 192c2.5 10-7.5 17.5-17.6 10-2.5-2.5-55.1-62.3-55.1-62.3S98.1 167 95.6 172s-5 9.9-12.5 7.5C73 177 25.4 167 25.4 167s17.6 59.7 20.1 67.3c2.4 6 5 12.5-5 17.4L23 259.3s102.6 89.9 105.2 92.4c5.1 5 10 7.5 5.1 22.5-5.1 15-10.1 35.1-10.1 35.1s95.2-20.1 105.3-22.6c8.7-.9 18.3 2.5 18.3 12.5S241 512 241 512h30s-5.8-102.7-5.8-112.8 9.5-13.4 18.4-12.5c10 2.5 105.2 22.6 105.2 22.6s-5-20.1-10-35.1 0-17.5 5-22.5z" />
    </svg>
  );
}

export function MarketPage() {
  const { data: stablecoins, isLoading } = useCanadianStablecoins();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (!stablecoins) {
    return (
      <PageContainer>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-500 text-center">Failed to load data</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Canada</h1>
          <MapleLeafIcon className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-lg text-gray-600">
          The Canadian Stablecoin Landscape — Regulation, Innovation, and Adoption
        </p>
      </div>

      {/* Company Profile Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Canadian Stablecoin Issuers
        </h2>
        <CompanyProfileCards stablecoins={stablecoins} />
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <ComparisonTable stablecoins={stablecoins} />
      </section>

      {/* Regulatory Status Tracker */}
      <section className="mb-8">
        <RegulatoryStatusTracker stablecoins={stablecoins} />
      </section>

      {/* Company Timelines */}
      <section>
        <CompanyTimelines stablecoins={stablecoins} />
      </section>
    </PageContainer>
  );
}
