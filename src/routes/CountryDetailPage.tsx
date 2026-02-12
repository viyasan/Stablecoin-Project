import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { useCountryDetail } from '../api';
import { SkeletonCountryDetail, Badge } from '../components/common';
import { REGULATORY_STATUS_LABELS } from '../types';

export function CountryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { data: country, isLoading, error } = useCountryDetail(code || '');

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonCountryDetail />
      </PageContainer>
    );
  }

  if (error || !country) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-chrome-500 mb-4">Country not found</p>
          <Link to="/countries" className="text-gold-500 hover:text-gold-600">
            ← Back to Countries
          </Link>
        </div>
      </PageContainer>
    );
  }

  const statusVariant =
    country.regulatoryStatus === 'CLEAR_FRAMEWORK'
      ? 'success'
      : country.regulatoryStatus === 'PARTIAL_GUIDANCE'
      ? 'warning'
      : country.regulatoryStatus === 'RESTRICTIVE'
      ? 'danger'
      : 'neutral';

  return (
    <PageContainer>
      <div className="mb-6">
        <Link
          to="/countries"
          className="text-sm text-chrome-500 hover:text-chrome-700"
        >
          ← Back to Countries
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-chrome-800">{country.name}</h1>
          <p className="text-lg text-chrome-500 mt-1">{country.region}</p>
        </div>
        <Badge variant={statusVariant} size="md">
          {REGULATORY_STATUS_LABELS[country.regulatoryStatus]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Regulatory Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
            <h2 className="text-lg font-semibold text-chrome-800 mb-4">
              Regulatory Summary
            </h2>
            <p className="text-chrome-600 leading-relaxed">{country.summaryText}</p>
            {country.regulatorNames.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-chrome-700 mb-2">
                  Key Regulators:
                </p>
                <div className="flex flex-wrap gap-2">
                  {country.regulatorNames.map((name) => (
                    <Badge key={name} variant="info" size="sm">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          {country.events && country.events.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
              <h2 className="text-lg font-semibold text-chrome-800 mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                {country.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 pb-4 border-b border-chrome-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-24 text-sm text-chrome-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div>
                      <h3 className="font-medium text-chrome-800">{event.title}</h3>
                      <p className="text-sm text-chrome-600 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Key Frameworks */}
          {country.keyFrameworks && country.keyFrameworks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
              <h2 className="text-lg font-semibold text-chrome-800 mb-4">
                Key Frameworks
              </h2>
              <ul className="space-y-3">
                {country.keyFrameworks.map((framework, index) => (
                  <li key={index}>
                    <a
                      href={framework.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600 text-sm"
                    >
                      {framework.name} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage Notes */}
          {country.usageNotes && (
            <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
              <h2 className="text-lg font-semibold text-chrome-800 mb-4">
                Local Usage Notes
              </h2>
              <p className="text-sm text-chrome-600">{country.usageNotes}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
