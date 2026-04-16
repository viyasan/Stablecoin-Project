import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QuickInsightsCarousel } from './QuickInsightsCarousel';

// Flip half-duration matches the component's FLIP_HALF_DURATION (250ms)
const FLIP_DELAY = 250;

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

    // Advance past flip animation delay
    act(() => {
      vi.advanceTimersByTime(FLIP_DELAY);
    });

    // Second insight should now be visible
    expect(screen.getByText(/Ethereum and Tron blockchains host over 80%/i)).toBeInTheDocument();
  });

  it('navigates to previous insight when clicking previous button', () => {
    render(<QuickInsightsCarousel />);

    // Go to second insight first
    const nextButton = screen.getByLabelText(/next insight/i);
    fireEvent.click(nextButton);
    act(() => {
      vi.advanceTimersByTime(FLIP_DELAY);
    });

    // Then go back
    const prevButton = screen.getByLabelText(/previous insight/i);
    fireEvent.click(prevButton);
    act(() => {
      vi.advanceTimersByTime(FLIP_DELAY);
    });

    // First insight should be visible again
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('wraps around when navigating past the last insight', () => {
    render(<QuickInsightsCarousel />);

    const nextButton = screen.getByLabelText(/next insight/i);

    // Click through all 5 insights to wrap back to first
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
      act(() => {
        vi.advanceTimersByTime(FLIP_DELAY);
      });
    }

    // Should wrap back to first insight
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();
  });

  it('auto-rotates every 6 seconds', () => {
    render(<QuickInsightsCarousel />);

    // Initial insight
    expect(screen.getByText(/USDT and USDC together control/i)).toBeInTheDocument();

    // Advance timer by 6 seconds (auto-rotate interval) + flip delay
    act(() => {
      vi.advanceTimersByTime(6000 + FLIP_DELAY);
    });

    // Should now show second insight
    expect(screen.getByText(/Ethereum and Tron blockchains host over 80%/i)).toBeInTheDocument();
  });

  it('pauses auto-rotation on hover', () => {
    render(<QuickInsightsCarousel />);

    const carousel = screen.getByText(/Quick Market Insights/i).closest('div');

    // Hover over carousel
    fireEvent.mouseEnter(carousel!);

    // Advance timer well past auto-rotate interval
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

    // Advance timer by 6 seconds + flip delay
    act(() => {
      vi.advanceTimersByTime(6000 + FLIP_DELAY);
    });

    // Should now show second insight
    expect(screen.getByText(/Ethereum and Tron blockchains host over 80%/i)).toBeInTheDocument();
  });

  it('shows dot indicators for each insight', () => {
    render(<QuickInsightsCarousel />);

    // Should have 5 dot buttons (one for each insight)
    const dots = screen.getAllByRole('button', { name: /go to insight/i });
    expect(dots).toHaveLength(5);
  });

  it('navigates to specific insight when clicking dot', () => {
    render(<QuickInsightsCarousel />);

    // Click on the third dot (index 2 = third insight about 250 stablecoins)
    const dots = screen.getAllByRole('button', { name: /go to insight/i });
    fireEvent.click(dots[2]);

    act(() => {
      vi.advanceTimersByTime(FLIP_DELAY);
    });

    // Third insight should be visible
    expect(screen.getByText(/over 360\+ stablecoins/i)).toBeInTheDocument();
  });
});
