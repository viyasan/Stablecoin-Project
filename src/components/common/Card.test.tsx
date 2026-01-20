import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card Title');
  });

  it('renders with subtitle', () => {
    render(<Card title="Title" subtitle="Card subtitle">Content</Card>);

    expect(screen.getByText('Card subtitle')).toBeInTheDocument();
  });

  it('renders subtitle with correct styling', () => {
    render(<Card title="Title" subtitle="Subtitle">Content</Card>);

    const subtitle = screen.getByText('Subtitle');
    expect(subtitle).toHaveClass('text-sm', 'text-gray-500');
  });

  it('renders action element', () => {
    render(
      <Card title="Title" action={<button>Action</button>}>
        Content
      </Card>
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('does not render header when no title or action', () => {
    const { container } = render(<Card>Content only</Card>);

    const header = container.querySelector('.border-b.border-gray-100');
    expect(header).not.toBeInTheDocument();
  });

  it('renders header when title is provided', () => {
    const { container } = render(<Card title="Title">Content</Card>);

    const header = container.querySelector('.border-b.border-gray-100');
    expect(header).toBeInTheDocument();
  });

  it('renders header when action is provided without title', () => {
    const { container } = render(<Card action={<button>Act</button>}>Content</Card>);

    const header = container.querySelector('.border-b.border-gray-100');
    expect(header).toBeInTheDocument();
  });

  it('applies base card styling', () => {
    const { container } = render(<Card>Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('wraps children in padded container', () => {
    const { container } = render(<Card>Content</Card>);

    const contentContainer = container.querySelector('.p-6');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveTextContent('Content');
  });

  it('renders title with correct styling', () => {
    render(<Card title="Styled Title">Content</Card>);

    const title = screen.getByText('Styled Title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
  });
});
