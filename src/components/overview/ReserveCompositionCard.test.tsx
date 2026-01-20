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
          usTreasuryPercentage: 78,
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
          usTreasuryPercentage: 32,
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
          usTreasuryPercentage: 78,
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
          usTreasuryPercentage: 32,
          assets: [
            { name: 'Treasury Repos', percentage: 53, color: '#3B82F6' },
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
    expect(screen.getByText('Treasury Repos')).toBeInTheDocument();
  });

  it('displays government exposure percentage', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to',
          usTreasuryPercentage: 78,
          assets: [],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          usTreasuryPercentage: 32,
          assets: [],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    // Should show 89% government backed for USDT (78 + 11)
    expect(screen.getByText(/89% US Government Backed/)).toBeInTheDocument();
  });

  it('displays attestation source link', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          name: 'Tether',
          symbol: 'USDT',
          marketCap: 143000000000,
          lastUpdated: 'Q3 2025',
          sourceUrl: 'https://tether.to/en/transparency/',
          usTreasuryPercentage: 78,
          assets: [],
        },
        usdc: {
          name: 'Circle',
          symbol: 'USDC',
          marketCap: 52000000000,
          lastUpdated: 'Dec 2025',
          sourceUrl: 'https://circle.com',
          usTreasuryPercentage: 32,
          assets: [],
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ReserveCompositionCard />);

    const attestationLink = screen.getByRole('link', { name: /view attestation/i });
    expect(attestationLink).toHaveAttribute('href', 'https://tether.to/en/transparency/');
  });
});
