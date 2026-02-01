import { useState, useEffect, useCallback } from 'react';
import type { Country, CountryDetail, CountryFilters } from '../types';

// Mock data for development
const mockCountries: Country[] = [
  {
    id: '1',
    isoCode: 'US',
    name: 'United States',
    region: 'North America',
    regulatoryStatus: 'PARTIAL_GUIDANCE',
    regulatorNames: ['SEC', 'CFTC', 'OCC', 'FinCEN'],
    summaryText:
      'Mixed regulatory approach with multiple agencies claiming jurisdiction. Recent focus on enforcement actions against unregistered securities.',
    lastUpdatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: '2',
    isoCode: 'GB',
    name: 'United Kingdom',
    region: 'Europe',
    regulatoryStatus: 'PARTIAL_GUIDANCE',
    regulatorNames: ['FCA'],
    summaryText:
      'FCA regulates crypto assets under existing financial services framework. New regime under development.',
    lastUpdatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: '3',
    isoCode: 'EU',
    name: 'European Union',
    region: 'Europe',
    regulatoryStatus: 'CLEAR_FRAMEWORK',
    regulatorNames: ['EBA', 'ESMA'],
    summaryText:
      'MiCA regulation provides comprehensive framework for stablecoins as e-money tokens (EMTs) and asset-referenced tokens (ARTs).',
    lastUpdatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: '4',
    isoCode: 'SG',
    name: 'Singapore',
    region: 'Asia Pacific',
    regulatoryStatus: 'CLEAR_FRAMEWORK',
    regulatorNames: ['MAS'],
    summaryText:
      'Clear regulatory framework under MAS with licensing requirements for stablecoin issuers.',
    lastUpdatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: '5',
    isoCode: 'JP',
    name: 'Japan',
    region: 'Asia Pacific',
    regulatoryStatus: 'CLEAR_FRAMEWORK',
    regulatorNames: ['FSA', 'JFSA'],
    summaryText:
      'Stablecoins regulated under Payment Services Act. Only banks and licensed entities can issue.',
    lastUpdatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: '6',
    isoCode: 'CN',
    name: 'China',
    region: 'Asia Pacific',
    regulatoryStatus: 'RESTRICTIVE',
    regulatorNames: ['PBOC'],
    summaryText:
      'Cryptocurrency trading and mining banned. Digital yuan (e-CNY) is the only approved digital currency.',
    lastUpdatedAt: '2024-10-01T00:00:00Z',
  },
  {
    id: '7',
    isoCode: 'AE',
    name: 'United Arab Emirates',
    region: 'Middle East',
    regulatoryStatus: 'CLEAR_FRAMEWORK',
    regulatorNames: ['VARA', 'ADGM', 'DFSA'],
    summaryText:
      'Multiple regulatory frameworks across different free zones. Dubai VARA provides comprehensive crypto regulation.',
    lastUpdatedAt: '2024-12-05T00:00:00Z',
  },
  {
    id: '8',
    isoCode: 'BR',
    name: 'Brazil',
    region: 'South America',
    regulatoryStatus: 'PARTIAL_GUIDANCE',
    regulatorNames: ['BCB', 'CVM'],
    summaryText:
      'Crypto asset law passed in 2022. Central Bank developing specific stablecoin regulations.',
    lastUpdatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '9',
    isoCode: 'NG',
    name: 'Nigeria',
    region: 'Africa',
    regulatoryStatus: 'PARTIAL_GUIDANCE',
    regulatorNames: ['CBN', 'SEC'],
    summaryText:
      'Banks initially restricted from crypto, but regulations evolving. High adoption for remittances.',
    lastUpdatedAt: '2024-10-15T00:00:00Z',
  },
  {
    id: '10',
    isoCode: 'AU',
    name: 'Australia',
    region: 'Oceania',
    regulatoryStatus: 'PARTIAL_GUIDANCE',
    regulatorNames: ['ASIC', 'AUSTRAC'],
    summaryText:
      'Crypto regulated under existing financial services laws. Treasury consulting on token mapping.',
    lastUpdatedAt: '2024-11-10T00:00:00Z',
  },
];

const mockCountryDetails: Record<string, CountryDetail> = {
  US: {
    ...mockCountries[0],
    events: [
      {
        id: '1',
        countryId: '1',
        date: '2024-12-01',
        title: 'SEC settles with major stablecoin issuer',
        description: 'Landmark settlement establishes precedent for stablecoin regulation.',
        sourceUrl: 'https://sec.gov',
      },
      {
        id: '2',
        countryId: '1',
        date: '2024-10-15',
        title: 'OCC issues guidance on bank custody',
        description: 'Banks permitted to custody stablecoins under certain conditions.',
        sourceUrl: 'https://occ.gov',
      },
    ],
    keyFrameworks: [
      { name: 'SEC Framework', url: 'https://sec.gov/crypto' },
      { name: 'FinCEN Guidance', url: 'https://fincen.gov' },
    ],
    usageNotes: 'High institutional and retail adoption. Primary use for trading and DeFi.',
  },
  EU: {
    ...mockCountries[2],
    events: [
      {
        id: '1',
        countryId: '3',
        date: '2024-06-30',
        title: 'MiCA fully implemented',
        description: 'Markets in Crypto-Assets regulation enters full force across EU member states.',
        sourceUrl: 'https://eur-lex.europa.eu',
      },
      {
        id: '2',
        countryId: '3',
        date: '2024-01-01',
        title: 'MiCA stablecoin provisions active',
        description: 'Stablecoin-specific provisions of MiCA come into effect.',
        sourceUrl: 'https://eur-lex.europa.eu',
      },
    ],
    keyFrameworks: [
      { name: 'MiCA Regulation', url: 'https://eur-lex.europa.eu/eli/reg/2023/1114' },
      { name: 'EBA Guidelines', url: 'https://eba.europa.eu' },
    ],
    usageNotes: 'Growing adoption as regulatory clarity improves. Euro-backed stablecoins emerging.',
  },
};

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCountries(filters?: CountryFilters): UseApiResult<Country[]> {
  const [data, setData] = useState<Country[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCountries = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      let filteredData = [...mockCountries];

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (country) =>
            country.name.toLowerCase().includes(search) ||
            country.isoCode.toLowerCase().includes(search)
        );
      }

      if (filters?.region) {
        filteredData = filteredData.filter(
          (country) => country.region === filters.region
        );
      }

      if (filters?.regulatoryStatus && filters.regulatoryStatus !== 'all') {
        filteredData = filteredData.filter(
          (country) => country.regulatoryStatus === filters.regulatoryStatus
        );
      }

      setData(filteredData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.region, filters?.regulatoryStatus]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return { data, isLoading, error, refetch: fetchCountries };
}

export function useCountryDetail(isoCode: string): UseApiResult<CountryDetail> {
  const [data, setData] = useState<CountryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const detail = mockCountryDetails[isoCode];
      if (detail) {
        setData(detail);
        setError(null);
      } else {
        // Create basic detail from country list
        const country = mockCountries.find((c) => c.isoCode === isoCode);
        if (country) {
          setData({
            ...country,
            events: [],
            keyFrameworks: [],
          });
          setError(null);
        } else {
          throw new Error(`Country not found: ${isoCode}`);
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isoCode]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, isLoading, error, refetch: fetchDetail };
}

