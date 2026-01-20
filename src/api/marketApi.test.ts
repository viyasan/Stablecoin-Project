import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStablecoinReserves, useMarketSummary, useChainBreakdown } from './marketApi';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useStablecoinReserves', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => useStablecoinReserves());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('returns USDT and USDC data on success', async () => {
    const mockResponse = {
      peggedAssets: [
        { symbol: 'USDT', circulating: { peggedUSD: 143000000000 } },
        { symbol: 'USDC', circulating: { peggedUSD: 52000000000 } },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useStablecoinReserves());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).not.toBe(null);
    expect(result.current.data?.usdt.marketCap).toBe(143000000000);
    expect(result.current.data?.usdc.marketCap).toBe(52000000000);
    expect(result.current.data?.usdt.symbol).toBe('USDT');
    expect(result.current.data?.usdc.symbol).toBe('USDC');
  });

  it('returns error on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useStablecoinReserves());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('includes reserve percentages from attestations', async () => {
    const mockResponse = {
      peggedAssets: [
        { symbol: 'USDT', circulating: { peggedUSD: 143000000000 } },
        { symbol: 'USDC', circulating: { peggedUSD: 52000000000 } },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useStablecoinReserves());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // USDT should have 78% treasury percentage
    expect(result.current.data?.usdt.usTreasuryPercentage).toBe(78);
    // USDC should have 32% treasury percentage
    expect(result.current.data?.usdc.usTreasuryPercentage).toBe(32);
  });
});

describe('useMarketSummary', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns total market cap from all stablecoins', async () => {
    const mockStablecoins = {
      peggedAssets: [
        { circulating: { peggedUSD: 143000000000 }, circulatingPrevDay: { peggedUSD: 142000000000 } },
        { circulating: { peggedUSD: 52000000000 }, circulatingPrevDay: { peggedUSD: 51500000000 } },
        { circulating: { peggedUSD: 5000000000 }, circulatingPrevDay: { peggedUSD: 4900000000 } },
      ],
    };

    const mockCharts = [
      { date: '1700000000', totalCirculatingUSD: { peggedUSD: 200000000000 } },
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockStablecoins) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCharts) });

    const { result } = renderHook(() => useMarketSummary());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.totalMarketCap).toBe(200000000000);
    expect(result.current.data?.trackedStablecoins).toBe(3);
  });

  it('calculates 24h change correctly', async () => {
    const mockStablecoins = {
      peggedAssets: [
        { circulating: { peggedUSD: 100000000000 }, circulatingPrevDay: { peggedUSD: 99000000000 } },
      ],
    };

    const mockCharts = [
      { date: '1700000000', totalCirculatingUSD: { peggedUSD: 100000000000 } },
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockStablecoins) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCharts) });

    const { result } = renderHook(() => useMarketSummary());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 1% increase: (100B - 99B) / 99B * 100 = 1.01%
    expect(result.current.data?.change24h).toBeCloseTo(1.01, 1);
  });
});

describe('useChainBreakdown', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns chains sorted by circulating value', async () => {
    const mockChains = [
      { name: 'Tron', totalCirculatingUSD: { peggedUSD: 60000000000 } },
      { name: 'Ethereum', totalCirculatingUSD: { peggedUSD: 80000000000 } },
      { name: 'Solana', totalCirculatingUSD: { peggedUSD: 5000000000 } },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChains),
    });

    const { result } = renderHook(() => useChainBreakdown());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.[0].name).toBe('Ethereum');
    expect(result.current.data?.[1].name).toBe('Tron');
    expect(result.current.data?.[2].name).toBe('Solana');
  });

  it('normalizes chain names', async () => {
    const mockChains = [
      { name: 'Hyperliquid L1', totalCirculatingUSD: { peggedUSD: 1000000000 } },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChains),
    });

    const { result } = renderHook(() => useChainBreakdown());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.[0].name).toBe('Hyperliquid');
  });
});
