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

export function CanadaPage() {
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
          The Canadian Stablecoin Landscape: Issuer Progress
        </p>
      </div>

      {/* Company Profile Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Canadian Stablecoin Issuers
        </h2>
        <CompanyProfileCards stablecoins={stablecoins} />
      </section>

      {/* Reserve & Transparency */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reserve & Transparency
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QCAD Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 flex items-center gap-3">
              <img
                src={stablecoins[0].logo}
                alt="Stablecorp logo"
                className="w-10 h-10 rounded-lg bg-white p-1.5 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-white">QCAD</h3>
                <p className="text-green-100 text-sm">Stablecorp</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">QCAD Digital Trust</h4>
                  <p className="text-xs text-gray-600">Ontario trust structure with independent trustee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">1:1 CAD Backed</h4>
                  <p className="text-xs text-gray-600">Reserves held at regulated financial institutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Daily Transparency</h4>
                  <p className="text-xs text-gray-600">Daily reports & monthly attestations on SEDAR+</p>
                </div>
              </div>
            </div>
          </div>

          {/* CADD Card (Tetra) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 flex items-center gap-3">
              <img
                src={stablecoins[1].logo}
                alt="Tetra Digital Group logo"
                className="w-10 h-10 rounded-lg bg-white p-1.5 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-white">CADD</h3>
                <p className="text-amber-100 text-sm">CAD Digital (Tetra)</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Bank-to-Bank Tested</h4>
                  <p className="text-xs text-gray-600">First CAD stablecoin transferred between financial institutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Institutional Grade</h4>
                  <p className="text-xs text-gray-600">Issued by licensed trust company</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Q1 2026 Launch</h4>
                  <p className="text-xs text-gray-600">Pending regulatory approval</p>
                </div>
              </div>
            </div>
          </div>

          {/* CADC Card (Loon) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xs">LOON</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CADC</h3>
                <p className="text-sky-100 text-sm">Loon</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">101% Over-Collateralized</h4>
                  <p className="text-xs text-gray-600">Monthly reserve verification</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">3-Second Settlement</h4>
                  <p className="text-xs text-gray-600">$200M+ volume on Base network</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Live</h4>
                  <p className="text-xs text-gray-600">Operational since 2021, acquired by Loon Oct 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
