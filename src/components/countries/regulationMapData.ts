export type RegulationStage = 'proposed' | 'approved' | 'implemented';

export interface RegulatoryBody {
  name: string;
  role: string;
}

export interface ReserveRequirement {
  requirement: string;
  details: string;
}

export interface StablecoinIssuer {
  company: string;
  stablecoin: string;
  status: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface LegislativeDevelopment {
  title: string;
  points: string[];
}

export interface RegulationCountry {
  id: string;
  name: string;
  // ISO 3166-1 alpha-2 codes, or custom for EU
  isoCodes: string[];
  stage: RegulationStage;
  summary: string;
  keyPoints: string[];
  lastUpdated: string;
  regulatorName: string;
  // Extended fields for detailed country data
  regulatoryBodies?: RegulatoryBody[];
  legislativeDevelopments?: LegislativeDevelopment[];
  reserveRequirements?: ReserveRequirement[];
  issuerObligations?: string[];
  exemptions?: string[];
  cbdcStatus?: string[];
  stablecoinIssuers?: StablecoinIssuer[];
  timeline?: TimelineEvent[];
}

// Top 10 jurisdictions for stablecoin regulation
export const REGULATION_COUNTRIES: RegulationCountry[] = [
  {
    id: 'us',
    name: 'United States',
    isoCodes: ['US'],
    stage: 'proposed',
    summary: 'Placeholder: US stablecoin regulatory framework overview.',
    keyPoints: [
      'Placeholder: SEC and CFTC jurisdiction considerations',
      'Placeholder: State-level money transmitter licenses',
      'Placeholder: Federal stablecoin legislation pending',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Securities and Exchange Commission (SEC), Commodity Futures Trading Commission (CFTC) & Office of the Comptroller of the Currency (OCC)',
  },
  {
    id: 'eu',
    name: 'European Union',
    isoCodes: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ],
    stage: 'implemented',
    summary: 'Placeholder: MiCA regulation framework overview.',
    keyPoints: [
      'Placeholder: Markets in Crypto-Assets (MiCA) regulation',
      'Placeholder: E-money token requirements',
      'Placeholder: Reserve and disclosure requirements',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'European Banking Authority (EBA)',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    isoCodes: ['GB'],
    stage: 'approved',
    summary: 'Placeholder: UK stablecoin regulatory approach.',
    keyPoints: [
      'Placeholder: FCA oversight framework',
      'Placeholder: Payment stablecoin regulations',
      'Placeholder: Consumer protection measures',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Financial Conduct Authority (FCA)',
  },
  {
    id: 'sg',
    name: 'Singapore',
    isoCodes: ['SG'],
    stage: 'implemented',
    summary: 'Placeholder: Singapore stablecoin framework.',
    keyPoints: [
      'Placeholder: MAS regulatory framework',
      'Placeholder: Single-currency stablecoin rules',
      'Placeholder: Reserve backing requirements',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Monetary Authority of Singapore (MAS)',
  },
  {
    id: 'jp',
    name: 'Japan',
    isoCodes: ['JP'],
    stage: 'implemented',
    summary: 'Placeholder: Japan stablecoin regulatory status.',
    keyPoints: [
      'Placeholder: Revised Payment Services Act',
      'Placeholder: Bank and trust company issuance',
      'Placeholder: Full reserve requirements',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Financial Services Agency (FSA)',
  },
  {
    id: 'ca',
    name: 'Canada',
    isoCodes: ['CA'],
    stage: 'proposed',
    summary: 'Canada introduced the Stablecoin Act (Bill C-15) in November 2025 as part of Budget 2025, establishing the first national framework for fiat-referenced stablecoins. The Bank of Canada will serve as the primary regulator, maintaining a public issuer registry and overseeing compliance. Issuers must register with the Bank of Canada, maintain 1:1 reserve backing with qualified Canadian custodians (segregated and bankruptcy-remote), and submit monthly attestations and annual audits.\n\nEligible reserve assets include CAD, Government of Canada T-bills, and insured bank deposits. Stablecoins cannot pay interest or yield, and are not considered legal tender or deposits. The Act exempts financial institutions under the Bank Act, central banks, and closed-loop stablecoins.\n\nRoyal assent is expected Spring 2026 with full implementation 12-18 months after. The retail CBDC was shelved in September 2024, shifting focus to stablecoin oversight with $10M allocated for 2026-2027. Three Canadian stablecoin issuers are active: Stablecorp (QCAD - live since November 2025), Tetra Digital Group (CADD - launching Q1 2026), and Loon (CADC - pending approval).',
    keyPoints: [
      'Stablecoin Act (Bill C-15) tabled November 2025, royal assent expected Spring 2026',
      '1:1 reserve backing required with qualified Canadian custodians',
      'Bank of Canada maintains public issuer registry and oversight',
      'Three CAD stablecoins: QCAD (live), CADD (Q1 2026), CADC (pending)',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'Bank of Canada, Canadian Securities Administrators (CSA) & Office of the Superintendent of Financial Institutions (OSFI)',
    regulatoryBodies: [
      { name: 'Bank of Canada', role: 'Primary regulator under Stablecoin Act; maintains issuer registry' },
      { name: 'Canadian Securities Administrators (CSA)', role: 'Provincial securities regulators; crypto trading platform oversight' },
      { name: 'Office of the Superintendent of Financial Institutions (OSFI)', role: 'Prudential regulator for federally regulated financial institutions' },
    ],
    legislativeDevelopments: [
      {
        title: 'Stablecoin Act (Bill C-15) - November 2025',
        points: [
          'Tabled as part of Budget Implementation Act 2025',
          'Establishes federal framework for fiat-referenced stablecoins',
          'Bank of Canada designated as primary regulator',
          'Royal assent expected Spring 2026',
        ],
      },
      {
        title: 'CSA Staff Notice 21-333 - March 2025',
        points: [
          'Updated guidance on crypto asset trading platforms',
          'Clarified stablecoin custody and disclosure requirements',
          'Enhanced investor protection measures',
        ],
      },
      {
        title: 'Budget 2025 Crypto Provisions',
        points: [
          '$10M allocated for stablecoin oversight (2026-2027)',
          'Expanded Bank of Canada digital currency research mandate',
          'Framework for regulated stablecoin issuance',
        ],
      },
    ],
    reserveRequirements: [
      { requirement: '1:1 Reserve Backing', details: 'Full backing with eligible assets at all times' },
      { requirement: 'Eligible Assets', details: 'CAD cash, Government of Canada T-bills, insured bank deposits' },
      { requirement: 'Custody', details: 'Qualified Canadian custodians; segregated and bankruptcy-remote' },
      { requirement: 'Attestation', details: 'Monthly reserve attestations required' },
      { requirement: 'Audit', details: 'Annual third-party audit of reserves' },
    ],
    issuerObligations: [
      'Register with Bank of Canada before issuing stablecoins',
      'Maintain 1:1 reserve backing with eligible Canadian assets',
      'Use qualified Canadian custodians for reserve assets',
      'Submit monthly reserve attestations',
      'Complete annual third-party reserve audits',
      'Provide clear disclosure of redemption rights',
      'Implement robust cybersecurity and operational controls',
      'Cannot pay interest or yield on stablecoins',
    ],
    exemptions: [
      'Financial institutions regulated under the Bank Act',
      'Central banks and monetary authorities',
      'Closed-loop payment systems (gift cards, loyalty points)',
      'Stablecoins with market cap below threshold (TBD in regulations)',
    ],
    cbdcStatus: [
      'Retail CBDC project shelved in September 2024',
      'Bank of Canada shifted focus to stablecoin oversight',
      'Wholesale CBDC research continues for interbank settlement',
      'Project Jasper (wholesale) remains in research phase',
      '$10M budget allocated for digital currency initiatives 2026-2027',
    ],
    stablecoinIssuers: [
      { company: 'Stablecorp', stablecoin: 'QCAD', status: 'Live (November 2025)' },
      { company: 'Tetra Digital Group', stablecoin: 'CADD', status: 'Launching Q1 2026' },
      { company: 'Loon', stablecoin: 'CADC', status: 'Pending regulatory approval' },
    ],
    timeline: [
      { date: 'September 2024', event: 'Bank of Canada shelves retail CBDC project' },
      { date: 'March 2025', event: 'CSA Staff Notice 21-333 updated guidance issued' },
      { date: 'November 2025', event: 'Stablecoin Act (Bill C-15) tabled in Parliament' },
      { date: 'November 2025', event: 'QCAD launches as first regulated CAD stablecoin' },
      { date: 'Spring 2026', event: 'Royal assent expected for Stablecoin Act' },
      { date: 'Q1 2026', event: 'CADD (Tetra Digital Group) planned launch' },
      { date: '2026-2027', event: 'Full implementation of Stablecoin Act framework' },
    ],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    isoCodes: ['AE'],
    stage: 'approved',
    summary: 'Placeholder: UAE virtual assets regulatory framework.',
    keyPoints: [
      'Placeholder: VARA licensing regime',
      'Placeholder: Dubai and Abu Dhabi frameworks',
      'Placeholder: Dirham-backed stablecoin initiatives',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Virtual Assets Regulatory Authority (VARA) & Financial Services Regulatory Authority (FSRA)',
  },
  {
    id: 'hk',
    name: 'Hong Kong',
    isoCodes: ['HK'],
    stage: 'approved',
    summary: 'Placeholder: Hong Kong stablecoin licensing framework.',
    keyPoints: [
      'Placeholder: HKMA stablecoin issuer licensing',
      'Placeholder: Fiat-referenced stablecoin rules',
      'Placeholder: Reserve and redemption requirements',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Hong Kong Monetary Authority (HKMA)',
  },
  {
    id: 'ch',
    name: 'Switzerland',
    isoCodes: ['CH'],
    stage: 'implemented',
    summary: 'Placeholder: Swiss DLT and stablecoin framework.',
    keyPoints: [
      'Placeholder: FINMA token classification',
      'Placeholder: DLT Act provisions',
      'Placeholder: Banking license requirements',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Swiss Financial Market Supervisory Authority (FINMA)',
  },
  {
    id: 'au',
    name: 'Australia',
    isoCodes: ['AU'],
    stage: 'proposed',
    summary: 'Placeholder: Australian stablecoin consultation.',
    keyPoints: [
      'Placeholder: Treasury consultation process',
      'Placeholder: Payment stablecoin proposals',
      'Placeholder: ASIC regulatory guidance',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Australian Treasury & Australian Securities and Investments Commission (ASIC)',
  },
];

// All ISO codes that should be highlighted (not grayed out)
export const HIGHLIGHTED_ISO_CODES = new Set(
  REGULATION_COUNTRIES.flatMap((c) => c.isoCodes)
);

// Map ISO code to country data
export const ISO_TO_COUNTRY: Record<string, RegulationCountry> = {};
REGULATION_COUNTRIES.forEach((country) => {
  // Map by country ID
  ISO_TO_COUNTRY[country.id] = country;
  // Also map by ISO codes
  country.isoCodes.forEach((iso) => {
    ISO_TO_COUNTRY[iso] = country;
  });
});

export const STAGE_LABELS: Record<RegulationStage, string> = {
  proposed: 'Proposed',
  approved: 'Approved',
  implemented: 'Implemented',
};

export const STAGE_COLORS: Record<RegulationStage, string> = {
  proposed: '#f59e0b',
  approved: '#3b82f6',
  implemented: '#22c55e',
};
