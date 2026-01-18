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
    stage: 'implemented',
    summary: 'The United States enacted the GENIUS Act (Guiding and Establishing National Innovation for US Stablecoins Act) in July 2025, establishing the first comprehensive federal regulatory framework for payment stablecoins. The legislation passed with strong bipartisan support (68-30 in the Senate, 308-122 in the House) and was signed into law by President Trump on July 18, 2025.\n\nThe GENIUS Act clarifies that payment stablecoins are neither securities nor commodities, removing SEC and CFTC oversight. Instead, bank issuers are regulated by their primary federal banking regulator, while nonbank issuers are overseen by the OCC. Issuers must maintain 100% reserve backing with highly liquid assets, publish monthly reserve compositions, and honor redemptions at par within one day. Full implementation is expected by November 2026.',
    keyPoints: [
      'GENIUS Act signed into law July 2025, full implementation expected November 2026',
      '100% reserve backing required with liquid assets (USD, T-bills, government money market funds)',
      'Payment stablecoins explicitly excluded from SEC and CFTC jurisdiction',
      'State regulatory option available for nonbank issuers under $10 billion market cap',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'Office of the Comptroller of the Currency (OCC), Federal Reserve, FDIC & State Regulators',
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
    stablecoinIssuers: [
      { company: 'Tether', stablecoin: 'USDT', status: 'Largest by market cap; seeking GENIUS Act compliance' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Provisional national bank charter approved; $78B market cap' },
      { company: 'Paxos Trust Company', stablecoin: 'PYUSD / USDP', status: 'NYDFS-regulated trust company; issues PayPal USD' },
      { company: 'Gemini Trust Company', stablecoin: 'GUSD', status: 'NYDFS-regulated trust company' },
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
    summary: 'The European Union implemented the Markets in Crypto-Assets (MiCA) Regulation, the world\'s first comprehensive crypto regulatory framework. Stablecoin provisions (for ARTs and EMTs) became effective June 30, 2024, with full CASP authorization required by December 30, 2024.\n\nMiCA distinguishes between Asset-Referenced Tokens (ARTs) backed by multiple assets and Electronic Money Tokens (EMTs) backed by a single fiat currency. Issuers must be authorized credit or electronic money institutions, maintain full reserve backing, and ensure redemption at par value. The European Banking Authority (EBA) directly supervises "significant" stablecoins that pose systemic risks. Non-compliant stablecoins like USDT have been delisted from major EU exchanges.',
    keyPoints: [
      'MiCA fully implemented December 2024; first comprehensive crypto regulation globally',
      'EMTs (single-currency) and ARTs (multi-asset) require authorization as credit/e-money institutions',
      'Non-EU currency stablecoins limited to 1M daily transactions or €200M payment value',
      'USDT delisted from EU exchanges due to non-compliance; USDC and EURC are compliant',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'European Banking Authority (EBA) & National Competent Authorities (NCAs)',
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
    stablecoinIssuers: [
      { company: 'Circle', stablecoin: 'USDC / EURC', status: 'MiCA-compliant; EURC holds >50% of Euro stablecoin market' },
      { company: 'Société Générale-Forge', stablecoin: 'EURCV', status: 'MiCA-compliant; regulated subsidiary of Société Générale' },
      { company: 'Tether', stablecoin: 'USDT / EURT', status: 'Non-compliant; delisted from major EU exchanges March 2025' },
      { company: 'Banking Circle', stablecoin: 'EURI', status: 'MiCA-compliant EMT' },
    ],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    isoCodes: ['GB'],
    stage: 'approved',
    summary: 'The United Kingdom is developing a comprehensive regulatory framework for stablecoins through the Financial Services and Markets Act (FSMA) 2023. The FCA published Consultation Paper 25/14 in May 2025, proposing rules for "qualifying stablecoins" referencing a single fiat currency.\n\nThe Bank of England published its consultation on systemic stablecoin regulation in November 2025, establishing a dual-regulator model. Systemic stablecoins (those posing financial stability risks) will be jointly regulated by the Bank of England (prudential oversight) and FCA (conduct and consumer protection). Non-systemic issuers will be FCA-regulated only. Full implementation is expected by October 2027.',
    keyPoints: [
      'FCA authorization required for qualifying stablecoin issuers; final rules expected 2026',
      'Systemic stablecoins jointly regulated by Bank of England and FCA',
      'Full backing required: 40% BoE deposits, 60% short-term UK government debt for systemic issuers',
      'Per-coin holding limits proposed: £20,000 for individuals, £10M for businesses',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'Financial Conduct Authority (FCA) & Bank of England',
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
    stablecoinIssuers: [
      { company: 'FCA Regulatory Sandbox', stablecoin: 'Various GBP stablecoins', status: 'Sandbox cohort launched November 2025 for testing' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in UK; seeking UK-specific authorization' },
    ],
  },
  {
    id: 'sg',
    name: 'Singapore',
    isoCodes: ['SG'],
    stage: 'implemented',
    summary: 'The Monetary Authority of Singapore (MAS) finalized its stablecoin regulatory framework in August 2023, with full implementation expected by mid-2026. The framework applies to Single-Currency Stablecoins (SCS) pegged to the Singapore Dollar or any G10 currency, issued from Singapore.\n\nTo obtain the "MAS-regulated" label, issuers must maintain 100% reserves in the peg currency, publish monthly independent attestations, undergo annual audits, and redeem at par within five business days. MAS does not allow multijurisdictional issuance—SCS issuers must issue solely from Singapore. In November 2025, MAS announced trials for tokenized MAS bills in 2026.',
    keyPoints: [
      'MAS framework finalized August 2023; full implementation expected mid-2026',
      'Applies to single-currency stablecoins pegged to SGD or G10 currencies only',
      '100% reserve backing required; monthly attestations and annual audits mandatory',
      'Issuers must be Singapore-based; no multijurisdictional issuance allowed',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'Monetary Authority of Singapore (MAS)',
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
    stablecoinIssuers: [
      { company: 'StraitsX', stablecoin: 'XSGD', status: 'SGD-backed; launched on Coinbase October 2025; reserves with DBS and Standard Chartered' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in Singapore' },
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
    lastUpdated: '2026-01',
    regulatorName: 'Financial Services Agency (FSA)',
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
    lastUpdated: '2026-01',
    regulatorName: 'Central Bank of UAE (CBUAE), Virtual Assets Regulatory Authority (VARA) & ADGM FSRA',
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
    summary: 'Hong Kong enacted the Stablecoins Ordinance on May 21, 2025, which came into effect on August 1, 2025. The framework requires HKMA licensing for issuers of Fiat-Referenced Stablecoins (FRS) in Hong Kong and for HKD-linked FRS issuers anywhere.\n\nLicensed issuers can offer FRS to both retail and professional investors, while unlicensed foreign issuers are restricted to professional investors only. Issuers must maintain 100% backing with high-quality liquid assets, ensure par redemption within one business day, and meet capital requirements of HK$25 million. HKMA received 77 expressions of interest by August 2025, with first licenses expected early 2026.',
    keyPoints: [
      'Stablecoins Ordinance effective August 1, 2025; first licenses expected early 2026',
      'HKMA license required for HK-based issuers and HKD-linked stablecoins globally',
      '100% backing required; par redemption within one business day mandatory',
      'HK$25M paid-up capital, HK$3M liquid capital, plus 12 months operating expenses',
    ],
    lastUpdated: '2026-01',
    regulatorName: 'Hong Kong Monetary Authority (HKMA)',
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
    stablecoinIssuers: [
      { company: 'Various Applicants', stablecoin: 'HKD and USD stablecoins', status: '77 expressions of interest received; licenses pending early 2026' },
      { company: 'Circle', stablecoin: 'USDC', status: 'Available in Hong Kong; considering local license' },
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
    lastUpdated: '2026-01',
    regulatorName: 'Swiss Financial Market Supervisory Authority (FINMA)',
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
    lastUpdated: '2026-01',
    regulatorName: 'Australian Treasury, ASIC & Australian Prudential Regulation Authority (APRA)',
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
  proposed: '#f59e0b',
  approved: '#3b82f6',
  implemented: '#22c55e',
};
