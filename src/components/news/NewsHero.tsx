import type { NewsItem } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsHeroProps {
  items: NewsItem[];
}

export function NewsHero({ items }: NewsHeroProps) {
  if (items.length === 0) return null;

  const [featured, ...secondary] = items.slice(0, 3);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* All 3 articles in a uniform row */}
        <NewsCard item={featured} variant="secondary" />
        {secondary.map((item) => (
          <NewsCard key={item.id} item={item} variant="secondary" />
        ))}
      </div>
    </section>
  );
}
