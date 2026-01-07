import { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { FlagPatterns } from './FlagPatterns';
import { CountryDetailsPanel, CountryPromptPanel } from './CountryDetailsPanel';
import {
  ISO_TO_COUNTRY,
  STAGE_COLORS,
  type RegulationCountry,
} from './regulationMapData';

interface GeoProperties {
  name?: string;
}

interface GeoObject {
  rsmKey: string;
  properties: GeoProperties;
  id: string;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO 3166-1 numeric codes to our country IDs
const NUMERIC_TO_COUNTRY_ID: Record<string, string> = {
  '840': 'us',  // United States
  '826': 'uk',  // United Kingdom
  '702': 'sg',  // Singapore
  '392': 'jp',  // Japan
  '124': 'ca',  // Canada
  '784': 'ae',  // United Arab Emirates
  '344': 'hk',  // Hong Kong
  '756': 'ch',  // Switzerland
  '036': 'au',  // Australia
  // EU countries - all map to 'eu'
  '040': 'eu',  // Austria
  '056': 'eu',  // Belgium
  '100': 'eu',  // Bulgaria
  '191': 'eu',  // Croatia
  '196': 'eu',  // Cyprus
  '203': 'eu',  // Czech Republic
  '208': 'eu',  // Denmark
  '233': 'eu',  // Estonia
  '246': 'eu',  // Finland
  '250': 'eu',  // France
  '276': 'eu',  // Germany
  '300': 'eu',  // Greece
  '348': 'eu',  // Hungary
  '372': 'eu',  // Ireland
  '380': 'eu',  // Italy
  '428': 'eu',  // Latvia
  '440': 'eu',  // Lithuania
  '442': 'eu',  // Luxembourg
  '470': 'eu',  // Malta
  '528': 'eu',  // Netherlands
  '616': 'eu',  // Poland
  '620': 'eu',  // Portugal
  '642': 'eu',  // Romania
  '703': 'eu',  // Slovakia
  '705': 'eu',  // Slovenia
  '724': 'eu',  // Spain
  '752': 'eu',  // Sweden
};

// Set of all numeric codes that should be highlighted
const HIGHLIGHTED_NUMERIC_CODES = new Set(Object.keys(NUMERIC_TO_COUNTRY_ID));

// Get country data from numeric code
function getCountryFromNumericCode(numericCode: string): RegulationCountry | null {
  const countryId = NUMERIC_TO_COUNTRY_ID[numericCode];
  if (!countryId) return null;
  return ISO_TO_COUNTRY[countryId] || null;
}

interface RegulationMapProps {
  className?: string;
}

export function RegulationMap({ className = '' }: RegulationMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<RegulationCountry | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<RegulationCountry | null>(null);

  const handleMouseEnter = useCallback((numericCode: string) => {
    const country = getCountryFromNumericCode(numericCode);
    if (country) {
      setHoveredCountry(country);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCountry(null);
  }, []);

  const handleClick = useCallback((numericCode: string) => {
    const country = getCountryFromNumericCode(numericCode);
    if (country) {
      setSelectedCountry((prev) => (prev?.id === country.id ? null : country));
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  // Get fill color/pattern for a geography
  const getFill = useCallback(
    (numericCode: string) => {
      const country = getCountryFromNumericCode(numericCode);

      if (!country) {
        return '#E5E7EB'; // Gray for non-highlighted
      }

      // If hovered, show flag pattern
      if (hoveredCountry?.id === country.id) {
        return `url(#flag-${country.id})`;
      }

      // Default: show neutral color with slight tint based on stage
      return `${STAGE_COLORS[country.stage]}30`;
    },
    [hoveredCountry]
  );

  // Get stroke for highlighted countries
  const getStroke = useCallback(
    (numericCode: string) => {
      const country = getCountryFromNumericCode(numericCode);

      if (!country) {
        return '#D1D5DB';
      }

      if (selectedCountry?.id === country.id) {
        return STAGE_COLORS[country.stage];
      }

      return '#9CA3AF';
    },
    [selectedCountry]
  );

  const getStrokeWidth = useCallback(
    (numericCode: string) => {
      const country = getCountryFromNumericCode(numericCode);

      if (selectedCountry?.id === country?.id) {
        return 2;
      }

      return country ? 0.75 : 0.25;
    },
    [selectedCountry]
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Global Stablecoin Regulation Map
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Hover to preview, click to view details
        </p>
      </div>

      <div className="p-4">
        {/* Map Container */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{
              scale: 160,
              center: [10, 0],
            }}
            style={{ width: '100%', height: 'auto' }}
          >
            <FlagPatterns />
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: GeoObject[] }) =>
                  geographies.map((geo: GeoObject) => {
                    const numericCode = geo.id;
                    const isHighlighted = HIGHLIGHTED_NUMERIC_CODES.has(numericCode);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getFill(numericCode)}
                        stroke={getStroke(numericCode)}
                        strokeWidth={getStrokeWidth(numericCode)}
                        style={{
                          default: {
                            outline: 'none',
                            transition: 'all 0.3s ease',
                          },
                          hover: {
                            outline: 'none',
                            cursor: isHighlighted ? 'pointer' : 'default',
                          },
                          pressed: {
                            outline: 'none',
                          },
                        }}
                        onMouseEnter={() => isHighlighted && handleMouseEnter(numericCode)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => isHighlighted && handleClick(numericCode)}
                      />
                    );
                  })
                }
              </Geographies>
          </ComposableMap>

          {/* Hover Tooltip */}
          {hoveredCountry && !selectedCountry && (
            <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 animate-fadeIn text-center max-w-md">
                <p className="text-base font-bold text-gray-900">{hoveredCountry.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Regulators:</span> {hoveredCountry.regulatorName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `${STAGE_COLORS.proposed}30` }}
            />
            <span className="text-gray-600">Proposed</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `${STAGE_COLORS.approved}30` }}
            />
            <span className="text-gray-600">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `${STAGE_COLORS.implemented}30` }}
            />
            <span className="text-gray-600">Implemented</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-200" />
            <span className="text-gray-600">Not tracked</span>
          </div>
        </div>

        {/* Country Details or Prompt */}
        {selectedCountry ? (
          <CountryDetailsPanel country={selectedCountry} onClose={handleCloseDetails} />
        ) : (
          <CountryPromptPanel />
        )}
      </div>
    </div>
  );
}
