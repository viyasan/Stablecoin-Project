import { PageContainer } from '../components/layout';
import { SkeletonCanadaPage } from '../components/common';
import {
  CompanyProfileCards,
  ComparisonTable,
  CompanyTimelines,
} from '../components/canada';
import { useCanadianStablecoins, useCanadianExchanges, useCanadianReserves } from '../api';
import type { CanadianStablecoin } from '../api';
import { ShieldCheck, CircleDollarSign, Building, Clock, ExternalLink } from 'lucide-react';

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

const CARD_GRADIENTS: Record<string, string> = {
  cadx: 'from-[#dc2626] to-[#b91c1c]',
  cadc: 'from-[#d92525] to-[#b61b1b]',
  qcad: 'from-[#dc2626] to-[#b91c1c]',
  tetra: 'from-[#d52424] to-[#b21a1a]',
};

interface ReserveCardProps {
  stablecoin: CanadianStablecoin;
  liveSupply: number | null;
  isLoadingSupply: boolean;
}

function ReserveCard({ stablecoin, liveSupply, isLoadingSupply }: ReserveCardProps) {
  const meta = stablecoin.reserveMetadata;
  const gradient = CARD_GRADIENTS[stablecoin.id] ?? 'from-[#dc2626] to-[#b91c1c]';
  const logoSrc = meta.tokenLogo ?? stablecoin.logo;

  const supplyDisplay = (() => {
    if (meta.supplyNote) return null;
    if (isLoadingSupply) return 'loading';
    if (liveSupply !== null) return liveSupply.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return null;
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-3 flex items-center gap-3`}>
        {logoSrc && (
          <img
            src={logoSrc}
            alt={`${stablecoin.symbol} logo`}
            className="w-10 h-10 rounded-lg bg-white p-1.5 object-contain flex-shrink-0"
          />
        )}
        <div>
          <h3 className="text-lg font-bold text-white">{stablecoin.symbol}</h3>
          <p className="text-white text-sm opacity-90">{stablecoin.issuer}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {/* Outstanding Supply */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-chrome-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CircleDollarSign className="w-5 h-5 text-chrome-600" />
          </div>
          <div>
            <h4 className="font-semibold text-chrome-800 text-sm mb-0.5">Outstanding Supply</h4>
            {meta.supplyNote ? (
              <p className="text-xs text-chrome-500">{meta.supplyNote}</p>
            ) : supplyDisplay === 'loading' ? (
              <div className="h-3.5 w-24 bg-chrome-100 rounded animate-pulse mt-1" />
            ) : supplyDisplay ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-chrome-900">{supplyDisplay} {stablecoin.symbol}</span>
                <span className="flex items-center gap-1 text-[10px] text-status-positive font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-positive" />
                  Live
                </span>
                {meta.chainLabel && (
                  <span className="text-[10px] text-chrome-400">({meta.chainLabel})</span>
                )}
              </div>
            ) : (
              <p className="text-xs text-chrome-400">Data unavailable</p>
            )}
          </div>
        </div>

        {/* Reserve Ratio */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-chrome-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-chrome-600" />
          </div>
          <div>
            <h4 className="font-semibold text-chrome-800 text-sm mb-0.5">Reserve Ratio</h4>
            <p className="text-xs text-chrome-500">{meta.reserveRatio}</p>
          </div>
        </div>

        {/* Custodian */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-chrome-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Building className="w-5 h-5 text-chrome-600" />
          </div>
          <div>
            <h4 className="font-semibold text-chrome-800 text-sm mb-0.5">Custodian</h4>
            <p className="text-xs text-chrome-500">{meta.custodian}</p>
          </div>
        </div>

        {/* Last Attested */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-chrome-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-chrome-600" />
          </div>
          <div>
            <h4 className="font-semibold text-chrome-800 text-sm mb-0.5">Last Attested</h4>
            <p className="text-xs text-chrome-500">{meta.lastAttested} · {meta.attestationFrequency}</p>
            {meta.attestationUrl && (
              <a
                href={meta.attestationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-chrome-600 hover:text-chrome-800 mt-1"
              >
                View Reports <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CanadaPage() {
  const { data: stablecoins, isLoading } = useCanadianStablecoins();
  const { data: exchanges } = useCanadianExchanges();
  const { data: reserveSupply, isLoading: isLoadingSupply } = useCanadianReserves();

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonCanadaPage />
      </PageContainer>
    );
  }

  if (!stablecoins) {
    return (
      <PageContainer>
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
          <p className="text-chrome-500 text-center">Failed to load data</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-chrome-800">Canada</h1>
          <MapleLeafIcon className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-lg text-chrome-500">
          The Canadian Stablecoin Issuer Landscape
        </p>
      </div>

      {/* Company Profile Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-chrome-800 mb-4">
          Leading Canadian Stablecoin Issuers
        </h2>
        <CompanyProfileCards stablecoins={stablecoins} />
      </section>

      {/* Reserve & Transparency */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-chrome-800 mb-4">
          Reserve & Transparency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stablecoins.map((stablecoin) => (
            <ReserveCard
              key={stablecoin.id}
              stablecoin={stablecoin}
              liveSupply={
                stablecoin.id === 'cadc' ? reserveSupply?.cadc ?? null
                : stablecoin.id === 'qcad' ? reserveSupply?.qcad ?? null
                : null
              }
              isLoadingSupply={isLoadingSupply}
            />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <ComparisonTable stablecoins={stablecoins} exchanges={exchanges || []} />
      </section>

      {/* Company Timelines */}
      <section>
        <CompanyTimelines stablecoins={stablecoins} />
      </section>
    </PageContainer>
  );
}
