import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders label text', () => {
    render(<Tag label="Regulation" />);

    expect(screen.getByText('Regulation')).toBeInTheDocument();
  });

  it('applies regulation topic color', () => {
    render(<Tag label="regulation" />);

    const tag = screen.getByText('regulation');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies depeg topic color', () => {
    render(<Tag label="depeg" />);

    const tag = screen.getByText('depeg');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies integration topic color', () => {
    render(<Tag label="integration" />);

    const tag = screen.getByText('integration');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies infrastructure topic color', () => {
    render(<Tag label="infrastructure" />);

    const tag = screen.getByText('infrastructure');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies payments topic color', () => {
    render(<Tag label="payments" />);

    const tag = screen.getByText('payments');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies reserve topic color', () => {
    render(<Tag label="reserve" />);

    const tag = screen.getByText('reserve');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies launch topic color', () => {
    render(<Tag label="launch" />);

    const tag = screen.getByText('launch');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies partnership topic color', () => {
    render(<Tag label="partnership" />);

    const tag = screen.getByText('partnership');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('applies default gray color for unknown topics', () => {
    render(<Tag label="unknown" />);

    const tag = screen.getByText('unknown');
    expect(tag).toHaveClass('bg-chrome-100', 'text-chrome-600');
  });

  it('handles onClick event', () => {
    const handleClick = vi.fn();
    render(<Tag label="Clickable" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has button role when clickable', () => {
    render(<Tag label="Button" onClick={() => {}} />);

    const tag = screen.getByRole('button');
    expect(tag).toBeInTheDocument();
  });

  it('has tabIndex when clickable', () => {
    render(<Tag label="Focusable" onClick={() => {}} />);

    const tag = screen.getByText('Focusable');
    expect(tag).toHaveAttribute('tabIndex', '0');
  });

  it('does not have button role when not clickable', () => {
    render(<Tag label="Static" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies active state styling', () => {
    render(<Tag label="Active" active />);

    const tag = screen.getByText('Active');
    expect(tag).toHaveClass('ring-2', 'ring-offset-1', 'ring-gold-400');
  });

  it('applies cursor-pointer when clickable', () => {
    render(<Tag label="Pointer" onClick={() => {}} />);

    const tag = screen.getByText('Pointer');
    expect(tag).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    render(<Tag label="Custom" className="custom-class" />);

    const tag = screen.getByText('Custom');
    expect(tag).toHaveClass('custom-class');
  });

  it('has rounded-md styling', () => {
    render(<Tag label="Rounded" />);

    const tag = screen.getByText('Rounded');
    expect(tag).toHaveClass('rounded-md');
  });
});
