import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders null when data is empty', () => {
    const { container } = render(<Sparkline data={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders null when data has less than 2 points', () => {
    const { container } = render(<Sparkline data={[5]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders SVG element with valid data', () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with default dimensions', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '80');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders with custom dimensions', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} width={100} height={30} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '30');
  });

  it('renders polyline for the line', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
    expect(polyline).toHaveAttribute('fill', 'none');
  });

  it('renders path for filled area', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('renders end dot circle', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const circle = container.querySelector('circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute('r', '2');
  });

  it('applies custom color', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} color="#ff0000" />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke', '#ff0000');
  });

  it('applies custom stroke width', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} strokeWidth={3} />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke-width', '3');
  });

  it('applies custom className', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} className="custom-class" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('shows green color for positive trend with auto color', () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} color="auto" />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke', '#4A9D6E'); // green
  });

  it('shows red color for negative trend with auto color', () => {
    const { container } = render(<Sparkline data={[5, 4, 3, 2, 1]} color="auto" />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke', '#C0524E'); // red
  });

  it('renders gradient definition', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const linearGradient = container.querySelector('linearGradient');
    expect(linearGradient).toBeInTheDocument();
  });

  it('has correct viewBox', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} width={100} height={50} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 50');
  });

  it('polyline has rounded line caps', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke-linecap', 'round');
    expect(polyline).toHaveAttribute('stroke-linejoin', 'round');
  });
});
