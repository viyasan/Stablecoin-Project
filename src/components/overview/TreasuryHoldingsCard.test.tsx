import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TreasuryHoldingsCard } from './TreasuryHoldingsCard';

describe('TreasuryHoldingsCard', () => {
  it('renders the card title', () => {
    render(<TreasuryHoldingsCard />);

    expect(screen.getByText('US Treasury Holdings')).toBeInTheDocument();
  });

  it('displays combined stablecoin holdings', () => {
    render(<TreasuryHoldingsCard />);

    expect(screen.getByText(/Combined Stablecoin Holdings/i)).toBeInTheDocument();
    // Tether $141B + Circle $46B = $187B
    expect(screen.getByText('$187B')).toBeInTheDocument();
  });

  it('displays top foreign holders with rankings', () => {
    render(<TreasuryHoldingsCard />);

    // Japan should be first ($1225.3B = $1.23T)
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('$1.23T')).toBeInTheDocument();
  });

  it('displays country flags', () => {
    render(<TreasuryHoldingsCard />);

    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
  });

  it('displays Tether and Circle as stablecoin holders', () => {
    render(<TreasuryHoldingsCard />);

    expect(screen.getByText('Tether (USDT)')).toBeInTheDocument();
    expect(screen.getByText('Circle (USDC)')).toBeInTheDocument();
  });

  it('includes TIC data source link', () => {
    render(<TreasuryHoldingsCard />);

    const sourceLink = screen.getByRole('link', { name: /source: jan 2026 tic/i });
    expect(sourceLink).toHaveAttribute('href', expect.stringContaining('ticdata.treasury.gov'));
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });

  it('shows global rank numbers', () => {
    render(<TreasuryHoldingsCard />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#17')).toBeInTheDocument(); // Tether
    expect(screen.getByText('#30')).toBeInTheDocument(); // Circle
  });
});
