import { useState, useEffect, useCallback } from 'react';

// Dune API base URL
const DUNE_API_BASE = 'https://api.dune.com/api/v1';

// Get API key from environment
const getApiKey = () => import.meta.env.VITE_DUNE_API_KEY || '';

// Dune query IDs for stablecoin metrics
// These queries should return daily metrics for stablecoins across all chains
// Users need to create these queries in Dune or use existing community queries
const QUERY_IDS = {
  // Query should return: date, transfer_volume (in USD)
  TRANSFER_VOLUME: import.meta.env.VITE_DUNE_TRANSFER_VOLUME_QUERY_ID || '',
  // Query should return: date, transaction_count
  TRANSACTION_COUNT: import.meta.env.VITE_DUNE_TRANSACTION_COUNT_QUERY_ID || '',
  // Query should return: date, active_addresses
  ACTIVE_ADDRESSES: import.meta.env.VITE_DUNE_ACTIVE_ADDRESSES_QUERY_ID || '',
};

// Types for Dune API responses
interface DuneExecutionResponse {
  execution_id: string;
  state: 'QUERY_STATE_PENDING' | 'QUERY_STATE_EXECUTING' | 'QUERY_STATE_COMPLETED' | 'QUERY_STATE_FAILED';
}

interface DuneResultRow {
  date?: string;
  transfer_volume?: number;
  transaction_count?: number;
  active_addresses?: number;
  [key: string]: string | number | undefined;
}

interface DuneResultsResponse {
  execution_id: string;
  query_id: number;
  state: string;
  result?: {
    rows: DuneResultRow[];
  };
}

// Aggregated stablecoin metrics
export interface StablecoinTransactionMetrics {
  // Transfer volume (USD)
  transferVolume: number;
  transferVolumeChange24h: number;
  // Adjusted transfer volume (same as regular for Dune)
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

// Execute a Dune query
async function executeQuery(queryId: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Dune API key not configured');
  }

  const response = await fetch(`${DUNE_API_BASE}/query/${queryId}/execute`, {
    method: 'POST',
    headers: {
      'X-DUNE-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Dune API error: ${response.status} ${response.statusText}`);
  }

  const data: DuneExecutionResponse = await response.json();
  return data.execution_id;
}

// Poll for query results
async function getQueryResults(executionId: string, maxRetries = 30): Promise<DuneResultRow[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Dune API key not configured');
  }

  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${DUNE_API_BASE}/execution/${executionId}/results`, {
      headers: {
        'X-DUNE-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Dune API error: ${response.status} ${response.statusText}`);
    }

    const data: DuneResultsResponse = await response.json();

    if (data.state === 'QUERY_STATE_COMPLETED' && data.result?.rows) {
      return data.result.rows;
    }

    if (data.state === 'QUERY_STATE_FAILED') {
      throw new Error('Query execution failed');
    }

    // Wait 2 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Query execution timed out');
}

// Execute query and get results
async function fetchMetricFromQuery(queryId: string): Promise<DuneResultRow[]> {
  if (!queryId) {
    return [];
  }

  const executionId = await executeQuery(queryId);
  const results = await getQueryResults(executionId);

  // Sort by date descending (most recent first)
  return results.sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  });
}

// Calculate latest value and 24h change from time series
function calculateMetricWithChange(
  rows: DuneResultRow[],
  field: keyof DuneResultRow
): { value: number; change: number } {
  if (rows.length === 0) {
    return { value: 0, change: 0 };
  }

  const latest = rows[0];
  const previous = rows.length > 1 ? rows[1] : latest;

  const latestValue = typeof latest[field] === 'number' ? latest[field] : 0;
  const previousValue = typeof previous[field] === 'number' ? previous[field] : 0;

  const change = previousValue > 0
    ? ((latestValue - previousValue) / previousValue) * 100
    : 0;

  return { value: latestValue, change };
}

// Fetch all stablecoin transaction metrics
async function fetchStablecoinTransactionMetrics(): Promise<StablecoinTransactionMetrics> {
  // Check if all query IDs are configured
  if (!QUERY_IDS.TRANSFER_VOLUME || !QUERY_IDS.TRANSACTION_COUNT || !QUERY_IDS.ACTIVE_ADDRESSES) {
    throw new Error(
      'Dune query IDs not configured. Please set VITE_DUNE_TRANSFER_VOLUME_QUERY_ID, ' +
      'VITE_DUNE_TRANSACTION_COUNT_QUERY_ID, and VITE_DUNE_ACTIVE_ADDRESSES_QUERY_ID in your .env file.'
    );
  }

  // Fetch all metrics in parallel
  const [transferVolumeRows, transactionCountRows, activeAddressesRows] = await Promise.all([
    fetchMetricFromQuery(QUERY_IDS.TRANSFER_VOLUME),
    fetchMetricFromQuery(QUERY_IDS.TRANSACTION_COUNT),
    fetchMetricFromQuery(QUERY_IDS.ACTIVE_ADDRESSES),
  ]);

  const transferVolume = calculateMetricWithChange(transferVolumeRows, 'transfer_volume');
  const transactionCount = calculateMetricWithChange(transactionCountRows, 'transaction_count');
  const activeAddresses = calculateMetricWithChange(activeAddressesRows, 'active_addresses');

  return {
    transferVolume: transferVolume.value,
    transferVolumeChange24h: transferVolume.change,
    // For Dune, we use the same transfer volume for both regular and adjusted
    adjustedTransferVolume: transferVolume.value,
    adjustedTransferVolumeChange24h: transferVolume.change,
    transactionCount: transactionCount.value,
    transactionCountChange24h: transactionCount.change,
    dailyActiveUsers: activeAddresses.value,
    dailyActiveUsersChange24h: activeAddresses.change,
    lastUpdated: new Date().toISOString(),
    dataSource: 'Dune',
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
      setError(
        new Error(
          'Dune API key not configured. Add VITE_DUNE_API_KEY to your .env file.'
        )
      );
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

// Check if Dune API is configured
export function isDuneConfigured(): boolean {
  return Boolean(getApiKey());
}
