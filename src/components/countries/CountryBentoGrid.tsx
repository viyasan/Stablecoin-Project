import { useState } from 'react';
import { X } from 'lucide-react';
import { CountryPromptPanel } from './CountryDetailsPanel';
import {
  REGULATION_COUNTRIES,
  STAGE_COLORS,
  type RegulationCountry,
} from './regulationMapData';

// Country flags as emoji - reliable cross-platform display
const COUNTRY_FLAGS: Record<string, string> = {
  ca: '🇨🇦',
  us: '🇺🇸',
  ch: '🇨🇭',
  eu: '🇪🇺',
  uk: '🇬🇧',
  ae: '🇦🇪',
  hk: '🇭🇰',
  jp: '🇯🇵',
  sg: '🇸🇬',
  au: '🇦🇺',
};

// Ordered list of countries for the bento grid (2x5 layout)
const COUNTRY_ORDER = ['ca', 'us', 'ch', 'eu', 'uk', 'ae', 'hk', 'jp', 'sg', 'au'];

// Get country data by ID
function getCountryById(id: string): RegulationCountry | undefined {
  return REGULATION_COUNTRIES.find((c) => c.id === id);
}

interface CountryCardProps {
  country: RegulationCountry;
  flag: string;
  isSelected: boolean;
  onClick: () => void;
}

function CountryCard({ country, flag, isSelected, onClick }: CountryCardProps) {
  const stageColor = STAGE_COLORS[country.stage];

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
        hover:scale-105 hover:shadow-lg cursor-pointer
        ${isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      {/* Stage indicator dot */}
      <div
        className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: stageColor }}
        title={country.stage.charAt(0).toUpperCase() + country.stage.slice(1)}
      />

      {/* Flag */}
      <span className="text-4xl mb-2">{flag}</span>

      {/* Country name */}
      <span className={`text-sm font-medium text-center ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
        {country.name}
      </span>
    </button>
  );
}

interface CountryBentoGridProps {
  className?: string;
}

export function CountryBentoGrid({ className = '' }: CountryBentoGridProps) {
  const [selectedCountry, setSelectedCountry] = useState<RegulationCountry | null>(null);

  const handleCountryClick = (countryId: string) => {
    const country = getCountryById(countryId);
    if (country) {
      setSelectedCountry((prev) => (prev?.id === countryId ? null : country));
    }
  };

  const handleCloseDetails = () => {
    setSelectedCountry(null);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Global Stablecoin Regulation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a country to view regulatory details
        </p>
      </div>

      <div className="p-6">
        {/* Main layout: Grid on left, Details on right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Country Bento Grid - Left side */}
          <div className="lg:w-1/3">
            <div className="grid grid-cols-2 gap-3">
              {COUNTRY_ORDER.map((countryId) => {
                const country = getCountryById(countryId);
                if (!country) return null;

                return (
                  <CountryCard
                    key={countryId}
                    country={country}
                    flag={COUNTRY_FLAGS[countryId] || '🏳️'}
                    isSelected={selectedCountry?.id === countryId}
                    onClick={() => handleCountryClick(countryId)}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Regulation Status</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS.proposed }} />
                  <span className="text-xs text-gray-600">Proposed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS.approved }} />
                  <span className="text-xs text-gray-600">Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS.implemented }} />
                  <span className="text-xs text-gray-600">Implemented</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel - Right side */}
          <div className="lg:w-2/3">
            {selectedCountry ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-full max-h-[600px] overflow-y-auto">
                <CountryDetailsContent country={selectedCountry} onClose={handleCloseDetails} />
              </div>
            ) : (
              <CountryPromptPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline version of CountryDetailsPanel content for the side-by-side layout
interface CountryDetailsContentProps {
  country: RegulationCountry;
  onClose: () => void;
}

function CountryDetailsContent({ country, onClose }: CountryDetailsContentProps) {
  const hasExtendedData = country && (
    country.regulatoryBodies ||
    country.legislativeDevelopments ||
    country.reserveRequirements ||
    country.issuerObligations ||
    country.exemptions ||
    country.cbdcStatus ||
    country.stablecoinIssuers ||
    country.timeline
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{COUNTRY_FLAGS[country.id]}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
              <p className="text-sm text-gray-500"><span className="font-medium">Regulators:</span> {country.regulatorName}</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Stage Badge */}
      <div className="mb-6">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: STAGE_COLORS[country.stage] }}
        >
          {country.stage.charAt(0).toUpperCase() + country.stage.slice(1)}
        </span>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Overview</h4>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          {country.summary.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div className="mb-6">
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

      {/* Extended Sections */}
      {hasExtendedData && (
        <>
          {/* Regulatory Bodies */}
          {country.regulatoryBodies && country.regulatoryBodies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Regulatory Bodies</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tl-lg">Regulator</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tr-lg">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.regulatoryBodies.map((body, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-800">{body.name}</td>
                        <td className="px-3 py-2 text-gray-600">{body.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reserve Requirements */}
          {country.reserveRequirements && country.reserveRequirements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Reserve Requirements</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tl-lg">Requirement</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tr-lg">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.reserveRequirements.map((req, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-800">{req.requirement}</td>
                        <td className="px-3 py-2 text-gray-600">{req.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stablecoin Issuers */}
          {country.stablecoinIssuers && country.stablecoinIssuers.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Stablecoin Issuers</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tl-lg">Company</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700">Stablecoin</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.stablecoinIssuers.map((issuer, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-800">{issuer.company}</td>
                        <td className="px-3 py-2 text-gray-600">{issuer.stablecoin}</td>
                        <td className="px-3 py-2 text-gray-600">{issuer.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timeline */}
          {country.timeline && country.timeline.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h4>
              <div className="space-y-3">
                {country.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-xs font-medium text-gray-500 w-28 flex-shrink-0 pt-0.5">
                      {item.date}
                    </span>
                    <div className="flex-1 relative pl-4 border-l-2 border-gray-200">
                      <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-primary-500" />
                      <p className="text-sm text-gray-600">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Last Updated */}
      <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
        Last updated: {country.lastUpdated}
      </p>
    </>
  );
}
