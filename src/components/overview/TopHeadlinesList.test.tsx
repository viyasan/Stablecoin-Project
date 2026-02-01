import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TopHeadlinesList } from './TopHeadlinesList';

// Mock the API hook
vi.mock('../../api', () => ({
  useTopHeadlines: vi.fn(),
}));

import { useTopHeadlines } from '../../api';

const mockUseTopHeadlines = useTopHeadlines as ReturnType<typeof vi.fn>;

const mockHeadlines = [
  {
    id: '1',
    title: 'First headline about USDT',
    url: 'https://example.com/1',
    publishedAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
    assetSymbols: ['USDT', 'USDC'],
    topics: ['regulation'],
    source: 'CoinDesk',
  },
  {
    id: '2',
    title: 'Second headline about stablecoins',
    url: 'https://example.com/2',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    assetSymbols: ['DAI'],
    topics: ['payments'],
    source: 'CoinTelegraph',
  },
];

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <TopHeadlinesList />
    </MemoryRouter>
  );
};

describe('TopHeadlinesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton while fetching data', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = renderComponent();

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state on fetch failure', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed'),
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Failed to load headlines')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls refetch when try again is clicked', () => {
    const refetch = vi.fn();
    mockUseTopHeadlines.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed'),
      refetch,
    });

    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders headlines list', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText("Today's Top Headlines")).toBeInTheDocument();
    expect(screen.getByText('First headline about USDT')).toBeInTheDocument();
    expect(screen.getByText('Second headline about stablecoins')).toBeInTheDocument();
  });

  it('renders time ago for headlines', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('30m ago')).toBeInTheDocument();
    expect(screen.getByText('3h ago')).toBeInTheDocument();
  });

  it('renders asset badges', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('DAI')).toBeInTheDocument();
  });

  it('renders topic tags', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Regulation')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('renders view all news link', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    const link = screen.getByRole('link', { name: /view all news/i });
    expect(link).toHaveAttribute('href', '/news');
  });

  it('shows empty state when no headlines', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('No headlines available')).toBeInTheDocument();
  });

  it('headline links open in new tab', () => {
    mockUseTopHeadlines.mockReturnValue({
      data: mockHeadlines,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    const headlineLink = screen.getByRole('link', { name: /first headline/i });
    expect(headlineLink).toHaveAttribute('target', '_blank');
    expect(headlineLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
