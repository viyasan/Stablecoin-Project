import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Tweet } from 'react-tweet';
import { kolProfiles } from '../../data/kolDirectory';
import { curatedTweets, CURATED_TWEETS_LAST_UPDATED } from '../../data/curatedTweets';
import type { KolCategory } from '../../data/kolDirectory';

type ActiveTab = 'feed' | 'directory';

const CATEGORY_COLORS: Record<KolCategory, string> = {
  institutional: 'text-blue-400',
  analyst: 'text-emerald-400',
  journalist: 'text-amber-400',
  defi: 'text-purple-400',
  analytics: 'text-cyan-400',
  media: 'text-rose-400',
};

function TweetSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b border-gray-800 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-800 rounded" />
        </div>
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-700 rounded" />
        <div className="flex gap-8 mt-3">
          <div className="h-4 w-10 bg-gray-800 rounded" />
          <div className="h-4 w-10 bg-gray-800 rounded" />
          <div className="h-4 w-10 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}

function TweetFallbackCard({ handle }: { handle: string }) {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-6 text-center">
        <p className="text-sm text-gray-400 mb-2">Tweet unavailable</p>
        <a
          href={`https://x.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
        >
          View @{handle} on X
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function TwitterEmbed() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');

  return (
    <div className="bg-[#15202B] rounded-xl overflow-hidden">
      {/* ── Tab bar ── */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors relative ${
            activeTab === 'feed'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
          }`}
        >
          Live Feed
          {activeTab === 'feed' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors relative ${
            activeTab === 'directory'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
          }`}
        >
          Stablecoin Leaders
          {activeTab === 'directory' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-blue-500" />
          )}
        </button>
      </div>

      {/* ── Live Feed tab ── */}
      <div className={activeTab !== 'feed' ? 'hidden' : ''}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-500">
            Updated {CURATED_TWEETS_LAST_UPDATED}
          </p>
          <a
            href="https://x.com/search?q=stablecoin&src=typed_query&f=live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
          >
            Live on X
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div data-theme="dark" className="max-h-[800px] overflow-y-auto">
          {curatedTweets.map((tweet) => (
            <div key={tweet.id} className="mx-auto max-w-[550px]">
              <Tweet
                id={tweet.id}
                fallback={<TweetSkeleton />}
                components={{
                  TweetNotFound: () => <TweetFallbackCard handle={tweet.handle} />,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Stablecoin Leaders tab ── */}
      <div className={activeTab !== 'directory' ? 'hidden' : ''}>
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-500">
            Follow these accounts on X for live stablecoin updates
          </p>
        </div>

        <div className="divide-y divide-gray-800 max-h-[800px] overflow-y-auto">
          {kolProfiles.map((kol) => (
            <a
              key={kol.id}
              href={kol.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 px-4 py-4 hover:bg-white/[0.03] transition-colors duration-150 group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-300 font-bold text-sm">
                  {kol.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate group-hover:underline">
                    {kol.name}
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    @{kol.handle}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{kol.role}</p>
                <p className="text-sm text-gray-300 mt-1">{kol.bio}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${CATEGORY_COLORS[kol.category]}`}>
                    {kol.category.charAt(0).toUpperCase() + kol.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                    View on X
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
