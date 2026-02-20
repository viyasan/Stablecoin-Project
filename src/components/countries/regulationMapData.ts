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

export interface OfficialSource {
  name: string;
  url: string;
  date?: string;
  type: 'legislation' | 'guidance' | 'regulator' | 'news';
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
  lastVerified: string; // NEW - YYYY-MM-DD format
  regulatorName: string;
  sources?: OfficialSource[]; // NEW - Citation links
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
    stage: 'implemented',
    summary: 'The United States enacted the GENIUS Act (Guiding and Establishing National Innovation for US Stablecoins Act) on July 18, 2025, establishing the first comprehensive federal regulatory framework for payment stablecoins. The legislation passed with strong bipartisan support (68-30 in the Senate, 308-122 in the House).\n\nThe GENIUS Act clarifies that payment stablecoins are neither securities nor commodities, removing SEC and CFTC oversight. Instead, bank issuers are regulated by their primary federal banking regulator, while nonbank issuers are overseen by the OCC. Issuers must maintain 100% reserve backing with highly liquid assets, publish monthly reserve compositions, and honor redemptions at par within one day. Federal agencies must finalize implementing regulations by July 18, 2026, with full compliance required by January 18, 2027 (or 120 days after regulations issued). Existing issuers have until July 18, 2028 to comply.',
    keyPoints: [
      'GENIUS Act signed into law July 18, 2025; regulations due July 2026, effective January 2027',
      'OCC granted conditional federal charters to Circle, Ripple, Paxos, BitGo, Fidelity (December 2025)',
      '100% reserve backing required with liquid assets (USD, T-bills, government money market funds)',
      'Payment stablecoins explicitly excluded from SEC and CFTC securities/commodities jurisdiction',
      'SEC April 2025 guidance exempts "Covered Stablecoins" from securities registration',
      'CBDC development effectively halted via Executive Order and Congressional opposition',
    ],
    lastUpdated: '2025-07',
    lastVerified: '2026-02-20',
    regulatorName: 'Office of the Comptroller of the Currency (OCC), Federal Reserve, FDIC & State Regulators',
    sources: [
      {
        name: 'S.1582 - GENIUS Act (Full Text)',
        url: 'https://www.congress.gov/bill/119th-congress/senate-bill/1582',
        date: '2025-07-18',
        type: 'legislation',
      },
      {
        name: 'White House - GENIUS Act Signing Fact Sheet',
        url: 'https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law/',
        date: '2025-07-18',
        type: 'regulator',
      },
      {
        name: 'Federal Register - GENIUS Act Implementation',
        url: 'https://www.federalregister.gov/documents/2025/09/19/2025-18226/genius-act-implementation',
        date: '2025-09-19',
        type: 'guidance',
      },
      {
        name: 'SEC Statement on Stablecoins (Covered Stablecoins)',
        url: 'https://www.sec.gov/newsroom/speeches-statements/statement-stablecoins-040425',
        date: '2025-04-04',
        type: 'guidance',
      },
      {
        name: 'OCC Conditional Approval - Circle & Others',
        url: 'https://www.occ.gov/news-issuances/news-releases/2025/nr-occ-2025-125a.pdf',
        date: '2025-12-12',
        type: 'regulator',
      },
      {
        name: 'Federal Reserve - Central Bank Digital Currency',
        url: 'https://www.federalreserve.gov/central-bank-digital-currency.htm',
        type: 'regulator',
      },
      {
        name: 'FDIC - Payment Stablecoin Approval Requirements',
        url: 'https://www.fdic.gov/news/press-releases/2025/fdic-approves-proposal-establish-genius-act-application-procedures-fdic',
        date: '2025-12-19',
        type: 'guidance',
      },
    ],
    regulatoryBodies: [
      { name: 'Office of the Comptroller of the Currency (OCC)', role: 'Primary regulator for federally licensed nonbank stablecoin issuers' },
      { name: 'Federal Reserve', role: 'Oversight for Fed-member bank stablecoin issuers' },
      { name: 'FDIC', role: 'Oversight for FDIC-insured bank stablecoin issuers' },
      { name: 'State Regulators (e.g., NYDFS)', role: 'State-level licensing for nonbank issuers under $10B market cap' },
    ],
    legislativeDevelopments: [
      {
        title: 'GENIUS Act - July 2025',
        points: [
          'First comprehensive federal stablecoin legislation in the US',
          'Passed Senate 68-30, House 308-122 with bipartisan support',
          'Signed into law by President Trump on July 18, 2025',
          'Full implementation regulations due by July 2026, effective November 2026',
        ],
      },
    ],
    reserveRequirements: [
      { requirement: '100% Reserve Backing', details: 'At least one dollar of permitted reserves for every dollar of stablecoins issued' },
      { requirement: 'Eligible Assets', details: 'USD cash, Treasury bills, government money market funds, central bank reserves, insured bank deposits' },
      { requirement: 'Redemption', details: 'Must honor redemption requests at par in legal tender within one business day' },
      { requirement: 'No Rehypothecation', details: 'Reserve assets cannot be rehypothecated except to meet redemption requests' },
      { requirement: 'Monthly Disclosure', details: 'Monthly publication of reserve composition on issuer website, certified by CEO and CFO' },
      { requirement: 'Audit', details: 'Monthly examination by registered public accounting firm; annual audited financials for issuers over $50B' },
    ],
    issuerObligations: [
      'Obtain federal or state license before issuing payment stablecoins',
      'Maintain 100% reserve backing with permitted liquid assets',
      'Publish monthly reserve composition certified by CEO and CFO',
      'Honor redemption requests at par within one business day',
      'Implement AML and sanctions compliance programs under Bank Secrecy Act',
      'Cannot pay yield or interest to stablecoin holders',
      'Transition to federal regulation within 360 days if market cap exceeds $10 billion',
    ],
    exemptions: [
      'Payment stablecoins are not securities under federal securities laws',
      'Payment stablecoins are not commodities under the Commodity Exchange Act',
      'State-regulated option available for nonbank issuers under $10 billion market cap',
    ],
    cbdcStatus: [
      'Executive Order 14178 (2025) prohibits U.S. government from creating or promoting CBDC',
      'Federal Reserve Chair Powell committed to never issuing CBDC during tenure',
      'House passed Anti-CBDC Surveillance State Act; Senate S.464 pending',
      'CBDC development effectively halted in favor of private-sector stablecoin solutions',
      'Federal Reserve maintains pilot research programs but no active retail CBDC development',
    ],
    stablecoinIssuers: [
      { company: 'Circle', stablecoin: 'USDC', status: 'Conditional OCC national trust bank charter (Dec 2025); world\'s largest regulated stablecoin' },
      { company: 'Tether', stablecoin: 'USDT', status: 'Largest by market cap; must comply with GENIUS Act by July 2028 or cease U.S. operations' },
      { company: 'Paxos Trust Company', stablecoin: 'PYUSD / USDP', status: 'Conditional OCC approval for national trust bank conversion (Dec 2025); NYDFS-regulated' },
      { company: 'Gemini Trust Company', stablecoin: 'GUSD', status: 'NYDFS-regulated trust company; well-positioned for GENIUS Act compliance' },
      { company: 'PayPal', stablecoin: 'PYUSD', status: 'Issued by Paxos; 200% growth in H1 2025; expanding in 2026' },
      { company: 'Ripple', stablecoin: 'RLUSD', status: 'Conditional OCC national trust bank charter (Dec 2025)' },
    ],
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
    summary: 'The European Union implemented the Markets in Crypto-Assets (MiCA) Regulation, the world\'s first comprehensive crypto regulatory framework. Stablecoin provisions (for ARTs and EMTs) became effective June 30, 2024, with full CASP authorization required by December 30, 2024.\n\nMiCA distinguishes between Asset-Referenced Tokens (ARTs) backed by multiple assets and Electronic Money Tokens (EMTs) backed by a single fiat currency. Issuers must be authorized credit or electronic money institutions, maintain full reserve backing, and ensure redemption at par value. The European Banking Authority (EBA) directly supervises "significant" stablecoins that pose systemic risks. As of January 2026, 17 EMT issuers are authorized across 10 EU member states. The final CASP authorization deadline is July 1, 2026, with no grace period—operating without authorization will result in penalties up to €15 million or 12.5% of annual turnover.',
    keyPoints: [
      'MiCA fully implemented December 30, 2024; final CASP authorization deadline July 1, 2026',
      'ESMA/EC guidance (Jan 2025): Non-compliant ARTs/EMTs must cease by March 31, 2025',
      'USDT delisted from all major EU exchanges by March 2025 due to non-compliance',
      'Circle USDC/EURC first major global stablecoin to achieve full MiCA compliance',
      '17 authorized EMT issuers as of January 2026; 102 CASPs operating in EU',
      'CARF/DAC8 tax reporting became effective January 1, 2026 for crypto transactions',
    ],
    lastUpdated: '2024-12',
    lastVerified: '2026-02-20',
    regulatorName: 'European Banking Authority (EBA) & National Competent Authorities (NCAs)',
    sources: [
      {
        name: 'MiCA Regulation (EUR-Lex Official Text)',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114',
        type: 'legislation',
      },
      {
        name: 'EBA - Asset-Referenced and E-Money Tokens Page',
        url: 'https://www.eba.europa.eu/regulation-and-policy/asset-referenced-and-e-money-tokens-mica',
        type: 'regulator',
      },
      {
        name: 'ESMA - Markets in Crypto-Assets Regulation (MiCA)',
        url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica',
        type: 'regulator',
      },
      {
        name: 'ESMA/EC Guidance on Non-Compliant Stablecoins',
        url: 'https://www.esma.europa.eu/press-news/esma-news/esma-and-european-commission-publish-guidance-non-mica-compliant-arts-and-emts',
        date: '2025-01-17',
        type: 'guidance',
      },
      {
        name: 'ECB - Digital Euro Progress',
        url: 'https://www.ecb.europa.eu/euro/digital_euro/html/index.en.html',
        type: 'regulator',
      },
      {
        name: 'European Commission - Crypto-Assets Main Page',
        url: 'https://finance.ec.europa.eu/digital-finance/crypto-assets_en',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'European Banking Authority (EBA)', role: 'Direct supervision of significant ARTs and EMTs; issues binding technical standards' },
      { name: 'European Securities and Markets Authority (ESMA)', role: 'Oversight of CASPs; guidance on non-compliant stablecoins' },
      { name: 'National Competent Authorities (NCAs)', role: 'Member state-level licensing and supervision of non-significant issuers' },
    ],
    reserveRequirements: [
      { requirement: '100% Reserve Backing', details: 'Full backing of tokens with eligible reserve assets at all times' },
      { requirement: 'Redemption at Par', details: 'Holders must be able to redeem tokens at par value at any time' },
      { requirement: 'Reserve Composition (EMTs)', details: 'Must be held in same currency as the token denomination' },
      { requirement: 'Significant Issuer Reserve', details: '3% of average reserve for significant ARTs (vs. 2% for regular ARTs)' },
      { requirement: 'Custody Requirements', details: 'Reserves must be held with authorized custodians or credit institutions' },
      { requirement: 'Whitepaper Disclosure', details: 'Detailed whitepaper required with reserve composition and redemption procedures' },
    ],
    issuerObligations: [
      'Obtain authorization as credit institution or electronic money institution',
      'Publish detailed whitepaper before public offering',
      'Maintain 100% reserve backing with eligible assets',
      'Ensure redemption at par value at any time',
      'Implement adequate risk management frameworks',
      'Report to competent authorities on regular basis',
      'Enhanced requirements for "significant" stablecoins (EBA supervision)',
    ],
    exemptions: [
      'Tokens offered free of charge or as rewards',
      'Tokens usable only within limited networks',
      'Tokens with total value below €5 million over 12 months',
    ],
    cbdcStatus: [
      'ECB Governing Council advanced digital euro to next project phase (October 2025)',
      'EU co-legislators expected to adopt enabling legislation in 2026',
      'European Parliament vote scheduled for June 2026',
      'Pilot exercise and initial transactions targeted for mid-2027',
      'First potential issuance targeted for 2029 (pending regulatory approval)',
      'Implementation cost: €4-5.8 billion for banks (lower than previous estimates)',
    ],
    stablecoinIssuers: [
      { company: 'Circle', stablecoin: 'USDC / EURC', status: 'First major global stablecoin MiCA-compliant; French ACPR EMI license (July 2024)' },
      { company: 'Société Générale-Forge', stablecoin: 'EURCV', status: 'MiCA-compliant; multi-chain (Ethereum, Solana, XRP, Stellar); deployed on XRP Feb 2026' },
      { company: 'Banking Circle', stablecoin: 'EURI', status: 'First bank-backed MiCA-compliant stablecoin; operational on Ethereum and BNB Chain' },
      { company: 'Paxos', stablecoin: 'USDG', status: 'First U.S.-based issuer with full MiCA compliance; Finnish FIN-FSA regulated' },
      { company: 'Tether', stablecoin: 'USDT / EURT', status: 'Non-compliant; delisted from all major EU exchanges by March 31, 2025' },
    ],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    isoCodes: ['GB'],
    stage: 'approved',
    summary: 'The United Kingdom is developing a comprehensive regulatory framework for stablecoins through the Financial Services and Markets Act (FSMA) 2023. HM Treasury laid the Financial Services and Markets Act 2000 (Cryptoassets) Regulations 2026 (SI 2026/102) before Parliament on December 15, 2025, creating six new regulated activities including stablecoin issuance and cryptoasset custody.\n\nThe FCA published Consultation Paper CP25/14 in May 2025 (closed July 2025), proposing rules for "qualifying stablecoins" referencing a single fiat currency. The Bank of England published its consultation on systemic stablecoin regulation in November 2025 (closing February 10, 2026), establishing a dual-regulator model. The comprehensive regime comes into force October 25, 2027, with application windows opening September 30, 2026. The FCA launched a Stablecoins Regulatory Sandbox cohort (applications closed January 18, 2026) to enable testing and policy development.',
    keyPoints: [
      'Full regime comes into force October 25, 2027; application window opens September 30, 2026',
      'FCA CP25/14 consultation closed July 2025; BoE systemic stablecoin consultation closes Feb 10, 2026',
      'Dual regulation: BoE (systemic/prudential) and FCA (conduct/consumer protection)',
      'Reserve requirements: 40% BoE deposits, 60% UK government debt (standard); 95% debt allowed initially',
      'Holding limits: £20,000 for individuals, £10M for businesses (exemptions available)',
      'FCA Stablecoins Sandbox launched November 2025; testing begins Q1 2026',
    ],
    lastUpdated: '2025-12',
    lastVerified: '2026-02-20',
    regulatorName: 'Financial Conduct Authority (FCA) & Bank of England',
    sources: [
      {
        name: 'FCA CP25/14: Stablecoin Issuance and Cryptoasset Custody',
        url: 'https://www.fca.org.uk/publications/consultation-papers/cp25-14-stablecoin-issuance-cryptoasset-custody',
        date: '2025-05-28',
        type: 'guidance',
      },
      {
        name: 'Bank of England - Systemic Stablecoins Consultation',
        url: 'https://www.bankofengland.co.uk/paper/2025/cp/proposed-regulatory-regime-for-sterling-denominated-systemic-stablecoins',
        date: '2025-11-10',
        type: 'guidance',
      },
      {
        name: 'SI 2026/102 - Cryptoassets Regulations 2026',
        url: 'https://www.legislation.gov.uk/uksi/2026/102/contents/made',
        date: '2025-12-15',
        type: 'legislation',
      },
      {
        name: 'FCA - New Regime for Cryptoasset Regulation',
        url: 'https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation',
        type: 'regulator',
      },
      {
        name: 'FCA - Regulatory Sandbox: Stablecoins Cohort',
        url: 'https://www.fca.org.uk/firms/innovation/regulatory-sandbox/stablecoins-cohort',
        date: '2025-11-26',
        type: 'regulator',
      },
      {
        name: 'HM Treasury - Future Regulatory Regime for Cryptoassets',
        url: 'https://www.gov.uk/government/publications/regulatory-regime-for-cryptoassets-regulated-activities-draft-si-and-policy-note',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Financial Conduct Authority (FCA)', role: 'Authorization and supervision of stablecoin issuers; conduct and consumer protection' },
      { name: 'Bank of England', role: 'Prudential oversight and financial stability for systemic stablecoins' },
      { name: 'HM Treasury', role: 'Recognition of systemic stablecoins; overall policy framework' },
    ],
    reserveRequirements: [
      { requirement: '100% Backing', details: 'Stablecoins must be fully backed by secure, liquid assets at all times' },
      { requirement: 'Systemic Issuer Composition', details: '40% unremunerated Bank of England deposits, 60% short-term UK government debt' },
      { requirement: 'Statutory Trust', details: 'Backing assets held in statutory trust for stablecoin holders' },
      { requirement: 'Independent Custody', details: 'Assets held with third-party custodian independent of issuer group' },
      { requirement: 'Segregation', details: 'Issuers must segregate backing assets for each stablecoin product' },
    ],
    issuerObligations: [
      'Obtain FCA authorization before issuing qualifying stablecoins',
      'Maintain full backing with eligible assets at all times',
      'Hold backing assets in statutory trust with independent custodian',
      'Cannot pay interest to stablecoin holders (mirrors potential digital pound)',
      'Transition to Bank of England supervision if recognized as systemic by HM Treasury',
      'Subject to holding limits: £20,000 per individual, £10M per business',
    ],
    exemptions: [
      'Retail businesses and intermediaries may be exempted from £10M business limits',
      'Non-systemic stablecoins regulated by FCA only (not Bank of England)',
    ],
    cbdcStatus: [
      'Bank of England exploring digital pound (retail CBDC)',
      'Consultation papers published; no implementation timeline announced',
      'Stablecoin framework designed to mirror potential digital pound features (e.g., no interest payments)',
      'Focus on compatibility between private stablecoins and future digital pound',
    ],
    stablecoinIssuers: [
      { company: 'FCA Regulatory Sandbox', stablecoin: 'Various GBP stablecoins', status: 'Applications closed Jan 18, 2026; testing begins Q1 2026' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in UK; expected to seek authorization once regime operational (Oct 2027)' },
    ],
  },
  {
    id: 'sg',
    name: 'Singapore',
    isoCodes: ['SG'],
    stage: 'implemented',
    summary: 'The Monetary Authority of Singapore (MAS) finalized its Single-Currency Stablecoin (SCS) regulatory framework on August 15, 2023, with full implementation expected by mid-2026 through forthcoming legislation. The framework applies to stablecoins pegged to the Singapore Dollar or any G10 currency (USD, EUR, JPY, GBP, AUD, NZD, CAD, CHF, NOK, SEK), issued from Singapore.\n\nTo obtain the "MAS-regulated" label, issuers must maintain 100% reserves in the peg currency, publish monthly independent attestations, undergo annual audits, and redeem at par within five business days. MAS requires stablecoins to be issued solely from Singapore (no multi-jurisdictional issuance initially). In November 2025, MAS announced Project BLOOM (Borderless, Liquid, Open, Online, Multi-currency) to extend settlement capabilities using tokenized assets and well-regulated stablecoins, with Q2 2026 cross-border QR payment trials between Thailand and Singapore. MAS will also trial tokenized MAS bills settlement using wholesale CBDC in 2026.',
    keyPoints: [
      'MAS framework finalized August 15, 2023; legislation in development for mid-2026 implementation',
      'Project BLOOM launched October 2025 for multi-currency tokenized settlement (domestic & cross-border)',
      'MAS to trial tokenized bills with wholesale CBDC settlement in 2026',
      'StraitsX XSGD acknowledged as substantially compliant with SCS framework',
      '100% reserve backing required; monthly attestations, annual audits, 5-day redemption',
      'Circle USDC holds Major Payment Institution license (June 2023)',
    ],
    lastUpdated: '2025-11',
    lastVerified: '2026-02-20',
    regulatorName: 'Monetary Authority of Singapore (MAS)',
    sources: [
      {
        name: 'MAS - Stablecoin Regulatory Framework',
        url: 'https://www.mas.gov.sg/news/media-releases/2023/mas-finalises-stablecoin-regulatory-framework',
        date: '2023-08-15',
        type: 'regulator',
      },
      {
        name: 'MAS - BLOOM Initiative Launch',
        url: 'https://www.mas.gov.sg/news/media-releases/2025/mas-launches-bloom-initiative-to-extend-settlement-capabilities',
        date: '2025-10-16',
        type: 'regulator',
      },
      {
        name: 'MAS Speech - Creating the Future of Finance (Tokenized Bills)',
        url: 'https://www.mas.gov.sg/news/speeches/2025/creating-the-future-of-finance',
        date: '2025-11-13',
        type: 'regulator',
      },
      {
        name: 'MAS - BLOOM Initiative Page',
        url: 'https://www.mas.gov.sg/schemes-and-initiatives/bloom',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Monetary Authority of Singapore (MAS)', role: 'Primary regulator for stablecoins; grants "MAS-regulated" stablecoin label' },
    ],
    reserveRequirements: [
      { requirement: '100% Reserve Backing', details: 'Full backing in peg currency (cash, equivalents, or 3-month government debt)' },
      { requirement: 'Segregation', details: 'Reserve accounts must be segregated from issuer assets' },
      { requirement: 'Monthly Attestation', details: 'Independent monthly attestations must be published' },
      { requirement: 'Annual Audit', details: 'Annual audit of reserves required' },
      { requirement: 'Capital Requirements', details: 'Minimum SGD 1 million or 50% of annual operating expenses, plus liquidity buffer' },
    ],
    issuerObligations: [
      'Be based in Singapore to issue MAS-regulated stablecoins',
      'Maintain 100% reserves in peg currency at all times',
      'Publish monthly independent attestations of reserves',
      'Complete annual reserve audits',
      'Redeem at par value within five business days',
      'Restrictions on unrelated commercial business activities',
      'Issue solely from Singapore (no multijurisdictional issuance)',
    ],
    exemptions: [
      'Stablecoins pegged to non-G10 currencies remain under general DPT rules',
      'Stablecoins issued outside Singapore not eligible for MAS-regulated label',
    ],
    cbdcStatus: [
      'Project Orchid (established 2021) explores digital Singapore dollar with 10+ successful trials',
      'MAS to trial tokenized MAS bills settlement using wholesale CBDC in 2026',
      'Focus on wholesale CBDC for institutional settlement rather than retail CBDC',
      'Preference for well-regulated private stablecoins for retail payments (via BLOOM initiative)',
    ],
    stablecoinIssuers: [
      { company: 'StraitsX', stablecoin: 'XSGD / XUSD', status: 'Only SGD stablecoin acknowledged by MAS as SCS-compliant; expanding to Solana early 2026' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Holds Major Payment Institution license (June 2023); Circle Mint Singapore serves APAC' },
    ],
  },
  {
    id: 'jp',
    name: 'Japan',
    isoCodes: ['JP'],
    stage: 'implemented',
    summary: 'Japan has one of the world\'s most advanced stablecoin regulatory frameworks, predating Europe\'s MiCA. In June 2022, Parliament amended the Payment Services Act to recognize fiat-pegged tokens as "Electronic Payment Instruments" (EPI), effectively treating them as digital money. The framework became effective June 1, 2023.\n\nOnly banks, licensed money-transfer agents, and trust companies can issue stablecoins. Bank-issued stablecoins are protected by deposit insurance up to 10 million JPY. The Amendment Act 2025, enacted in May 2025, introduced new licenses for intermediary services. Stablecoins remain under Payment Services Act regulation rather than securities law.',
    keyPoints: [
      'Payment Services Act amendment effective June 2023; Amendment Act 2025 enacted May 2025',
      'Only banks, money-transfer agents, and trust companies can issue stablecoins',
      'Stablecoins classified as Electronic Payment Instruments (EPI), not securities',
      'Bank-issued stablecoins protected by deposit insurance up to JPY 10 million',
    ],
    lastUpdated: '2025-05',
    lastVerified: '2026-02-20',
    regulatorName: 'Financial Services Agency (FSA)',
    sources: [
      {
        name: 'FSA - Payment Services Act Overview',
        url: 'https://www.fsa.go.jp/en/',
        type: 'regulator',
      },
      {
        name: 'Bank of Japan - Digital Currency Research',
        url: 'https://www.boj.or.jp/en/',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Financial Services Agency (FSA)', role: 'Primary regulator for stablecoin issuers and intermediaries' },
      { name: 'Bank of Japan', role: 'Central bank oversight; deposit insurance for bank-issued stablecoins' },
    ],
    reserveRequirements: [
      { requirement: 'Full Reserve', details: 'Full reserve backing required for all stablecoins' },
      { requirement: 'Bank Deposits (Trust Banks)', details: 'Trust banks must hold all assets as bank deposits within licensed Japanese trust banks' },
      { requirement: 'Fund Transfer Providers', details: 'Must secure obligations through deposits, bank guarantees, or entrusted safe assets' },
      { requirement: 'Deposit Insurance', details: 'Bank-issued stablecoins protected up to JPY 10 million per holder' },
    ],
    issuerObligations: [
      'Be a licensed bank, money-transfer agent, or trust company',
      'Maintain full reserve backing at all times',
      'Comply with AML/CFT regulations including Travel Rule',
      'Register with FSA for Electronic Payment Instrument Exchange Services',
      'Implement KYC safeguards and custodial protections',
    ],
    exemptions: [
      'Crypto-asset type stablecoins (not fiat-pegged) regulated under different framework',
      'Stablecoins used for remittance/payments remain under PSA (not securities regulation)',
    ],
    stablecoinIssuers: [
      { company: 'MUFG Bank', stablecoin: 'Progmat Coin', status: 'Major bank; developing JPY stablecoin platform' },
      { company: 'SBI Holdings', stablecoin: 'Various', status: 'Licensed financial institution; stablecoin initiatives' },
    ],
  },
  {
    id: 'ca',
    name: 'Canada',
    isoCodes: ['CA'],
    stage: 'proposed',
    summary: 'Canada introduced the Stablecoin Act (Bill C-15) in November 2025 as part of Budget 2025, establishing the first national framework for fiat-referenced stablecoins. The Bank of Canada will serve as the primary regulator, maintaining a public issuer registry and overseeing compliance. Issuers must register with the Bank of Canada, maintain 1:1 reserve backing with qualified Canadian custodians (segregated and bankruptcy-remote), and submit monthly attestations and annual audits.\n\nEligible reserve assets include CAD cash, Government of Canada T-bills, and insured bank deposits. Stablecoins cannot pay interest or yield, and are not considered legal tender or deposits. The Act exempts financial institutions under the Bank Act, central banks, and closed-loop stablecoins.',
    keyPoints: [
      'Stablecoin Act (Bill C-15) tabled November 2025, royal assent expected Spring 2026',
      '1:1 reserve backing required with qualified Canadian custodians',
      'Bank of Canada maintains public issuer registry and oversight',
      'Three CAD stablecoins: QCAD (live), CADD (Q1 2026), CADC (live)',
    ],
    lastUpdated: '2025-11',
    lastVerified: '2026-02-20',
    regulatorName: 'Bank of Canada, Canadian Securities Administrators (CSA) & Office of the Superintendent of Financial Institutions (OSFI)',
    sources: [
      {
        name: 'Bank of Canada - Digital Currency Research',
        url: 'https://www.bankofcanada.ca/',
        type: 'regulator',
      },
      {
        name: 'Canadian Securities Administrators - Crypto Asset Platform Framework',
        url: 'https://www.securities-administrators.ca/',
        type: 'regulator',
      },
      {
        name: 'OSFI - Prudential Regulation',
        url: 'https://www.osfi-bsif.gc.ca/',
        type: 'regulator',
      },
    ],
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
    stablecoinIssuers: [
      { company: 'Stablecorp', stablecoin: 'QCAD', status: 'Live (November 2025)' },
      { company: 'Tetra Digital Group', stablecoin: 'CADD', status: 'Launching Q1 2026' },
      { company: 'Loon', stablecoin: 'CADC', status: 'Live (2021, acquired by Loon October 2025)' },
    ],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    isoCodes: ['AE'],
    stage: 'implemented',
    summary: 'The UAE has a multi-regulator framework for stablecoins. The Central Bank of UAE (CBUAE) has exclusive authority over AED-pegged stablecoins under the Payment Token Services Regulation (August 2024). VARA regulates non-AED stablecoins in Dubai, while ADGM\'s FSRA covers Abu Dhabi.\n\nFederal Decree Law No. 6 of 2025 brings all stablecoins under CBUAE oversight, with penalties up to AED 1 billion. VARA requires 100% backing, daily attestations, and AED 10 million capital. Algorithmic and privacy stablecoins are banned. As of August 2025, only licensed Dirham Payment Tokens can be used for merchant payments in the UAE.',
    keyPoints: [
      'CBUAE has exclusive authority over AED-pegged stablecoins; VARA for non-AED in Dubai',
      'Federal Decree Law No. 6 of 2025 brings all crypto under CBUAE with AED 1B penalties',
      '100% backing required with daily attestations; AED 10M minimum capital for VARA',
      'Algorithmic and privacy stablecoins banned; redemption at par within 1 working day',
    ],
    lastUpdated: '2025-08',
    lastVerified: '2026-02-20',
    regulatorName: 'Central Bank of UAE (CBUAE), Virtual Assets Regulatory Authority (VARA) & ADGM FSRA',
    sources: [
      {
        name: 'Central Bank of UAE - Payment Token Services Regulation',
        url: 'https://www.centralbank.ae/',
        date: '2024-08',
        type: 'regulator',
      },
      {
        name: 'VARA - Virtual Assets Regulatory Framework',
        url: 'https://www.vara.ae/',
        type: 'regulator',
      },
      {
        name: 'ADGM FSRA - Digital Assets Framework',
        url: 'https://www.adgm.com/operating-in-adgm/fsra',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Central Bank of UAE (CBUAE)', role: 'Exclusive authority over AED stablecoins; federal oversight under 2025 Decree Law' },
      { name: 'Virtual Assets Regulatory Authority (VARA)', role: 'Dubai regulator for non-AED stablecoins and crypto assets' },
      { name: 'ADGM Financial Services Regulatory Authority (FSRA)', role: 'Abu Dhabi Global Market regulator for digital assets' },
    ],
    reserveRequirements: [
      { requirement: '100% Backing', details: 'Full backing through segregated accounts at UAE-licensed banks' },
      { requirement: 'Daily Attestation', details: 'Daily attestations showing holdings match circulating tokens' },
      { requirement: 'Capital Requirements', details: 'Minimum AED 10 million regulatory capital (VARA)' },
      { requirement: 'Redemption', details: 'Par redemption within 1 working day; no fees (VARA)' },
      { requirement: 'Documentation', details: '50+ page technical documentation including smart contract audits' },
    ],
    issuerObligations: [
      'Obtain license from relevant regulator (CBUAE for AED, VARA for non-AED in Dubai)',
      'Maintain 100% backing in segregated UAE bank accounts',
      'Provide daily attestations matching reserves to circulation',
      'Submit smart contract audits and economic stress-test models',
      'Comply with one-year transitional period ending September 2026',
    ],
    exemptions: [
      'VARA will not approve any AED-pegged stablecoins (CBUAE jurisdiction)',
      'Financial Free Zones (DIFC, ADGM) have separate regulatory frameworks',
    ],
    stablecoinIssuers: [
      { company: 'Tether', stablecoin: 'USDT', status: 'Operating under VARA framework in Dubai' },
      { company: 'AED Stablecoin Initiatives', stablecoin: 'Various AED tokens', status: 'Require CBUAE licensing' },
    ],
  },
  {
    id: 'hk',
    name: 'Hong Kong',
    isoCodes: ['HK'],
    stage: 'implemented',
    summary: 'Hong Kong enacted the Stablecoins Ordinance (Cap. 656) on May 21, 2025, which came into effect on August 1, 2025. The framework requires HKMA licensing for issuers of Fiat-Referenced Stablecoins (FRS) in Hong Kong and for HKD-linked FRS issuers anywhere globally.\n\nLicensed issuers can offer FRS to both retail and professional investors, while unlicensed foreign issuers are restricted to professional investors only. Issuers must maintain 100% backing with high-quality liquid assets, ensure par redemption within one business day, and meet capital requirements of HK$25 million paid-up capital, HK$3 million liquid capital, plus 12 months of operating expenses. HKMA received 77 expressions of interest by August 31, 2025, with 36 formal applications submitted by September 30, 2025. HKMA Chief Executive Eddie Yue announced on February 2, 2026 that first licenses will be issued in March 2026 to a "very small number" of qualified applicants.',
    keyPoints: [
      'Stablecoins Ordinance effective August 1, 2025; first licenses to be issued March 2026',
      'HKMA received 77 expressions of interest, 36 formal applications by September 2025',
      'Only "very few" licenses will be granted initially from 36 applications',
      '100% backing with high-quality liquid assets; par redemption within one business day',
      'HK$25M paid-up capital, HK$3M liquid capital, plus 12-month operating expense buffer',
      'Transitional period for pre-existing issuers ended January 31, 2026',
    ],
    lastUpdated: '2025-08',
    lastVerified: '2026-02-20',
    regulatorName: 'Hong Kong Monetary Authority (HKMA)',
    sources: [
      {
        name: 'HKMA - Regulatory Regime for Stablecoin Issuers',
        url: 'https://www.hkma.gov.hk/eng/key-functions/international-financial-centre/stablecoin-issuers/',
        type: 'regulator',
      },
      {
        name: 'HKMA - Implementation Guidelines and Key Documents',
        url: 'https://www.hkma.gov.hk/eng/news-and-media/press-releases/2025/07/20250729-4/',
        date: '2025-07-29',
        type: 'guidance',
      },
      {
        name: 'Stablecoins Ordinance (Cap. 656)',
        url: 'https://www.elegislation.gov.hk/hk/cap656',
        date: '2025-05-21',
        type: 'legislation',
      },
      {
        name: 'HKMA/SFC Joint Statement on Market Movements',
        url: 'https://www.hkma.gov.hk/eng/news-and-media/press-releases/2025/08/20250814-8/',
        date: '2025-08-14',
        type: 'regulator',
      },
      {
        name: 'SFC - ASPIRe Roadmap for Virtual Assets',
        url: 'https://www.sfc.hk/en/News-and-announcements/Policy-statements-and-announcements/A-S-P-I-Re-for-a-brighter-future-SFCs-regulatory-roadmap-for-Hong-Kongs-virtual-asset-market',
        date: '2025-02-19',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Hong Kong Monetary Authority (HKMA)', role: 'Primary regulator for stablecoin issuers; licensing and supervision' },
      { name: 'Securities and Futures Commission (SFC)', role: 'Oversight of crypto exchanges and trading platforms' },
    ],
    reserveRequirements: [
      { requirement: '100% Backing', details: 'Market value of reserves must equal or exceed par value of circulating stablecoins' },
      { requirement: 'Overcollateralization', details: 'HKMA expects buffers for volatility, costs, and stress scenarios' },
      { requirement: 'Asset Quality', details: 'Only high-quality, highly liquid assets with minimal investment risk' },
      { requirement: 'Segregation', details: 'Reserves completely segregated and protected from creditor claims' },
      { requirement: 'Redemption', details: 'Absolute right to redeem at par within one business day' },
    ],
    issuerObligations: [
      'Obtain HKMA license before issuing Fiat-Referenced Stablecoins',
      'Maintain HK$25M paid-up capital, HK$3M liquid capital, plus 12-month expense buffer',
      'Ensure 100% reserve backing with high-quality liquid assets',
      'Process redemptions at par within one business day',
      'Establish principal place of business in Hong Kong',
      'At least one-third of board members should be independent non-executive directors',
      'Implement AML/CFT systems compliant with AMLO and HKMA guidelines',
    ],
    exemptions: [
      'Unlicensed foreign issuers of non-HKD stablecoins may offer to professional investors only',
      'Three-month transitional window for pre-existing issuers (until January 31, 2026)',
    ],
    cbdcStatus: [
      'HKMA exploring e-HKD (retail CBDC) through Project Aurum pilot studies',
      'Multiple rounds of pilot testing with banks and fintech firms',
      'No announced timeline for retail CBDC issuance',
      'Focus on interoperability between e-HKD pilots and stablecoin framework',
    ],
    stablecoinIssuers: [
      { company: 'HKMA Applicants', stablecoin: 'Various FRS tokens', status: '36 formal applications under review; first licenses to be issued March 2026' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in Hong Kong for professional investors; may seek HKMA license for retail offering' },
    ],
  },
  {
    id: 'ch',
    name: 'Switzerland',
    isoCodes: ['CH'],
    stage: 'implemented',
    summary: 'Switzerland has established itself as a global leader in blockchain regulation through the DLT Act (2021) and progressive FINMA guidance. FINMA issued updated stablecoin guidelines in July 2024, addressing AML risks and bank guarantee requirements for non-bank issuers.\n\nIn October 2025, the Federal Council proposed major reforms introducing two new license categories: Payment Instrument Institutions (for stablecoin issuance) and Crypto Institutions. Only licensed Payment Institutions will be permitted to issue fiat-pegged stablecoins, which must be fully backed, segregated, and redeemable at par. Banks cannot issue stablecoins directly but must establish separate licensed entities. The CHF 100 million deposit limit is abolished. Full implementation expected by 2027.',
    keyPoints: [
      'DLT Act in force since 2021; FINMA stablecoin guidance updated July 2024',
      'New Payment Institution license proposed October 2025 for stablecoin issuers',
      'Stablecoins classified as deposits require banking license or bank guarantee',
      'Full backing, segregation, and par redemption required; CHF 100M limit abolished',
    ],
    lastUpdated: '2025-10',
    lastVerified: '2026-02-20',
    regulatorName: 'Swiss Financial Market Supervisory Authority (FINMA)',
    sources: [
      {
        name: 'FINMA - Stablecoin Guidance',
        url: 'https://www.finma.ch/',
        date: '2024-07',
        type: 'guidance',
      },
      {
        name: 'Swiss Federal Council - DLT Act',
        url: 'https://www.admin.ch/',
        type: 'legislation',
      },
    ],
    regulatoryBodies: [
      { name: 'FINMA', role: 'Primary regulator for financial market supervision; issues stablecoin guidance' },
      { name: 'Swiss Federal Council', role: 'Legislative authority; proposed FINIA amendments for crypto institutions' },
      { name: 'Self-Regulatory Organizations (SROs)', role: 'AML compliance supervision for financial intermediaries' },
    ],
    reserveRequirements: [
      { requirement: 'Full Backing', details: 'Stablecoins must be fully backed by equivalent assets' },
      { requirement: 'Segregation', details: 'Backing assets must be segregated from issuer assets' },
      { requirement: 'Par Redemption', details: 'Redeemable at par value on demand' },
      { requirement: 'Bank Guarantee Alternative', details: 'Non-bank issuers may use bank guarantee instead of banking license' },
      { requirement: 'Whitepaper', details: 'Payment Institutions must publish whitepaper for stablecoin issuance' },
    ],
    issuerObligations: [
      'Obtain Payment Institution license (proposed) or banking license for stablecoin issuance',
      'Alternatively, secure bank guarantee from licensed Swiss bank',
      'Comply with AMLA know-your-customer and due diligence requirements',
      'Ensure full backing and segregation of reserve assets',
      'Banks must establish separate legal entity to issue stablecoins',
      'Technical audits required for smart contracts on public blockchains',
    ],
    exemptions: [
      'Stablecoins with bank guarantee do not require issuer to hold banking license',
      'MiCA does not apply directly to Swiss companies (non-EU member)',
    ],
    stablecoinIssuers: [
      { company: 'Sygnum Bank', stablecoin: 'DCHF', status: 'Licensed Swiss bank; CHF-denominated stablecoin' },
      { company: 'Circle', stablecoin: 'USDC / EURC', status: 'Operating in Switzerland' },
      { company: 'Tether', stablecoin: 'USDT', status: 'Operating in Switzerland' },
    ],
  },
  {
    id: 'au',
    name: 'Australia',
    isoCodes: ['AU'],
    stage: 'proposed',
    summary: 'Australia is developing a comprehensive digital asset regulatory framework. In March 2025, the Government released its "Statement on Developing an Innovative Australian Digital Asset Industry," outlining licensing for Digital Asset Platforms and a framework for payment stablecoins under the stored value facility (SVF) regime.\n\nTreasury released exposure draft legislation in October 2025, proposing that major stablecoin issuers holding over A$100 million be authorized by APRA. ASIC now classifies stablecoins as financial products requiring an Australian Financial Services license. Non-bank stablecoins must be 1:1 collateralized. Legislation expected to be introduced to Parliament in 2026.',
    keyPoints: [
      'Digital Asset Statement released March 2025; exposure draft legislation October 2025',
      'ASIC classifies stablecoins as financial products requiring AFS license',
      'Major issuers (>A$100M) to be authorized by APRA; 1:1 collateralization required',
      'Single legislation package expected to be introduced to Parliament in 2026',
    ],
    lastUpdated: '2025-10',
    lastVerified: '2026-02-20',
    regulatorName: 'Australian Treasury, ASIC & Australian Prudential Regulation Authority (APRA)',
    sources: [
      {
        name: 'Australian Treasury - Digital Asset Industry Statement',
        url: 'https://treasury.gov.au/',
        date: '2025-03',
        type: 'regulator',
      },
      {
        name: 'ASIC - Crypto-Assets and Financial Products',
        url: 'https://asic.gov.au/',
        type: 'regulator',
      },
      {
        name: 'APRA - Prudential Framework',
        url: 'https://www.apra.gov.au/',
        type: 'regulator',
      },
    ],
    regulatoryBodies: [
      { name: 'Australian Treasury', role: 'Policy development; exposure draft legislation for digital assets' },
      { name: 'Australian Securities and Investments Commission (ASIC)', role: 'Classifies stablecoins as financial products; AFS licensing' },
      { name: 'Australian Prudential Regulation Authority (APRA)', role: 'Authorization for major SVFs and stablecoin issuers over A$100M' },
    ],
    reserveRequirements: [
      { requirement: '1:1 Collateralization', details: 'All non-bank issued stablecoins must be collateralized 1:1 with appropriate reserves' },
      { requirement: 'APRA Authorization', details: 'Major issuers holding over A$100 million require APRA authorization' },
      { requirement: 'Prudential Standards', details: 'Subject to prudential regulation similar to stored value facilities' },
    ],
    issuerObligations: [
      'Obtain Australian Financial Services (AFS) license from ASIC',
      'Major issuers (>A$100M) must be authorized by APRA',
      'Maintain 1:1 collateralization with appropriate reserves',
      'Comply with proposed money safeguarding obligations (Tranche 1b)',
      'Meet disclosure requirements including Product Disclosure Statement for retail',
    ],
    exemptions: [
      'ASIC granted class relief for intermediaries distributing named AUD-backed stablecoins (Instrument 2025/631)',
      'Time-limited exemptions for compliant issuers during transitional period',
    ],
    stablecoinIssuers: [
      { company: 'Various AUD Stablecoin Issuers', stablecoin: 'AUD-backed stablecoins', status: 'Operating under ASIC class relief; awaiting final framework' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in Australia' },
    ],
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
  proposed: '#D4A437',
  approved: '#6C757D',
  implemented: '#4A9D6E',
};
