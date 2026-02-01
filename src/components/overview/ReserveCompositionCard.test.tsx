import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReserveCompositionCard } from './ReserveCompositionCard';

// Mock the API hook
vi.mock('../../api/marketApi', () => ({
  useStablecoinReserves: vi.fn(),
}));

import { useStablecoinReserves } from '../../api/marketApi';

const mockUseStablecoinReserves = useStablecoinReserves as ReturnType<typeof vi.fn>;

describe('ReserveCompositionCard', () => {
  beforeEach(() => {
    mockUseStablecoinReserves.mockReset();
  });

  it('shows loading spinner while fetching data', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    // Should show a loading indicator (Loader2 component has animate-spin class)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows error message on fetch failure', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('displays USDT data by default', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to',
          treasuryHoldings: 135000000000,
          assets: [
            { name: 'US Treasuries', percentage: 78, color: '#3B82F6' },
            { name: 'Reverse Repos', percentage: 11, color: '#60A5FA' },
          ],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          treasuryHoldings: 62000000000,
          assets: [
            { name: 'US Treasuries', percentage: 32, color: '#3B82F6' },
          ],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    // Should show USDT total supply
    expect(screen.getByText('$143B')).toBeInTheDocument();
    expect(screen.getByText('US Treasuries')).toBeInTheDocument();
  });

  it('switches to USDC data when toggle clicked', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to',
          treasuryHoldings: 135000000000,
          assets: [
            { name: 'US Treasuries', percentage: 78, color: '#3B82F6' },
          ],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          treasuryHoldings: 62000000000,
          assets: [
            { name: 'US Treasuries', percentage: 80, color: '#3B82F6' },
            { name: 'Cash & Bank Deposits', percentage: 20, color: '#10B981' },
          ],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    // Click USDC toggle
    const usdcButton = screen.getByRole('button', { name: /usdc/i });
    fireEvent.click(usdcButton);

    // Should now show USDC data
    expect(screen.getByText('$52B')).toBeInTheDocument();
    expect(screen.getByText('Cash & Bank Deposits')).toBeInTheDocument();
  });

  it('displays treasury percentage insight', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to',
          treasuryHoldings: 135000000000,
          assets: [
            { name: 'US Treasuries', percentage: 75, color: '#3B82F6' },
          ],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          treasuryHoldings: 62000000000,
          assets: [
            { name: 'US Treasuries', percentage: 80, color: '#3B82F6' },
          ],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    expect(screen.getByText(/75% in US Treasuries/)).toBeInTheDocument();
  });

  it('displays source link', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to/en/transparency/',
          treasuryHoldings: 135000000000,
          assets: [
            { name: 'US Treasuries', percentage: 75, color: '#3B82F6' },
          ],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          treasuryHoldings: 62000000000,
          assets: [
            { name: 'US Treasuries', percentage: 80, color: '#3B82F6' },
          ],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    const sourceLink = screen.getByRole('link', { name: /source: q3 2025/i });
    expect(sourceLink).toHaveAttribute('href', 'https://tether.to/en/transparency/');
  });
});
