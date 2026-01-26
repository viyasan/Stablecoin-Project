import { useState } from 'react';
import { Database, ChevronDown } from 'lucide-react';

export function AboutOurData() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-100/50 transition-all duration-150 ease-out rounded-lg active:bg-gray-100"
      >
        <div className="flex items-center gap-3">
          {/* Database Icon */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-gray-700">About Our Data</span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              <span className="font-semibold text-gray-700">Market cap &amp; supply</span> data comes from{' '}
              <a
                href="https://defillama.com/stablecoins"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                DeFiLlama
              </a>
              , covering <span className="font-semibold text-gray-700">200+ stablecoins</span> across{' '}
              <span className="font-semibold text-gray-700">110+ blockchains</span> — including
              fiat-backed (USDT, USDC), crypto-backed (DAI), algorithmic, and yield-bearing
              stablecoins.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-700">Transaction activity</span> (volume, transactions, active addresses) is powered by{' '}
              <a
                href="https://www.allium.so/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Allium
              </a>
              , which tracks <span className="font-semibold text-gray-700">6 major fiat-backed stablecoins</span> across{' '}
              <span className="font-semibold text-gray-700">11 chains</span>. This covers the majority of the market, with adjusted filters for bot activity and wash trading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
