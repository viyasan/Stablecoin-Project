import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GlobalKpiCard } from './GlobalKpiCard';

// Mock the API hooks
vi.mock('../../api', () => ({
  useMarketSummary: vi.fn(),
  useStablecoinList: vi.fn(),
  useMarketCapChart: vi.fn(),
}));

import { useMarketSummary, useStablecoinList, useMarketCapChart } from '../../api';

const mockUseMarketSummary = useMarketSummary as ReturnType<typeof vi.fn>;
const mockUseStablecoinList = useStablecoinList as ReturnType<typeof vi.fn>;
const mockUseMarketCapChart = useMarketCapChart as ReturnType<typeof vi.fn>;

const mockMarketData = {
  totalMarketCap: 234000000000,
  change7d: 2.5,
  change30d: 5.2,
  trackedStablecoins: 145,
  lastUpdated: '2026-01-15T10:30:00Z',
};

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <GlobalKpiCard />
    </MemoryRouter>
  );
};

describe('GlobalKpiCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStablecoinList.mockReturnValue({ data: null });
    mockUseMarketCapChart.mockReturnValue({ data: [] });
  });

  it('shows loading skeleton while fetching data', () => {
    mockUseMarketSummary.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = renderComponent();

    // Should show skeleton loader
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state on fetch failure', () => {
    mockUseMarketSummary.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed'),
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Failed to load market data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls refetch when try again is clicked', () => {
    const refetch = vi.fn();
    mockUseMarketSummary.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed'),
      refetch,
    });

    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders market cap data', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Global Stablecoin Market')).toBeInTheDocument();
    expect(screen.getByText('$234.0B')).toBeInTheDocument();
  });

  it('renders tracked assets count', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Tracked Assets')).toBeInTheDocument();
    expect(screen.getByText('145')).toBeInTheDocument();
  });

  it('renders view mode toggle buttons', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7D Change' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30D Change' })).toBeInTheDocument();
  });

  it('shows total view by default', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Total Market Cap')).toBeInTheDocument();
  });

  it('switches to 7D view when clicked', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: '7D Change' }));
    expect(screen.getByText('Market Cap (7 days ago)')).toBeInTheDocument();
  });

  it('switches to 30D view when clicked', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: '30D Change' }));
    expect(screen.getByText('Market Cap (30 days ago)')).toBeInTheDocument();
  });

  it('renders DefiLlama attribution link', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    const link = screen.getByRole('link', { name: 'DefiLlama' });
    expect(link).toHaveAttribute('href', 'https://defillama.com/');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders last updated timestamp', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText(/last updated/i)).toBeInTheDocument();
  });

  it('shows percentage change with color coding', () => {
    mockUseMarketSummary.mockReturnValue({
      data: mockMarketData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseMarketCapChart.mockReturnValue({
      data: [
        { totalMarketCap: 230000000000 },
        { totalMarketCap: 234000000000 },
      ],
    });

    renderComponent();

    expect(screen.getByText('+5.20% (30d)')).toBeInTheDocument();
  });
});
