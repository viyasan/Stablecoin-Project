import type { RegulationCountry } from './regulationMapData';
import { RegulationProgressBar } from './RegulationProgressBar';

interface CountryDetailsPanelProps {
  country: RegulationCountry | null;
  onClose: () => void;
}

export function CountryDetailsPanel({ country, onClose }: CountryDetailsPanelProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        country ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
      }`}
    >
      {country && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{country.regulatorName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close details"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <RegulationProgressBar stage={country.stage} />
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Overview</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{country.summary}</p>
          </div>

          {/* Key Points */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Points</h4>
            <ul className="space-y-2">
              {country.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-400 mt-4">
            Last updated: {country.lastUpdated}
          </p>
        </div>
      )}
    </div>
  );
}

// Placeholder panel shown when no country is selected
export function CountryPromptPanel() {
  return (
    <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 border-dashed p-8 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">Click a country to view regulatory progress</p>
      <p className="text-sm text-gray-400 mt-1">
        Highlighted regions have active stablecoin frameworks
      </p>
    </div>
  );
}
