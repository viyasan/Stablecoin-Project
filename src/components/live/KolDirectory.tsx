import { useState } from 'react';
import { kolProfiles, KOL_CATEGORY_FILTERS } from '../../data/kolDirectory';
import type { KolCategory } from '../../data/kolDirectory';
import { KolCard } from './KolCard';

export function KolDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<KolCategory | 'all'>('all');

  const filteredProfiles = selectedCategory === 'all'
    ? kolProfiles
    : kolProfiles.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {KOL_CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedCategory(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              selectedCategory === filter.value
                ? 'bg-chrome-800 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* KOL grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile) => (
          <KolCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
