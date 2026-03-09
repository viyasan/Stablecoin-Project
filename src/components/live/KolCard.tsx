import type { KolProfile, KolCategory } from '../../data/kolDirectory';

const CATEGORY_GRADIENTS: Record<KolCategory, string> = {
  institutional: 'from-blue-500 to-blue-700',
  analyst: 'from-emerald-500 to-emerald-700',
  journalist: 'from-amber-500 to-amber-700',
  defi: 'from-purple-500 to-purple-700',
  analytics: 'from-cyan-500 to-cyan-700',
  media: 'from-rose-500 to-rose-700',
};

const CATEGORY_LABELS: Record<KolCategory, string> = {
  institutional: 'Institutional',
  analyst: 'Analyst',
  journalist: 'Journalist',
  defi: 'DeFi',
  analytics: 'Analytics',
  media: 'Media',
};

interface KolCardProps {
  profile: KolProfile;
}

export function KolCard({ profile }: KolCardProps) {
  const gradient = CATEGORY_GRADIENTS[profile.category];
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <a
      href={profile.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl shadow-sm border border-chrome-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ease-out"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{initial}</span>
        </div>

        <div className="min-w-0 flex-1">
          {/* Name */}
          <h3 className="text-sm font-semibold text-chrome-900 truncate group-hover:text-gold-500 transition-colors duration-150">
            {profile.name}
          </h3>

          {/* Handle */}
          <p className="text-xs text-chrome-500 truncate">@{profile.handle}</p>

          {/* Role */}
          <p className="text-xs text-chrome-600 mt-1 truncate">{profile.role}</p>
        </div>

        {/* Category badge */}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-chrome-100 text-chrome-600 flex-shrink-0">
          {CATEGORY_LABELS[profile.category]}
        </span>
      </div>
    </a>
  );
}
