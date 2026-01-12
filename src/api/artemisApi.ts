import { useState, useEffect, useCallback } from 'react';

// Artemis API base URL
const ARTEMIS_API_BASE = 'https://data-svc.artemisxyz.com/v2';

// Get API key from environment
const getApiKey = () => import.meta.env.VITE_ARTEMIS_API_KEY || '';

// Types for Artemis API responses
interface ArtemisDataPoint {
  date: string;
  val: number;
}

interface ArtemisMetricResponse {
  data: Record<string, Record<string, ArtemisDataPoint[]>>;
}

// Aggregated stablecoin metrics
export interface StablecoinTransactionMetrics {
  // Transfer volume (USD)
  transferVolume: number;
  transferVolumeChange24h: number;
  // Adjusted transfer volume (filtered for bots)
  adjustedTransferVolume: number;
  adjustedTransferVolumeChange24h: number;
  // Transaction count
  transactionCount: number;
  transactionCountChange24h: number;
  // Daily active users (unique addresses)
  dailyActiveUsers: number;
  dailyActiveUsersChange24h: number;
  // Metadata
  lastUpdated: string;
  dataSource: string;
}

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Fetch a single metric from Artemis API
async function fetchArtemisMetric(
  endpoint: string,
  symbols: string = 'all'
): Promise<ArtemisDataPoint[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Artemis API key not configured');
  }

  // Get last 7 days of data to calculate changes
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const params = new URLSearchParams({
    symbols,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    APIKey: apiKey,
  });

  const response = await fetch(`${ARTEMIS_API_BASE}/data/${endpoint}?${params}`);

  if (!response.ok) {
    throw new Error(`Artemis API error: ${response.status} ${response.statusText}`);
  }

  const data: ArtemisMetricResponse = await response.json();

  // Aggregate all chains/symbols into a single timeline
  const aggregated: Record<string, number> = {};

  for (const [, metrics] of Object.entries(data.data || {})) {
    const metricData = metrics[endpoint] || [];
    for (const point of metricData) {
      aggregated[point.date] = (aggregated[point.date] || 0) + point.val;
    }
  }

  // Convert to sorted array
  return Object.entries(aggregated)
    .map(([date, val]) => ({ date, val }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate latest value and 24h change from time series
function calculateMetricWithChange(data: ArtemisDataPoint[]): { value: number; change: number } {
  if (data.length === 0) {
    return { value: 0, change: 0 };
  }

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : latest;

  const change = previous.val > 0
    ? ((latest.val - previous.val) / previous.val) * 100
    : 0;

  return { value: latest.val, change };
}

// Fetch all stablecoin transaction metrics
async function fetchStablecoinTransactionMetrics(): Promise<StablecoinTransactionMetrics> {
  // Fetch all metrics in parallel
  const [
    transferVolumeData,
    adjustedTransferVolumeData,
    transactionCountData,
    dauData,
  ] = await Promise.all([
    fetchArtemisMetric('STABLECOIN_TRANSFER_VOLUME', 'all'),
    fetchArtemisMetric('ARTEMIS_STABLECOIN_TRANSFER_VOLUME', 'all'),
    fetchArtemisMetric('STABLECOIN_DAILY_TRANSACTIONS', 'all'),
    fetchArtemisMetric('STABLECOIN_DAU', 'all'),
  ]);

  const transferVolume = calculateMetricWithChange(transferVolumeData);
  const adjustedTransferVolume = calculateMetricWithChange(adjustedTransferVolumeData);
  const transactionCount = calculateMetricWithChange(transactionCountData);
  const dailyActiveUsers = calculateMetricWithChange(dauData);

  return {
    transferVolume: transferVolume.value,
    transferVolumeChange24h: transferVolume.change,
    adjustedTransferVolume: adjustedTransferVolume.value,
    adjustedTransferVolumeChange24h: adjustedTransferVolume.change,
    transactionCount: transactionCount.value,
    transactionCountChange24h: transactionCount.change,
    dailyActiveUsers: dailyActiveUsers.value,
    dailyActiveUsersChange24h: dailyActiveUsers.change,
    lastUpdated: new Date().toISOString(),
    dataSource: 'Artemis',
  };
}

// Hook result type
interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// React hook for fetching stablecoin transaction metrics
export function useStablecoinTransactionMetrics(): UseApiResult<StablecoinTransactionMetrics> {
  const [data, setData] = useState<StablecoinTransactionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const apiKey = getApiKey();

    // If no API key, set error but don't throw
    if (!apiKey) {
      setError(new Error('Artemis API key not configured. Add VITE_ARTEMIS_API_KEY to your .env file.'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const metrics = await fetchStablecoinTransactionMetrics();
      setData(metrics);
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

// Check if Artemis API is configured
export function isArtemisConfigured(): boolean {
  return Boolean(getApiKey());
}
