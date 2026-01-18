import { Link } from 'react-router-dom';
import { useCountries } from '../../api';
import { SkeletonRegulationMiniMap, Badge } from '../common';
import { REGULATORY_STATUS_COLORS, REGULATORY_STATUS_LABELS } from '../../types';
import type { RegulatoryStatus, Country } from '../../types';

interface StatusLegendProps {
  onStatusClick?: (status: RegulatoryStatus) => void;
}

function StatusLegend({ onStatusClick }: StatusLegendProps) {
  const statuses: RegulatoryStatus[] = [
    'CLEAR_FRAMEWORK',
    'PARTIAL_GUIDANCE',
    'RESTRICTIVE',
    'UNKNOWN',
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusClick?.(status)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: REGULATORY_STATUS_COLORS[status] }}
          />
          <span>{REGULATORY_STATUS_LABELS[status]}</span>
        </button>
      ))}
    </div>
  );
}

interface CountryCardProps {
  country: Country;
}

function CountryCard({ country }: CountryCardProps) {
  const statusVariant =
    country.regulatoryStatus === 'CLEAR_FRAMEWORK'
      ? 'success'
      : country.regulatoryStatus === 'PARTIAL_GUIDANCE'
      ? 'warning'
      : country.regulatoryStatus === 'RESTRICTIVE'
      ? 'danger'
      : 'neutral';

  return (
    <Link
      to={`/countries/${country.isoCode}`}
      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-medium text-gray-900">{country.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{country.region}</p>
        </div>
        <Badge variant={statusVariant} size="sm">
          {REGULATORY_STATUS_LABELS[country.regulatoryStatus]}
        </Badge>
      </div>
    </Link>
  );
}

export function RegulationMiniMap() {
  const { data: countries, isLoading, error, refetch } = useCountries();

  if (isLoading) {
    return <SkeletonRegulationMiniMap />;
  }

  if (error || !countries) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load country data</p>
            <button
              onClick={refetch}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group countries by status for the summary
  const statusCounts = countries.reduce(
    (acc, country) => {
      acc[country.regulatoryStatus] = (acc[country.regulatoryStatus] || 0) + 1;
      return acc;
    },
    {} as Record<RegulatoryStatus, number>
  );

  // Show featured countries (prioritize clear framework, then partial)
  const featuredCountries = [...countries]
    .sort((a, b) => {
      const order: Record<RegulatoryStatus, number> = {
        CLEAR_FRAMEWORK: 0,
        PARTIAL_GUIDANCE: 1,
        RESTRICTIVE: 2,
        UNKNOWN: 3,
      };
      return order[a.regulatoryStatus] - order[b.regulatoryStatus];
    })
    .slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Regulatory Landscape
        </h2>
        <Link
          to="/countries"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all countries →
        </Link>
      </div>
      <div className="p-6">
        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {(
            [
              'CLEAR_FRAMEWORK',
              'PARTIAL_GUIDANCE',
              'RESTRICTIVE',
              'UNKNOWN',
            ] as RegulatoryStatus[]
          ).map((status) => (
            <div
              key={status}
              className="text-center p-3 rounded-lg"
              style={{ backgroundColor: `${REGULATORY_STATUS_COLORS[status]}15` }}
            >
              <p
                className="text-2xl font-bold font-mono-numbers"
                style={{ color: REGULATORY_STATUS_COLORS[status] }}
              >
                {statusCounts[status] || 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {REGULATORY_STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mb-6">
          <StatusLegend />
        </div>

        {/* Featured Countries Grid */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Key Jurisdictions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredCountries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
