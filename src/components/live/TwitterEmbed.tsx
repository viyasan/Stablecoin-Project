import { ExternalLink } from 'lucide-react';
import { Tweet } from 'react-tweet';
import { curatedTweets, CURATED_TWEETS_LAST_UPDATED, X_LIST_ID } from '../../data/curatedTweets';

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
  return (
    <div className="bg-[#15202B] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <p className="text-xs text-gray-500">
          Updated {CURATED_TWEETS_LAST_UPDATED}
        </p>
        <a
          href={`https://x.com/i/lists/${X_LIST_ID}`}
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
  );
}
