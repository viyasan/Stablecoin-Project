import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewsCard } from './NewsCard';
import type { NewsItem } from '../../types';

const mockNewsItem: NewsItem = {
  id: '1',
  title: 'Test News Title',
  summary: 'This is a test summary for the news item.',
  url: 'https://example.com/news/1',
  source: 'CoinDesk',
  publishedAt: new Date().toISOString(),
  imageUrl: 'https://example.com/image.jpg',
  assetSymbols: ['USDT', 'USDC'],
  topics: ['regulation', 'payments'],
};

describe('NewsCard', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  describe('standard variant', () => {
    it('renders news title', () => {
      render(<NewsCard item={mockNewsItem} />);

      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });

    it('renders source name', () => {
      render(<NewsCard item={mockNewsItem} />);

      expect(screen.getByText('CoinDesk')).toBeInTheDocument();
    });

    it('opens URL in new tab on click', () => {
      render(<NewsCard item={mockNewsItem} />);

      const article = screen.getByRole('article');
      fireEvent.click(article);

      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/news/1',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('renders image when imageUrl is provided', () => {
      render(<NewsCard item={mockNewsItem} />);

      const img = screen.getByAltText('Test News Title');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders fallback gradient when no image', () => {
      const itemWithoutImage = { ...mockNewsItem, imageUrl: undefined };
      const { container } = render(<NewsCard item={itemWithoutImage} />);

      const fallback = container.querySelector('[style*="linear-gradient"]');
      expect(fallback).toBeInTheDocument();
    });

    it('has cursor pointer styling', () => {
      const { container } = render(<NewsCard item={mockNewsItem} />);

      const article = container.querySelector('article');
      expect(article).toHaveClass('cursor-pointer');
    });
  });

  describe('hero variant', () => {
    it('renders as hero card', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });

    it('renders summary in hero variant', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      expect(screen.getByText('This is a test summary for the news item.')).toBeInTheDocument();
    });

    it('renders asset tags', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      expect(screen.getByText('USDT')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('renders topic tag', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      expect(screen.getByText('regulation')).toBeInTheDocument();
    });

    it('renders source badge', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      expect(screen.getByText('CoinDesk')).toBeInTheDocument();
    });

    it('renders with larger title styling', () => {
      render(<NewsCard item={mockNewsItem} variant="hero" />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-xl');
    });
  });

  describe('secondary variant', () => {
    it('renders as secondary card', () => {
      render(<NewsCard item={mockNewsItem} variant="secondary" />);

      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });

    it('renders asset tag', () => {
      render(<NewsCard item={mockNewsItem} variant="secondary" />);

      expect(screen.getByText('USDT')).toBeInTheDocument();
    });

    it('renders source and time', () => {
      render(<NewsCard item={mockNewsItem} variant="secondary" />);

      expect(screen.getByText('CoinDesk')).toBeInTheDocument();
    });

    it('renders with h3 heading', () => {
      render(<NewsCard item={mockNewsItem} variant="secondary" />);

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('time formatting', () => {
    it('shows minutes ago for recent news', () => {
      const recentItem = {
        ...mockNewsItem,
        publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      };
      render(<NewsCard item={recentItem} />);

      expect(screen.getByText(/30m ago/)).toBeInTheDocument();
    });

    it('shows hours ago for news from today', () => {
      const hoursAgoItem = {
        ...mockNewsItem,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      };
      render(<NewsCard item={hoursAgoItem} />);

      expect(screen.getByText(/5h ago/)).toBeInTheDocument();
    });

    it('shows days ago for recent news', () => {
      const daysAgoItem = {
        ...mockNewsItem,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      };
      render(<NewsCard item={daysAgoItem} />);

      expect(screen.getByText(/3d ago/)).toBeInTheDocument();
    });
  });

  describe('different sources', () => {
    it('renders CoinTelegraph source', () => {
      const ctItem = { ...mockNewsItem, source: 'CoinTelegraph' };
      render(<NewsCard item={ctItem} />);

      expect(screen.getByText('CoinTelegraph')).toBeInTheDocument();
    });
  });
});
