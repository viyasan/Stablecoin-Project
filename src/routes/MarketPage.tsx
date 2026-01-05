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

// KPI Icons
function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function KpiCard({ icon, value, label }: KpiCardProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
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
      <div className="mb-10">
        {/* Canadian Market Badge */}
        <div className="flex items-center gap-2 mb-4">
          <MapleLeafIcon className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Canadian Market
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Oh Canada
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The Canadian Stablecoin Landscape — Regulation, Innovation, and Adoption
        </p>

        {/* KPI Cards */}
        <div className="flex flex-wrap gap-4">
          <KpiCard
            icon={<TrendUpIcon className="w-5 h-5" />}
            value="$150M+"
            label="Total Market Cap"
          />
          <KpiCard
            icon={<BuildingIcon className="w-5 h-5" />}
            value="3"
            label="Regulated Issuers"
          />
          <KpiCard
            icon={<ShieldCheckIcon className="w-5 h-5" />}
            value="100%"
            label="Fully Backed"
          />
        </div>
      </div>

      {/* Company Profile Cards */}
      <section className="mb-10">
        <div className="mb-6">
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Canadian Stablecoin Issuers
          </h2>
          <p className="text-gray-500 mt-1">
            Explore the companies building Canada's regulated stablecoin ecosystem
          </p>
        </div>
        <CompanyProfileCards stablecoins={stablecoins} />
      </section>

      {/* Comparison Table */}
      <section className="mb-10">
        <ComparisonTable stablecoins={stablecoins} />
      </section>

      {/* Regulatory Status Tracker */}
      <section className="mb-10">
        <RegulatoryStatusTracker stablecoins={stablecoins} />
      </section>

      {/* Company Timelines */}
      <section>
        <CompanyTimelines stablecoins={stablecoins} />
      </section>
    </PageContainer>
  );
}
