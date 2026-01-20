import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children content', () => {
    render(<Badge>Test Badge</Badge>);

    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);

    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('renders with success variant', () => {
    render(<Badge variant="success">Success</Badge>);

    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);

    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-800');
  });

  it('renders with danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>);

    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders with info variant', () => {
    render(<Badge variant="info">Info</Badge>);

    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders with neutral variant', () => {
    render(<Badge variant="neutral">Neutral</Badge>);

    const badge = screen.getByText('Neutral');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-600');
  });

  it('renders with small size by default', () => {
    render(<Badge>Small</Badge>);

    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('renders with medium size', () => {
    render(<Badge size="md">Medium</Badge>);

    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('has rounded-full styling', () => {
    render(<Badge>Rounded</Badge>);

    const badge = screen.getByText('Rounded');
    expect(badge).toHaveClass('rounded-full');
  });

  it('renders as inline-flex element', () => {
    render(<Badge>Flex</Badge>);

    const badge = screen.getByText('Flex');
    expect(badge).toHaveClass('inline-flex', 'items-center');
  });
});
