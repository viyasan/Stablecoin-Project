export type RegulationStage = 'proposed' | 'approved' | 'implemented';

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
    summary: 'Placeholder: Canadian stablecoin regulatory approach.',
    keyPoints: [
      'Placeholder: CSA guidance on crypto assets',
      'Placeholder: Provincial securities regulation',
      'Placeholder: Bank of Canada CBDC exploration',
    ],
    lastUpdated: '2025-01',
    regulatorName: 'Canadian Securities Administrators (CSA) & Office of the Superintendent of Financial Institutions (OSFI)',
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
