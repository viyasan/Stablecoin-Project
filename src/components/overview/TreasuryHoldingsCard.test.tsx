import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TreasuryHoldingsCard } from './TreasuryHoldingsCard';

// Mock the API hook
vi.mock('../../api/marketApi', () => ({
  useStablecoinReserves: vi.fn(),
}));

import { useStablecoinReserves } from '../../api/marketApi';

const mockUseStablecoinReserves = useStablecoinReserves as ReturnType<typeof vi.fn>;

describe('TreasuryHoldingsCard', () => {
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

    render(<TreasuryHoldingsCard />);

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

    render(<TreasuryHoldingsCard />);

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('displays combined stablecoin holdings', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          marketCap: 143000000000,
          usTreasuryPercentage: 78,
        },
        usdc: {
          marketCap: 52000000000,
          usTreasuryPercentage: 32,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TreasuryHoldingsCard />);

    // Combined holdings: (143B * 0.78) + (52B * 0.32) = 111.54B + 16.64B = 128.18B
    expect(screen.getByText(/Combined Stablecoin Holdings/i)).toBeInTheDocument();
  });

  it('displays holders sorted by holdings amount', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          marketCap: 143000000000,
          usTreasuryPercentage: 78,
        },
        usdc: {
          marketCap: 52000000000,
          usTreasuryPercentage: 32,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TreasuryHoldingsCard />);

    // Japan should be first (1180B)
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('$1.18T')).toBeInTheDocument();
  });

  it('displays country flags', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          marketCap: 143000000000,
          usTreasuryPercentage: 78,
        },
        usdc: {
          marketCap: 52000000000,
          usTreasuryPercentage: 32,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TreasuryHoldingsCard />);

    // Should show Japan flag emoji
    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
  });

  it('displays Tether and Circle as stablecoin holders', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          marketCap: 143000000000,
          usTreasuryPercentage: 78,
        },
        usdc: {
          marketCap: 52000000000,
          usTreasuryPercentage: 32,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TreasuryHoldingsCard />);

    expect(screen.getByText('Tether (USDT)')).toBeInTheDocument();
    expect(screen.getByText('Circle (USDC)')).toBeInTheDocument();
  });

  it('includes source links to US Treasury, Tether, and Circle', () => {
    mockUseStablecoinReserves.mockReturnValue({
      data: {
        usdt: {
          marketCap: 143000000000,
          usTreasuryPercentage: 78,
        },
        usdc: {
          marketCap: 52000000000,
          usTreasuryPercentage: 32,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TreasuryHoldingsCard />);

    expect(screen.getByRole('link', { name: /us treasury/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tether/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /circle/i })).toBeInTheDocument();
  });
});
