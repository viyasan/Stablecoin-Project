import type { NewsItem } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsHeroProps {
  items: NewsItem[];
}

export function NewsHero({ items }: NewsHeroProps) {
  if (items.length === 0) return null;

  const [featured, ...secondary] = items.slice(0, 3);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Featured Article - Takes 3 columns, full height */}
        <div className="lg:col-span-3 h-full">
          <NewsCard item={featured} variant="hero" />
        </div>

        {/* Secondary Articles - Takes 2 columns, stacked */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {secondary.map((item) => (
            <NewsCard key={item.id} item={item} variant="secondary" />
          ))}
        </div>
      </div>
    </section>
  );
}
