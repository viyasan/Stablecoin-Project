import { useState } from 'react';

export function AboutOurData() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-100/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          {/* Database Icon */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">About Our Data</span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
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
                href="https://www.artemis.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Artemis
              </a>
              , which provides adjusted metrics that filter out bot activity and wash trading for more accurate insights.
            </p>

            {/* Level 2 Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComparison(!showComparison);
              }}
              className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showComparison ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>Why do other dashboards show different numbers?</span>
            </button>

            {/* Level 2 Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showComparison ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Some platforms (like{' '}
                  <a
                    href="https://visaonchainanalytics.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Visa Onchain Analytics
                  </a>
                  ) only track a subset of major fiat-backed stablecoins — for example, 6 stablecoins
                  across 11 chains (~$272B). Our comprehensive approach gives you visibility into the
                  full stablecoin ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
