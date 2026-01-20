import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />);

    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(<ErrorState message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders alert icon', () => {
    const { container } = render(<ErrorState />);

    // Lucide icons render as SVG
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState onRetry={() => {}} />);

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState />);

    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('has centered layout', () => {
    const { container } = render(<ErrorState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'text-center');
  });

  it('has error icon container with red background', () => {
    const { container } = render(<ErrorState />);

    const iconContainer = container.querySelector('.bg-red-100');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('rounded-full');
  });

  it('renders message with gray text', () => {
    render(<ErrorState message="Test message" />);

    const message = screen.getByText('Test message');
    expect(message).toHaveClass('text-gray-600');
  });

  it('retry button has correct styling', () => {
    render(<ErrorState onRetry={() => {}} />);

    const button = screen.getByRole('button', { name: 'Try again' });
    expect(button).toHaveClass('bg-primary-50', 'text-primary-600', 'rounded-lg');
  });
});
