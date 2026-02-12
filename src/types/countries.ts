export type RegulatoryStatus =
  | 'CLEAR_FRAMEWORK'
  | 'PARTIAL_GUIDANCE'
  | 'RESTRICTIVE'
  | 'UNKNOWN';

export interface Country {
  id: string;
  isoCode: string;
  name: string;
  region: string;
  regulatoryStatus: RegulatoryStatus;
  regulatorNames: string[];
  summaryText: string;
  lastUpdatedAt: string;
}

export interface CountryEvent {
  id: string;
  countryId: string;
  date: string;
  title: string;
  description: string;
  sourceUrl?: string;
}

export interface CountryDetail extends Country {
  events: CountryEvent[];
  keyFrameworks?: {
    name: string;
    url: string;
  }[];
  usageNotes?: string;
}

export interface CountryFilters {
  region?: string;
  regulatoryStatus?: RegulatoryStatus | 'all';
  search?: string;
}

export const REGULATORY_STATUS_LABELS: Record<RegulatoryStatus, string> = {
  CLEAR_FRAMEWORK: 'Clear Framework',
  PARTIAL_GUIDANCE: 'Partial Guidance',
  RESTRICTIVE: 'Restrictive',
  UNKNOWN: 'Unknown',
};

export const REGULATORY_STATUS_COLORS: Record<RegulatoryStatus, string> = {
  CLEAR_FRAMEWORK: '#4A9D6E',
  PARTIAL_GUIDANCE: '#D4A437',
  RESTRICTIVE: '#C0524E',
  UNKNOWN: '#6C757D',
};
