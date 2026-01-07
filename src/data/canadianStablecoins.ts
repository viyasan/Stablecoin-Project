// Canadian Stablecoins Data Configuration
// This file contains all data for the Canada page
// Future: Replace with Supabase API fetch

export type RegulatoryStage =
  | "fintrac_msb"
  | "prospectus_filed"
  | "prospectus_receipt"
  | "live";

export type StablecoinStatus = "live" | "coming_soon" | "pending_approval";

export interface RegulatoryStep {
  id: RegulatoryStage;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface ParentCompany {
  name: string;
  description: string;
  founded: string;
  headquarters: string;
  website: string;
  leadership: {
    name: string;
    title: string;
  }[];
  keyFacts: string[];
  parentOf?: string[]; // subsidiary companies
}

export interface CompanyTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "regulatory" | "funding" | "launch" | "partnership";
}

export interface StrategicPartner {
  name: string;
  role: string;
}

export interface DesignPartner {
  name: string;
}

export interface PlatformIntegration {
  name: string;
  role: string;
}

export interface CanadianStablecoin {
  id: string;
  name: string;
  symbol: string;
  issuer: string;
  logo?: string;
  status: StablecoinStatus;
  statusLabel: string;
  tagline: string;
  founded: string;
  headquarters: string;
  website: string;
  backing: string;
  custodian: string;
  blockchains: string[];
  backers: string[];
  strategicPartners?: StrategicPartner[];
  designPartners?: DesignPartner[];
  platformIntegrations?: PlatformIntegration[];
  regulatorySteps: RegulatoryStep[];
  fintracRegistered: boolean;
  audits: string;
  volume?: string;
  exchangePartners: number;
  parentCompany: ParentCompany;
  companyTimeline: CompanyTimelineEvent[];
}

export interface Exchange {
  name: string;
  type: "CEX" | "DEX";
  url: string;
  logo?: string;
  stablecoins: string[]; // which stablecoins are available
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "regulatory" | "funding" | "launch";
  stablecoinId?: string;
}

// ============================================
// STABLECOIN DATA
// ============================================

export const canadianStablecoins: CanadianStablecoin[] = [
  {
    id: "qcad",
    name: "QCAD",
    symbol: "QCAD",
    issuer: "Stablecorp",
    status: "live",
    statusLabel: "Live",
    tagline: "Canada's First Compliant CAD Stablecoin",
    founded: "2020",
    headquarters: "Toronto, ON",
    website: "https://stablecorp.ca",
    backing: "1:1 CAD reserves at regulated financial institutions",
    custodian: "Tetra Trust Company",
    blockchains: ["Ethereum", "Algorand", "Base"],
    backers: [
      "Coinbase Ventures",
      "Circle Ventures",
      "DeFi Technologies",
      "Side Door Ventures",
    ],
    strategicPartners: [
      { name: "Valour", role: "CAD-linked ETPs & yield products" },
      { name: "Stillman Digital", role: "Liquidity provider" },
      { name: "BTQ", role: "Post-quantum security" },
    ],
    regulatorySteps: [
      {
        id: "fintrac_msb",
        label: "FINTRAC MSB",
        description: "Registered as a Money Service Business with FINTRAC",
        completed: true,
        current: false,
      },
      {
        id: "prospectus_filed",
        label: "CSA Prospectus Filed",
        description: "Prospectus filed with Canadian Securities Administrators",
        completed: true,
        current: false,
      },
      {
        id: "prospectus_receipt",
        label: "Final Receipt",
        description: "Received final receipt from CSA qualifying distribution",
        completed: true,
        current: false,
      },
      {
        id: "live",
        label: "Live",
        description: "Fully compliant and available for public use",
        completed: true,
        current: true,
      },
    ],
    fintracRegistered: true,
    audits: "Monthly attestations with annual audits",
    volume: "N/A (Launched Nov 2025)",
    exchangePartners: 22,
    parentCompany: {
      name: "Stablecorp Digital Currencies Inc.",
      description:
        "Stablecorp is a joint venture between 3iQ (Canada's largest cryptoasset manager) and Mavennet Systems (a leader in blockchain development). The company focuses on building compliant digital currency infrastructure for the Canadian market.",
      founded: "2019",
      headquarters: "Toronto, ON",
      website: "https://stablecorp.ca",
      leadership: [
        { name: "Fred Pye", title: "Director & Co-Founder" },
        { name: "Alex McDougall", title: "Co-Founder" },
      ],
      keyFacts: [
        "Joint venture between 3iQ and Mavennet Systems",
        "First to mint a Canadian dollar token in 2020",
        "Backed by Coinbase Ventures and Circle Ventures",
        "FINTRAC registered Money Service Business",
        "22 ecosystem partners including exchanges and DEXs",
      ],
    },
    companyTimeline: [
      {
        date: "Feb 2020",
        title: "First QCAD Minted",
        description: "Stablecorp mints the very first Canadian dollar token",
        type: "launch",
      },
      {
        date: "2021",
        title: "Algorand Launch",
        description: "QCAD becomes first non-USD stablecoin on Algorand",
        type: "milestone",
      },
      {
        date: "May 2025",
        title: "$1.8M Funding",
        description: "Raises funding led by Coinbase Ventures",
        type: "funding",
      },
      {
        date: "Sept 2025",
        title: "CSA Prospectus Filed",
        description: "Files prospectus under CSA interim regulatory framework",
        type: "regulatory",
      },
      {
        date: "Sept 2025",
        title: "$5M Strategic Round",
        description: "Raises $5M CAD led by FTP Ventures to accelerate scaling",
        type: "funding",
      },
      {
        date: "Sept 2025",
        title: "DeFi Technologies Partnership",
        description:
          "Strategic partnership with Valour (ETPs), Stillman Digital (liquidity), and BTQ (post-quantum security)",
        type: "partnership",
      },
      {
        date: "Nov 24, 2025",
        title: "QCAD Goes Live",
        description: "Becomes Canada's first fully compliant CAD stablecoin",
        type: "milestone",
      },
    ],
  },
  {
    id: "tetra",
    name: "CADD",
    symbol: "CADD",
    issuer: "CAD Digital (Tetra)",
    status: "coming_soon",
    statusLabel: "Q1 2026",
    tagline: "First regulated CAD stablecoin issued by a financial institution",
    founded: "2019",
    headquarters: "Calgary, AB",
    website: "https://tetradg.com/cadd-stablecoin/",
    backing: "1:1 CAD reserves held domestically",
    custodian: "Tetra Trust Company",
    blockchains: ["TBD"],
    backers: [
      "Shopify",
      "Wealthsimple",
      "National Bank",
      "ATB Financial",
      "Shakepay",
      "Purpose Unlimited",
      "Urbana Corporation",
    ],
    designPartners: [
      { name: "Aquanow" },
      { name: "Capco" },
      { name: "Cybrid" },
      { name: "Float Financial" },
      { name: "KOHO" },
      { name: "Sling Money" },
      { name: "Tempo" },
      { name: "WealthONE" },
    ],
    regulatorySteps: [
      {
        id: "fintrac_msb",
        label: "Trust License",
        description: "Licensed trust company in Alberta",
        completed: true,
        current: false,
      },
      {
        id: "prospectus_filed",
        label: "Regulatory Filing",
        description: "Preparing regulatory applications",
        completed: false,
        current: true,
      },
      {
        id: "prospectus_receipt",
        label: "Approval",
        description: "Awaiting regulatory approval",
        completed: false,
        current: false,
      },
      {
        id: "live",
        label: "Launch",
        description: "Public launch expected early 2026",
        completed: false,
        current: false,
      },
    ],
    fintracRegistered: false,
    audits: "Planned monthly attestations",
    volume: "N/A (Launching Q1 2026)",
    exchangePartners: 0,
    parentCompany: {
      name: "Tetra Digital Group",
      description:
        "Tetra Digital Group is one of Canada's leading digital asset infrastructure providers. Through subsidiary CAD Digital, they are launching CADD - the first regulated CAD stablecoin issued by a financial institution. In Dec 2025, CADD became the first Canadian stablecoin to transfer between two financial institutions.",
      founded: "2019",
      headquarters: "Calgary, AB",
      website: "https://tetradg.com",
      leadership: [{ name: "Didier Lavallée", title: "CEO" }],
      keyFacts: [
        "First CAD stablecoin to transfer between financial institutions",
        "$2.5B+ in digital assets under custody",
        "Backed by National Bank, Wealthsimple, Shopify & more",
      ],
      parentOf: ["Tetra Trust Company", "CAD Digital", "Tetra Unity"],
    },
    companyTimeline: [
      {
        date: "2019",
        title: "Tetra Founded",
        description:
          "Founded to become Canada's first licensed digital asset custodian",
        type: "launch",
      },
      {
        date: "2021",
        title: "Trust License Obtained",
        description:
          "Becomes first Canadian trust company licensed for digital asset custody",
        type: "regulatory",
      },
      {
        date: "May 2025",
        title: "Wealthsimple Partnership",
        description: "Chosen by Wealthsimple for digital asset custody",
        type: "partnership",
      },
      {
        date: "Sept 2025",
        title: "$10M Funding Round",
        description:
          "Raises $10M from Shopify, Wealthsimple, National Bank and others",
        type: "funding",
      },
      {
        date: "Sept 2025",
        title: "Design Partner Program",
        description:
          "Expands partners to include Aquanow, Capco, Cybrid, Float, KOHO, Sling Money, Tempo, WealthONE",
        type: "partnership",
      },
      {
        date: "Dec 2025",
        title: "Testnet Milestone",
        description:
          "First CAD stablecoin to move between two financial institutions (National Bank ↔ Wealthsimple)",
        type: "milestone",
      },
      {
        date: "Q1 2026",
        title: "CADD Launch",
        description: "Expected launch of CADD stablecoin",
        type: "launch",
      },
    ],
  },
  {
    id: "cadc",
    name: "CADC",
    symbol: "CADC",
    issuer: "Loon",
    status: "pending_approval",
    statusLabel: "Pending Approval",
    tagline: "Canada's leading CAD stablecoin by usage",
    founded: "2021",
    headquarters: "Calgary, AB",
    website: "https://loon.finance",
    backing: "101% CAD reserves with monthly verification",
    custodian: "ATB Financial",
    blockchains: ["Ethereum", "Base", "Polygon"],
    backers: ["Version One Ventures", "Garage Capital"],
    platformIntegrations: [
      { name: "MetaMask", role: "Wallet" },
      { name: "Aerodrome", role: "DeFi/Liquidity" },
      { name: "Base", role: "Blockchain" },
    ],
    regulatorySteps: [
      {
        id: "fintrac_msb",
        label: "FINTRAC MSB",
        description: "Registered as a Money Service Business",
        completed: true,
        current: false,
      },
      {
        id: "prospectus_filed",
        label: "ASC Pre-filed",
        description: "Pre-filed prospectus with Alberta Securities Commission",
        completed: true,
        current: true,
      },
      {
        id: "prospectus_receipt",
        label: "Prospectus Receipt",
        description: "Awaiting final prospectus receipt",
        completed: false,
        current: false,
      },
      {
        id: "live",
        label: "Launch",
        description: "Public launch pending approval",
        completed: false,
        current: false,
      },
    ],
    fintracRegistered: true,
    audits: "Monthly attestations",
    volume: "$200M+",
    exchangePartners: 0,
    parentCompany: {
      name: "Loon",
      description:
        "Loon is a Calgary-based fintech building Canada's regulated digital dollar. They acquired CADC from Paytrie (launched 2021) and position it as a sovereign alternative to US stablecoins, with a vision for Canada to build its own rails for the digital era.",
      founded: "2025",
      headquarters: "Calgary, AB",
      website: "https://loon.finance",
      leadership: [{ name: "Kevin Zhang", title: "CEO" }],
      keyFacts: [
        "$200M+ on-chain volume processed",
        "5 institutional partners (FIs and DApps)",
        "3-second average settlement time",
      ],
    },
    companyTimeline: [
      {
        date: "2021",
        title: "CADC Launched",
        description: "Paytrie launches CADC stablecoin",
        type: "launch",
      },
      {
        date: "2021-2025",
        title: "$200M+ Volume",
        description: "CADC transacts over $200M in volume",
        type: "milestone",
      },
      {
        date: "Oct 2025",
        title: "Loon Founded",
        description: "Loon spun out from Paytrie to focus on CADC",
        type: "launch",
      },
      {
        date: "Oct 2025",
        title: "$3M Pre-Seed",
        description: "Raises $3M led by Version One Ventures",
        type: "funding",
      },
      {
        date: "Oct 2025",
        title: "ASC Pre-filing",
        description: "Pre-files prospectus with Alberta Securities Commission",
        type: "regulatory",
      },
      {
        date: "TBD",
        title: "Regulatory Approval",
        description: "Awaiting prospectus receipt and full launch",
        type: "regulatory",
      },
    ],
  },
];

// ============================================
// EXCHANGE DATA
// ============================================

export const exchanges: Exchange[] = [
  {
    name: "Netcoins",
    type: "CEX",
    url: "https://netcoins.ca",
    stablecoins: ["qcad"],
  },
  {
    name: "Newton",
    type: "CEX",
    url: "https://newton.co",
    stablecoins: ["qcad"],
  },
  {
    name: "Bitvo",
    type: "CEX",
    url: "https://bitvo.com",
    stablecoins: ["qcad"],
  },
  {
    name: "Coinsmart",
    type: "CEX",
    url: "https://coinsmart.com",
    stablecoins: ["qcad"],
  },
  {
    name: "DVeX",
    type: "DEX",
    url: "https://dvex.io",
    stablecoins: ["qcad"],
  },
];

// ============================================
// TIMELINE DATA
// ============================================

export const timelineEvents: TimelineEvent[] = [
  {
    date: "Feb 2020",
    title: "First QCAD Minted",
    description: "Stablecorp mints the very first Canadian dollar token",
    type: "launch",
    stablecoinId: "qcad",
  },
  {
    date: "2021",
    title: "CADC Launches",
    description: "Paytrie launches CADC stablecoin",
    type: "launch",
    stablecoinId: "cadc",
  },
  {
    date: "May 2025",
    title: "Wealthsimple Partnership",
    description: "Tetra Trust chosen by Wealthsimple for digital asset custody",
    type: "milestone",
    stablecoinId: "tetra",
  },
  {
    date: "July 2025",
    title: "US Passes GENIUS Act",
    description: "US stablecoin legislation puts pressure on Canada to act",
    type: "regulatory",
  },
  {
    date: "Sept 2025",
    title: "Tetra Raises $10M",
    description:
      "Tetra Digital Group raises funding from Shopify, Wealthsimple, National Bank and others",
    type: "funding",
    stablecoinId: "tetra",
  },
  {
    date: "Sept 2025",
    title: "QCAD Files Prospectus",
    description:
      "Stablecorp files prospectus with CSA under interim regulatory framework",
    type: "regulatory",
    stablecoinId: "qcad",
  },
  {
    date: "Oct 2025",
    title: "Loon Acquires CADC",
    description: "Loon raises $3M and acquires CADC stablecoin from Paytrie",
    type: "funding",
    stablecoinId: "cadc",
  },
  {
    date: "Nov 2025",
    title: "Federal Budget Announcement",
    description:
      "Budget 2025 commits $10M to Bank of Canada for stablecoin oversight",
    type: "regulatory",
  },
  {
    date: "Nov 24, 2025",
    title: "QCAD Goes Live",
    description: "QCAD becomes Canada's first fully compliant CAD stablecoin",
    type: "milestone",
    stablecoinId: "qcad",
  },
  {
    date: "Dec 2025",
    title: "CADD Testnet Milestone",
    description:
      "First CAD stablecoin transferred between two financial institutions (National Bank ↔ Wealthsimple)",
    type: "milestone",
    stablecoinId: "tetra",
  },
  {
    date: "Dec 2025",
    title: "Stablecoin Act Introduced",
    description: "Federal government introduces proposed Stablecoin Act",
    type: "regulatory",
  },
  {
    date: "Q1 2026",
    title: "CADD Launch",
    description: "CAD Digital expected to launch CADD stablecoin",
    type: "launch",
    stablecoinId: "tetra",
  },
  {
    date: "2026-27",
    title: "Bank of Canada Oversight Begins",
    description:
      "Bank of Canada begins formal stablecoin oversight under new legislation",
    type: "regulatory",
  },
];
