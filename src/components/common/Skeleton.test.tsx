import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  SkeletonKpiCard,
  SkeletonChart,
  SkeletonPieChart,
  SkeletonHeadlineList,
  SkeletonBarChart,
  SkeletonCountryDetail,
  SkeletonCanadaPage,
} from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('bg-gray-200', 'animate-pulse', 'rounded-md');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('custom-class');
  });

  it('applies width as pixel value when number', () => {
    const { container } = render(<Skeleton width={100} />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: '100px' });
  });

  it('applies width as string value', () => {
    const { container } = render(<Skeleton width="50%" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: '50%' });
  });

  it('applies height as pixel value when number', () => {
    const { container } = render(<Skeleton height={50} />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ height: '50px' });
  });

  it('applies rounded none', () => {
    const { container } = render(<Skeleton rounded="none" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-none');
  });

  it('applies rounded sm', () => {
    const { container } = render(<Skeleton rounded="sm" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-sm');
  });

  it('applies rounded lg', () => {
    const { container } = render(<Skeleton rounded="lg" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies rounded full', () => {
    const { container } = render(<Skeleton rounded="full" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full');
  });
});

describe('SkeletonKpiCard', () => {
  it('renders with sparkline by default', () => {
    const { container } = render(<SkeletonKpiCard />);

    expect(container.firstChild).toBeInTheDocument();
    // Should have multiple skeleton elements for the KPI structure
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('renders without sparkline when showSparkline is false', () => {
    const { container } = render(<SkeletonKpiCard showSparkline={false} />);

    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('SkeletonChart', () => {
  it('renders chart skeleton', () => {
    const { container } = render(<SkeletonChart />);

    expect(container.firstChild).toBeInTheDocument();
    // Should have the chart container with relative positioning
    const chartArea = container.querySelector('.relative');
    expect(chartArea).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(<SkeletonChart height={400} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders chart bars', () => {
    const { container } = render(<SkeletonChart />);

    // Should have 12 bar placeholders
    const bars = container.querySelectorAll('.flex-1.bg-gray-200');
    expect(bars).toHaveLength(12);
  });
});

describe('SkeletonPieChart', () => {
  it('renders pie chart skeleton', () => {
    const { container } = render(<SkeletonPieChart />);

    expect(container.firstChild).toBeInTheDocument();
    // Should have a rounded-full element for the pie
    const circle = container.querySelector('.rounded-full');
    expect(circle).toBeInTheDocument();
  });

  it('renders legend items', () => {
    const { container } = render(<SkeletonPieChart />);

    // Should have 5 legend items with rounded-full indicators
    const legendCircles = container.querySelectorAll('.rounded-full');
    expect(legendCircles.length).toBeGreaterThanOrEqual(5);
  });
});

describe('SkeletonHeadlineList', () => {
  it('renders 4 items by default', () => {
    const { container } = render(<SkeletonHeadlineList />);

    const items = container.querySelectorAll('.divide-y > div');
    expect(items).toHaveLength(4);
  });

  it('renders custom count of items', () => {
    const { container } = render(<SkeletonHeadlineList count={6} />);

    const items = container.querySelectorAll('.divide-y > div');
    expect(items).toHaveLength(6);
  });
});

describe('SkeletonBarChart', () => {
  it('renders bar chart skeleton', () => {
    const { container } = render(<SkeletonBarChart />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders 8 bar rows', () => {
    const { container } = render(<SkeletonBarChart />);

    const barRows = container.querySelectorAll('.space-y-4 > div');
    expect(barRows).toHaveLength(8);
  });
});

describe('SkeletonCountryDetail', () => {
  it('renders country detail skeleton', () => {
    const { container } = render(<SkeletonCountryDetail />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders timeline items', () => {
    const { container } = render(<SkeletonCountryDetail />);

    // Should have timeline items
    const timelineItems = container.querySelectorAll('.border-b.border-gray-100');
    expect(timelineItems.length).toBeGreaterThan(0);
  });
});

describe('SkeletonCanadaPage', () => {
  it('renders Canada page skeleton', () => {
    const { container } = render(<SkeletonCanadaPage />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders 3 company profile card placeholders', () => {
    const { container } = render(<SkeletonCanadaPage />);

    // First grid should have 3 company cards
    const companyCards = container.querySelectorAll('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div');
    expect(companyCards).toHaveLength(3);
  });
});

