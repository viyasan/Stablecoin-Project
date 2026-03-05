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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-4 mb-6">
      {/* Chain filter row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-chrome-500 w-20 flex-shrink-0">Chain</span>
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
          {chains.map((chain) => (
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
        </div>
      </div>

      {/* Token filter row */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-chrome-500 w-20 flex-shrink-0">Stablecoin</span>
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
          {tokens.map((token) => (
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
