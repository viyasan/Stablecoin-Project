import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

const renderHeader = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>
  );
};

describe('Header', () => {
  it('renders the logo', () => {
    renderHeader();

    expect(screen.getByText('StablecoinStats.ca')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /canada/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regulatory landscape/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /news/i })).toBeInTheDocument();
  });

  it('logo links to home page', () => {
    renderHeader();

    const logoLink = screen.getByRole('link', { name: /stablecoinstats\.ca/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('overview link has correct href', () => {
    renderHeader();

    const overviewLink = screen.getByRole('link', { name: /^overview$/i });
    expect(overviewLink).toHaveAttribute('href', '/');
  });

  it('canada link has correct href', () => {
    renderHeader();

    const canadaLink = screen.getByRole('link', { name: /canada/i });
    expect(canadaLink).toHaveAttribute('href', '/canada');
  });

  it('countries link has correct href', () => {
    renderHeader();

    const countriesLink = screen.getByRole('link', { name: /regulatory landscape/i });
    expect(countriesLink).toHaveAttribute('href', '/countries');
  });

  it('news link has correct href', () => {
    renderHeader();

    const newsLink = screen.getByRole('link', { name: /news/i });
    expect(newsLink).toHaveAttribute('href', '/news');
  });

  it('renders mobile menu button', () => {
    renderHeader();

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    renderHeader();

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });

    // Mobile menu should not be visible initially
    expect(screen.queryByRole('navigation')).toBeInTheDocument(); // Desktop nav exists

    // Click to open mobile menu
    fireEvent.click(menuButton);

    // Mobile menu should now be visible (multiple nav links now appear)
    const canadaLinks = screen.getAllByRole('link', { name: /canada/i });
    expect(canadaLinks.length).toBeGreaterThanOrEqual(2); // Desktop + mobile
  });

  it('has sticky header styling', () => {
    const { container } = renderHeader();

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('has white background', () => {
    const { container } = renderHeader();

    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white');
  });

  it('renders Canada nav item with maple leaf icon', () => {
    const { container } = renderHeader();

    // The maple leaf is an SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('highlights active navigation item', () => {
    renderHeader('/canada');

    // The Canada link should have active styling when on /canada route
    const canadaLinks = screen.getAllByRole('link', { name: /canada/i });
    const desktopCanadaLink = canadaLinks[0];
    expect(desktopCanadaLink).toHaveClass('bg-primary-50', 'text-primary-700');
  });
});
