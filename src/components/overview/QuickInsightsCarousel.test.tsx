import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QuickInsightsCarousel } from './QuickInsightsCarousel';

describe('QuickInsightsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the carousel with initial insight', () => {
    render(<QuickInsightsCarousel />);

    expect(screen.getByText(/Quick Market Insights/i)).toBeInTheDocument();
    // First insight should be visible
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    render(<QuickInsightsCarousel />);

    expect(screen.getByLabelText(/previous insight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next insight/i)).toBeInTheDocument();
  });

  it('navigates to next insight when clicking next button', () => {
    render(<QuickInsightsCarousel />);

    const nextButton = screen.getByLabelText(/next insight/i);
    fireEvent.click(nextButton);

    // Second insight should now be visible
    expect(screen.getByText(/Ethereum and Tron host over 80%/i)).toBeInTheDocument();
  });

  it('navigates to previous insight when clicking previous button', () => {
    render(<QuickInsightsCarousel />);

    // Go to second insight first
    const nextButton = screen.getByLabelText(/next insight/i);
    fireEvent.click(nextButton);

    // Then go back
    const prevButton = screen.getByLabelText(/previous insight/i);
    fireEvent.click(prevButton);

    // First insight should be visible again
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('wraps around when navigating past the last insight', () => {
    render(<QuickInsightsCarousel />);

    const nextButton = screen.getByLabelText(/next insight/i);

    // Click through all insights (there are 7)
    for (let i = 0; i < 7; i++) {
      fireEvent.click(nextButton);
    }

    // Should wrap back to first insight
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('auto-rotates every 10 seconds', () => {
    render(<QuickInsightsCarousel />);

    // Initial insight
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();

    // Advance timer by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now show second insight
    expect(screen.getByText(/Ethereum and Tron host over 80%/i)).toBeInTheDocument();
  });

  it('pauses auto-rotation on hover', () => {
    render(<QuickInsightsCarousel />);

    const carousel = screen.getByText(/Quick Market Insights/i).closest('div');

    // Hover over carousel
    fireEvent.mouseEnter(carousel!);

    // Advance timer by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should still show first insight (paused)
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('resumes auto-rotation on mouse leave', () => {
    render(<QuickInsightsCarousel />);

    const carousel = screen.getByText(/Quick Market Insights/i).closest('div');

    // Hover and unhover
    fireEvent.mouseEnter(carousel!);
    fireEvent.mouseLeave(carousel!);

    // Advance timer by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now show second insight
    expect(screen.getByText(/Ethereum and Tron host over 80%/i)).toBeInTheDocument();
  });

  it('shows dot indicators for each insight', () => {
    render(<QuickInsightsCarousel />);

    // Should have 7 dot buttons (one for each insight)
    const dots = screen.getAllByRole('button', { name: /go to insight/i });
    expect(dots).toHaveLength(7);
  });

  it('navigates to specific insight when clicking dot', () => {
    render(<QuickInsightsCarousel />);

    // Click on the third dot
    const dots = screen.getAllByRole('button', { name: /go to insight/i });
    fireEvent.click(dots[2]); // 0-indexed, so index 2 is third insight

    // Third insight should be visible
    expect(screen.getByText(/\$33 trillion/i)).toBeInTheDocument();
  });
});
