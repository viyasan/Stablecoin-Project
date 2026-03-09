import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { kolProfiles } from '../../data/kolDirectory';
import type { KolCategory } from '../../data/kolDirectory';

type EmbedState = 'pending' | 'rendered' | 'failed';
type ActiveTab = 'feed' | 'directory';

const RENDER_TIMEOUT_MS = 8_000;

const CATEGORY_COLORS: Record<KolCategory, string> = {
  institutional: 'text-blue-400',
  analyst: 'text-emerald-400',
  journalist: 'text-amber-400',
  defi: 'text-purple-400',
  analytics: 'text-cyan-400',
  media: 'text-rose-400',
};

export function TwitterEmbed() {
  const embedRef = useRef<HTMLDivElement>(null);
  const [embedState, setEmbedState] = useState<EmbedState>('pending');
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      if (!cancelled) setEmbedState((s) => (s === 'pending' ? 'failed' : s));
    }, RENDER_TIMEOUT_MS);

    function onRendered() {
      if (!cancelled) {
        clearTimeout(timeoutId);
        setEmbedState('rendered');
      }
    }

    function initWidget() {
      if (cancelled) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const twttr = (window as any).twttr;
      if (!twttr?.widgets) {
        setEmbedState('failed');
        clearTimeout(timeoutId);
        return;
      }
      if (twttr.events?.bind) {
        twttr.events.bind('rendered', onRendered);
      }
      twttr.widgets.load(embedRef.current);
    }

    const existing = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );
    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const twttr = (window as any).twttr;
      if (twttr?.widgets) {
        initWidget();
      } else {
        existing.addEventListener('load', initWidget);
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const twttr = (window as any).twttr;
        if (twttr?.ready) {
          twttr.ready(initWidget);
        } else {
          initWidget();
        }
      };
      script.onerror = () => {
        if (!cancelled) {
          clearTimeout(timeoutId);
          setEmbedState('failed');
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const twttr = (window as any).twttr;
      if (twttr?.events?.unbind) {
        twttr.events.unbind('rendered', onRendered);
      }
    };
  }, []);

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
        {/* Twitter embed container — always in DOM so widget can render */}
        <div
          ref={embedRef}
          className={embedState !== 'rendered' ? 'h-0 overflow-hidden' : ''}
        >
          <a
            className="twitter-timeline"
            data-theme="dark"
            data-height="800"
            data-chrome="noheader nofooter noborders transparent"
            data-dnt="true"
            data-tweet-limit="20"
            href="https://twitter.com/circle"
          >
            {' '}
          </a>
        </div>

        {/* Loading skeleton */}
        {embedState === 'pending' && (
          <div className="p-4 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 p-4 border-b border-gray-800">
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
            ))}
          </div>
        )}

        {/* Feed failed state */}
        {embedState === 'failed' && (
          <div className="px-6 py-16 text-center">
            <Radio className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Live feed unavailable
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              The X/Twitter embed couldn't load — this can happen due to rate
              limits or browser privacy settings. Switch to the{' '}
              <button
                onClick={() => setActiveTab('directory')}
                className="text-blue-400 hover:underline font-medium"
              >
                Stablecoin Leaders
              </button>{' '}
              tab to browse key accounts directly.
            </p>
            <a
              href="https://x.com/search?q=stablecoin&src=typed_query&f=live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-full transition-colors"
            >
              Open Live Feed on X
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
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
