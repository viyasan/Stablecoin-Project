import { useState } from 'react';
import { Database, ChevronDown } from 'lucide-react';

export function AboutOurData() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-chrome-50 rounded-lg border border-dashed border-chrome-300">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-chrome-100/50 transition-all duration-150 ease-out rounded-lg active:bg-chrome-100"
      >
        <div className="flex items-center gap-3">
          {/* Database Icon */}
          <div className="w-8 h-8 bg-chrome-200 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-chrome-500" />
          </div>
          <span className="text-sm font-medium text-chrome-700">About Our Data</span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-5 h-5 text-chrome-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Content - Level 1 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 pt-0">
          <div className="border-t border-chrome-200 pt-4">
            <p className="text-sm text-chrome-600 leading-relaxed mb-3">
              <span className="font-semibold text-chrome-700">Market cap &amp; supply</span> data comes from{' '}
              <a
                href="https://defillama.com/stablecoins"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-600 font-medium"
              >
                DeFiLlama
              </a>
              , covering <span className="font-semibold text-chrome-700">200+ stablecoins</span> across{' '}
              <span className="font-semibold text-chrome-700">110+ blockchains</span> — including
              fiat-backed (USDT, USDC), crypto-backed (DAI), algorithmic, and yield-bearing
              stablecoins.
            </p>
            <p className="text-sm text-chrome-600 leading-relaxed">
              <span className="font-semibold text-chrome-700">Transaction activity</span> (volume, transactions, active addresses) is powered by{' '}
              <a
                href="https://www.allium.so/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-600 font-medium"
              >
                Allium
              </a>
              , which tracks <span className="font-semibold text-chrome-700">6 major fiat-backed stablecoins</span> across{' '}
              <span className="font-semibold text-chrome-700">11 chains</span>. This covers the majority of the market, with adjusted filters for bot activity and wash trading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
