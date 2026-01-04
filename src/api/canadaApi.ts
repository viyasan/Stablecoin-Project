import { useState, useEffect, useCallback } from 'react';
import {
  canadianStablecoins,
  exchanges,
  timelineEvents,
  type CanadianStablecoin,
  type Exchange,
  type TimelineEvent,
} from '../data/canadianStablecoins';

// Re-export types for convenience
export type {
  CanadianStablecoin,
  Exchange,
  TimelineEvent,
  RegulatoryStep,
  StablecoinStatus,
  ParentCompany,
  CompanyTimelineEvent,
} from '../data/canadianStablecoins';

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch Canadian stablecoin data
 * Currently returns hardcoded data from config file
 * Future: Replace with Supabase API fetch
 */
export function useCanadianStablecoins(): UseApiResult<CanadianStablecoin[]> {
  const [data, setData] = useState<CanadianStablecoin[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay for realistic loading state
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Future: Replace with Supabase fetch
      // const { data, error } = await supabase.from('canadian_stablecoins').select('*');

      setData(canadianStablecoins);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook to fetch a single Canadian stablecoin by ID
 */
export function useCanadianStablecoin(id: string): UseApiResult<CanadianStablecoin | undefined> {
  const [data, setData] = useState<CanadianStablecoin | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stablecoin = canadianStablecoins.find((s) => s.id === id);
      setData(stablecoin);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook to fetch exchanges that support Canadian stablecoins
 */
export function useCanadianExchanges(stablecoinId?: string): UseApiResult<Exchange[]> {
  const [data, setData] = useState<Exchange[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      let filteredExchanges = exchanges;
      if (stablecoinId) {
        filteredExchanges = exchanges.filter((e) => e.stablecoins.includes(stablecoinId));
      }

      setData(filteredExchanges);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [stablecoinId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook to fetch Canadian stablecoin regulatory timeline
 */
export function useCanadianTimeline(stablecoinId?: string): UseApiResult<TimelineEvent[]> {
  const [data, setData] = useState<TimelineEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      let filteredEvents = timelineEvents;
      if (stablecoinId) {
        filteredEvents = timelineEvents.filter(
          (e) => !e.stablecoinId || e.stablecoinId === stablecoinId
        );
      }

      setData(filteredEvents);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [stablecoinId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
