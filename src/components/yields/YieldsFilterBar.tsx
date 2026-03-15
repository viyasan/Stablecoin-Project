import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MOBILE_LIMIT = 7;
const MOBILE_BREAKPOINT = 640;

interface YieldsFilterBarProps {
  chains: string[];
  tokens: string[];
  selectedChain: string | null;
  selectedToken: string | null;
  onChainChange: (chain: string | null) => void;
  onTokenChange: (token: string | null) => void;
  resultCount: number;
}

export function YieldsFilterBar({
  chains,
  tokens,
  selectedChain,
  selectedToken,
  onChainChange,
  onTokenChange,
  resultCount,
}: YieldsFilterBarProps) {
  const hasActiveFilters = selectedChain !== null || selectedToken !== null;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [showAllChains, setShowAllChains] = useState(false);
  const [showAllTokens, setShowAllTokens] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setShowAllChains(false);
        setShowAllTokens(false);
      }
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const shouldLimitChains = isMobile && !showAllChains;
  const shouldLimitTokens = isMobile && !showAllTokens;
  const visibleChains = shouldLimitChains ? chains.slice(0, MOBILE_LIMIT) : chains;
  const visibleTokens = shouldLimitTokens ? tokens.slice(0, MOBILE_LIMIT) : tokens;
  const hiddenChainCount = chains.length - MOBILE_LIMIT;
  const hiddenTokenCount = tokens.length - MOBILE_LIMIT;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-4 mb-6">
      {/* Chain filter row */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xs font-medium text-chrome-500 w-20 flex-shrink-0 pt-1.5">Chain</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onChainChange(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
              selectedChain === null
                ? 'bg-gold-500 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            All
          </button>
          {visibleChains.map((chain) => (
            <button
              key={chain}
              onClick={() => onChainChange(chain)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                selectedChain === chain
                  ? 'bg-gold-500 text-white'
                  : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
              }`}
            >
              {chain}
            </button>
          ))}
          {isMobile && hiddenChainCount > 0 && (
            <button
              onClick={() => setShowAllChains(!showAllChains)}
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-chrome-500 bg-chrome-50 hover:bg-chrome-100 transition-all duration-150 ease-out active:scale-95 inline-flex items-center gap-1"
            >
              {showAllChains ? 'Less' : `+${hiddenChainCount} more`}
              {showAllChains ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Token filter row */}
      <div className="flex items-start gap-3">
        <span className="text-xs font-medium text-chrome-500 w-20 flex-shrink-0 pt-1.5">Stablecoin</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onTokenChange(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
              selectedToken === null
                ? 'bg-gold-500 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            All
          </button>
          {visibleTokens.map((token) => (
            <button
              key={token}
              onClick={() => onTokenChange(token)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-95 ${
                selectedToken === token
                  ? 'bg-gold-500 text-white'
                  : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
              }`}
            >
              {token}
            </button>
          ))}
          {isMobile && hiddenTokenCount > 0 && (
            <button
              onClick={() => setShowAllTokens(!showAllTokens)}
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-chrome-500 bg-chrome-50 hover:bg-chrome-100 transition-all duration-150 ease-out active:scale-95 inline-flex items-center gap-1"
            >
              {showAllTokens ? 'Less' : `+${hiddenTokenCount} more`}
              {showAllTokens ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Footer: clear + count */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-chrome-100">
        {hasActiveFilters ? (
          <button
            onClick={() => {
              onChainChange(null);
              onTokenChange(null);
            }}
            className="text-sm font-medium text-chrome-500 hover:text-chrome-700 transition-all duration-150 ease-out active:scale-95"
          >
            Clear all
          </button>
        ) : (
          <span />
        )}
        <span className="text-sm text-chrome-500">
          {resultCount} {resultCount === 1 ? 'pool' : 'pools'}
        </span>
      </div>
    </div>
  );
}
