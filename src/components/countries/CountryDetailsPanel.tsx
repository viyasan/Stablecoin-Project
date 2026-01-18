import { X, MousePointer2 } from 'lucide-react';
import type { RegulationCountry } from './regulationMapData';
import { RegulationProgressBar } from './RegulationProgressBar';

interface CountryDetailsPanelProps {
  country: RegulationCountry | null;
  onClose: () => void;
}

export function CountryDetailsPanel({ country, onClose }: CountryDetailsPanelProps) {
  // Check if country has extended data
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
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        country ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
      }`}
    >
      {country && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn max-h-[700px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 sticky top-0 bg-white pb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{country.regulatorName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <RegulationProgressBar stage={country.stage} />
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

          {/* Extended Sections - only show if data exists */}
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

              {/* Legislative Developments */}
              {country.legislativeDevelopments && country.legislativeDevelopments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Legislative Developments</h4>
                  <div className="space-y-4">
                    {country.legislativeDevelopments.map((dev, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-2">{dev.title}</h5>
                        <ul className="space-y-1">
                          {dev.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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

              {/* Issuer Obligations */}
              {country.issuerObligations && country.issuerObligations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Issuer Obligations</h4>
                  <ul className="space-y-2">
                    {country.issuerObligations.map((obligation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>{obligation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exemptions */}
              {country.exemptions && country.exemptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Exemptions</h4>
                  <ul className="space-y-2">
                    {country.exemptions.map((exemption, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{exemption}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CBDC Status */}
              {country.cbdcStatus && country.cbdcStatus.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">CBDC Status</h4>
                  <ul className="space-y-2">
                    {country.cbdcStatus.map((status, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <span>{status}</span>
                      </li>
                    ))}
                  </ul>
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
        <MousePointer2 className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">Click a country to view regulatory progress</p>
      <p className="text-sm text-gray-400 mt-1">
        Highlighted regions have active stablecoin frameworks
      </p>
    </div>
  );
}
