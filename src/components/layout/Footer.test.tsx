import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

const renderFooter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Footer />
    </MemoryRouter>
  );
};

describe('Footer', () => {
  it('renders the brand name', () => {
    renderFooter();

    expect(screen.getByText('StablecoinStats.ca')).toBeInTheDocument();
  });

  it('renders brand description', () => {
    renderFooter();

    expect(screen.getByText(/your destination for stablecoin market data/i)).toBeInTheDocument();
  });

  it('renders explore navigation section', () => {
    renderFooter();

    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Canada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regulatory Landscape' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument();
  });

  it('renders legal navigation section', () => {
    renderFooter();

    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Disclaimer & Disclosures' })).toBeInTheDocument();
  });

  it('navigation links have correct hrefs', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: 'Canada' })).toHaveAttribute('href', '/canada');
    expect(screen.getByRole('link', { name: 'Regulatory Landscape' })).toHaveAttribute('href', '/countries');
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
  });

  it('renders data sources on overview page', () => {
    renderFooter('/');

    expect(screen.getByText(/data sources/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'DefiLlama' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CoinDesk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CoinTelegraph' })).toBeInTheDocument();
  });

  it('does not render data sources on non-overview pages', () => {
    renderFooter('/canada');

    expect(screen.queryByRole('link', { name: 'DefiLlama' })).not.toBeInTheDocument();
  });

  it('renders disclaimer text', () => {
    renderFooter();

    expect(screen.getByText('Disclaimer:')).toBeInTheDocument();
    expect(screen.getByText(/informational purposes only/i)).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    renderFooter();

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  it('has dark background', () => {
    const { container } = renderFooter();

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-chrome-800');
  });

  it('external links open in new tab', () => {
    renderFooter('/');

    const defiLlamaLink = screen.getByRole('link', { name: 'DefiLlama' });
    expect(defiLlamaLink).toHaveAttribute('target', '_blank');
    expect(defiLlamaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders read full disclaimer link', () => {
    renderFooter();

    const disclaimerLink = screen.getByRole('link', { name: /read full disclaimer/i });
    expect(disclaimerLink).toHaveAttribute('href', '/disclaimer');
  });
});
