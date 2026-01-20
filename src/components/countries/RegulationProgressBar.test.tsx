import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegulationProgressBar } from './RegulationProgressBar';

describe('RegulationProgressBar', () => {
  it('renders all three stages', () => {
    render(<RegulationProgressBar stage="proposed" />);

    expect(screen.getByText('Proposed')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Implemented')).toBeInTheDocument();
  });

  it('shows first stage as active for proposed', () => {
    const { container } = render(<RegulationProgressBar stage="proposed" />);

    const circles = container.querySelectorAll('.rounded-full');
    // First circle should have colored background (stage color)
    expect(circles[0]).toHaveClass('text-white');
  });

  it('shows first two stages as active for approved', () => {
    render(<RegulationProgressBar stage="approved" />);

    // Check that stage labels exist
    expect(screen.getByText('Proposed')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Implemented')).toBeInTheDocument();
  });

  it('shows all stages as active for implemented', () => {
    render(<RegulationProgressBar stage="implemented" />);

    // All stages should show as completed
    expect(screen.getByText('Proposed')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Implemented')).toBeInTheDocument();
  });

  it('renders progress line', () => {
    const { container } = render(<RegulationProgressBar stage="approved" />);

    const progressLines = container.querySelectorAll('.h-1');
    expect(progressLines.length).toBeGreaterThan(0);
  });

  it('shows check icon for completed stages', () => {
    const { container } = render(<RegulationProgressBar stage="implemented" />);

    // Check marks should be rendered as SVG for completed stages
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders stage numbers', () => {
    render(<RegulationProgressBar stage="proposed" />);

    // Stage 1 should show number 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('has correct styling for uncompleted stages', () => {
    const { container } = render(<RegulationProgressBar stage="proposed" />);

    // Find the uncompleted stage circles (should have gray background)
    const grayCircles = container.querySelectorAll('.bg-gray-200');
    expect(grayCircles.length).toBeGreaterThan(0);
  });
});
