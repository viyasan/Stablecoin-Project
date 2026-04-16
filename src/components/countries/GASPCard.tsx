import {
  Scale,
  Vault,
  ShieldCheck,
  ArrowLeftRight,
  BadgeCheck,
  FileSearch,
  UserCheck,
  FileText,
  Shield,
  type LucideIcon,
} from 'lucide-react';

interface GASPPrinciple {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  jurisdictionCount: number;
  totalJurisdictions: number;
  variationNote: string;
}

const GASP_PRINCIPLES: GASPPrinciple[] = [
  {
    id: 'reserve-backing',
    name: 'Reserve Backing',
    icon: Vault,
    description: 'All jurisdictions require 100% or 1:1 reserve backing for fiat-referenced stablecoins.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'Eligible assets vary — some allow only cash and T-bills, others permit insured deposits and money market funds.',
  },
  {
    id: 'segregation',
    name: 'Segregation of Assets',
    icon: ShieldCheck,
    description: 'Reserve assets must be held in bankruptcy-remote, segregated accounts separate from issuer funds.',
    jurisdictionCount: 9,
    totalJurisdictions: 10,
    variationNote: 'Japan uses a bank deposit/trust model rather than traditional asset segregation.',
  },
  {
    id: 'redemption',
    name: 'Redemption Rights',
    icon: ArrowLeftRight,
    description: 'Holders have a guaranteed right to redeem stablecoins at par value in fiat currency.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'Timelines range from 1 business day (US, HK, UAE) to 5 business days (Singapore).',
  },
  {
    id: 'licensing',
    name: 'Licensing & Authorization',
    icon: BadgeCheck,
    description: 'All jurisdictions require issuers to obtain a license or authorization from a financial authority.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'License type varies: federal charter (US), e-money license (EU), payment institution (CH), banking license (JP).',
  },
  {
    id: 'audit',
    name: 'Audit & Attestation',
    icon: FileSearch,
    description: 'Independent verification of reserve holdings is required in all jurisdictions.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'Frequency varies: daily (UAE), monthly (US, SG, CA), annual (EU, UK, JP, CH, HK).',
  },
  {
    id: 'aml-kyc',
    name: 'AML/KYC Compliance',
    icon: UserCheck,
    description: 'Universal requirement for anti-money laundering and know-your-customer programs aligned with FATF standards.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'All jurisdictions implement FATF Travel Rule; enforcement mechanisms and thresholds differ.',
  },
  {
    id: 'disclosure',
    name: 'Disclosure & Transparency',
    icon: FileText,
    description: 'Issuers must publish whitepapers, reserve composition reports, or other public disclosures.',
    jurisdictionCount: 10,
    totalJurisdictions: 10,
    variationNote: 'EU and CH require formal whitepapers; US requires CEO/CFO-certified monthly reports.',
  },
  {
    id: 'yield-ban',
    name: 'Yield & Interest Ban',
    icon: Shield,
    description: 'Issuers are prohibited from paying interest or sharing reserve yield with holders, keeping stablecoins legally distinct from securities and deposits.',
    jurisdictionCount: 5,
    totalJurisdictions: 10,
    variationNote: 'US (GENIUS Act), EU (MiCA), UK, CA (Bill C-15), and HK explicitly ban yield. SG, JP, CH, UAE, and AU have no explicit prohibition. Critics argue the ban subsidizes issuers who earn billions on T-bill reserves; proponents say it prevents shadow banking.',
  },
  {
    id: 'holding-limits',
    name: 'Holding Limits & Caps',
    icon: Shield,
    description: 'Caps on how much an individual or business can hold in stablecoins, reducing concentration risk and systemic exposure.',
    jurisdictionCount: 1,
    totalJurisdictions: 10,
    variationNote: 'Only the UK imposes explicit limits: £20,000 per individual, £10M per business (with exemptions). Other jurisdictions rely on issuer capital buffers and reserve requirements instead.',
  },
  {
    id: 'deposit-insurance',
    name: 'Deposit Insurance & Capital Buffers',
    icon: Shield,
    description: 'Backstops that protect holders if an issuer fails, including deposit insurance for bank-issued stablecoins and minimum capital requirements.',
    jurisdictionCount: 8,
    totalJurisdictions: 10,
    variationNote: 'JP offers deposit insurance up to ¥10M for bank-issued stablecoins. US requires $5M capital floor (OCC NPRM). HK requires HK$25M paid-up capital. UAE requires AED 10M. SG and CH have lighter requirements.',
  },
];

function JurisdictionBadge({ count, total }: { count: number; total: number }) {
  const isAll = count === total;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
        isAll
          ? 'bg-green-100 text-green-800'
          : 'bg-amber-100 text-amber-800'
      }`}
    >
      {count}/{total}
    </span>
  );
}

function PrincipleItem({ principle }: { principle: GASPPrinciple }) {
  const Icon = principle.icon;
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-chrome-50 transition-colors">
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex items-center justify-center">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-semibold text-chrome-900">{principle.name}</span>
          <JurisdictionBadge count={principle.jurisdictionCount} total={principle.totalJurisdictions} />
        </div>
        <p className="text-sm sm:text-base text-chrome-600 mt-1">{principle.description}</p>
        <p className="text-xs sm:text-sm text-chrome-400 italic mt-1.5">{principle.variationNote}</p>
      </div>
    </div>
  );
}

interface GASPCardProps {
  className?: string;
}

export function GASPCard({ className = '' }: GASPCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-chrome-200 ${className}`}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-chrome-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-chrome-900">
                Generally Accepted Stablecoin Principles
              </h2>
            </div>
            <p className="text-sm sm:text-base text-chrome-500 mt-1">
              Common regulatory themes synthesized across all tracked jurisdictions
            </p>
          </div>
          <span className="text-xs sm:text-sm text-chrome-400 text-center sm:text-right sm:whitespace-nowrap">Last updated: April 2026</span>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 bg-amber-50 rounded-lg">
        <p className="text-sm sm:text-base font-medium text-amber-800 text-center sm:text-left">
          10 principles identified across 10 jurisdictions — reflecting global convergence in stablecoin regulation
        </p>
      </div>

      {/* Principles grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        {GASP_PRINCIPLES.map((principle) => (
          <PrincipleItem key={principle.id} principle={principle} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <p className="text-sm text-chrome-400">
          These principles are editorially synthesized from the regulatory frameworks of 10 jurisdictions tracked on this page. They do not constitute legal advice. Individual jurisdictions may implement these principles differently.
        </p>
      </div>
    </div>
  );
}
