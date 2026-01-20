import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renders children content', () => {
    render(<PageContainer>Page content</PageContainer>);

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<PageContainer title="Page Title">Content</PageContainer>);

    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page Title');
  });

  it('renders with subtitle', () => {
    render(
      <PageContainer title="Title" subtitle="Page subtitle">
        Content
      </PageContainer>
    );

    expect(screen.getByText('Page subtitle')).toBeInTheDocument();
  });

  it('renders title with correct styling', () => {
    render(<PageContainer title="Styled Title">Content</PageContainer>);

    const title = screen.getByText('Styled Title');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
  });

  it('renders subtitle with correct styling', () => {
    render(
      <PageContainer title="Title" subtitle="Styled Subtitle">
        Content
      </PageContainer>
    );

    const subtitle = screen.getByText('Styled Subtitle');
    expect(subtitle).toHaveClass('text-lg', 'text-gray-600');
  });

  it('does not render header section when no title or subtitle', () => {
    const { container } = render(<PageContainer>Content only</PageContainer>);

    const header = container.querySelector('.mb-8');
    expect(header).not.toBeInTheDocument();
  });

  it('renders header section when title is provided', () => {
    const { container } = render(<PageContainer title="Title">Content</PageContainer>);

    const header = container.querySelector('.mb-8');
    expect(header).toBeInTheDocument();
  });

  it('renders as main element', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('has max width container', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);

    const main = container.querySelector('main');
    expect(main).toHaveClass('max-w-7xl', 'mx-auto');
  });

  it('has responsive padding', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);

    const main = container.querySelector('main');
    expect(main).toHaveClass('px-4', 'sm:px-6', 'lg:px-8', 'py-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageContainer className="custom-class">Content</PageContainer>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('custom-class');
  });

  it('renders subtitle only when title is also provided', () => {
    render(
      <PageContainer title="Title" subtitle="Subtitle">
        Content
      </PageContainer>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });
});
