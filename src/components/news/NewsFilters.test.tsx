import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewsFilters } from './NewsFilters';
import type { NewsFilters as NewsFiltersType } from '../../types';

describe('NewsFilters', () => {
  const defaultFilters: NewsFiltersType = {};
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByPlaceholderText('Search news...')).toBeInTheDocument();
  });

  it('renders topic filter pills', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: 'All Topics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regulation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Payments' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Infrastructure' })).toBeInTheDocument();
  });

  it('renders More button to expand filters', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  it('expands to show more filters when More is clicked', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    expect(screen.getByText('More Topics')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
  });

  it('shows source filters when expanded', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    expect(screen.getByRole('button', { name: 'All Sources' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CoinDesk' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CoinTelegraph' })).toBeInTheDocument();
  });

  it('calls onFilterChange when topic is selected', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const regulationButton = screen.getByRole('button', { name: 'Regulation' });
    fireEvent.click(regulationButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ topic: 'regulation' });
  });

  it('calls onFilterChange with undefined when All Topics is selected', () => {
    render(
      <NewsFilters
        filters={{ topic: 'regulation' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const allTopicsButton = screen.getByRole('button', { name: 'All Topics' });
    fireEvent.click(allTopicsButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ topic: undefined });
  });

  it('calls onFilterChange when source is selected', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    // Expand to show sources
    fireEvent.click(screen.getByRole('button', { name: /more/i }));

    const coinDeskButton = screen.getByRole('button', { name: 'CoinDesk' });
    fireEvent.click(coinDeskButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ source: 'CoinDesk' });
  });

  it('shows active state for selected topic', () => {
    render(
      <NewsFilters
        filters={{ topic: 'regulation' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const regulationButton = screen.getByRole('button', { name: 'Regulation' });
    expect(regulationButton).toHaveClass('bg-primary-600', 'text-white');
  });

  it('shows active state for All Topics when no topic is selected', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const allTopicsButton = screen.getByRole('button', { name: 'All Topics' });
    expect(allTopicsButton).toHaveClass('bg-primary-600', 'text-white');
  });

  it('calls onFilterChange with search value after debounce', async () => {
    vi.useFakeTimers();
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText('Search news...');
    fireEvent.change(searchInput, { target: { value: 'USDT' } });

    // Fast forward debounce timer
    vi.advanceTimersByTime(300);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ search: 'USDT' });
    vi.useRealTimers();
  });

  it('shows clear button when search has value', () => {
    render(
      <NewsFilters
        filters={{ search: 'test' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    // The component uses internal state for search, so we need to type in the input
    const searchInput = screen.getByPlaceholderText('Search news...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Clear button should appear
    const clearButton = screen.getByRole('button', { name: '' }); // X icon button
    expect(clearButton).toBeInTheDocument();
  });

  it('shows Clear all button when filters are active', () => {
    render(
      <NewsFilters
        filters={{ topic: 'regulation' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('does not show Clear all button when no filters are active', () => {
    render(<NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  it('clears all filters when Clear all is clicked', () => {
    render(
      <NewsFilters
        filters={{ topic: 'regulation', source: 'CoinDesk' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const clearAllButton = screen.getByRole('button', { name: 'Clear all' });
    fireEvent.click(clearAllButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('has sticky positioning', () => {
    const { container } = render(
      <NewsFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />
    );

    const filterContainer = container.firstChild as HTMLElement;
    expect(filterContainer).toHaveClass('sticky', 'top-0', 'z-10');
  });
});
