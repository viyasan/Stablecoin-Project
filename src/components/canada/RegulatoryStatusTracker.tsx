import { useState } from 'react';
import type { CanadianStablecoin, RegulatoryStep } from '../../api';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs whitespace-normal text-center shadow-lg">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}

interface ProgressStepProps {
  step: RegulatoryStep;
  isLast: boolean;
}

function ProgressStep({ step, isLast }: ProgressStepProps) {
  const getStepStyles = () => {
    if (step.completed) {
      return {
        circle: 'bg-red-600 border-red-600',
        icon: 'text-white',
        line: 'bg-red-600',
        label: 'text-gray-900 font-medium',
      };
    }
    if (step.current) {
      return {
        circle: 'bg-white border-red-600 border-2',
        icon: 'text-red-600',
        line: 'bg-gray-200',
        label: 'text-red-600 font-medium',
      };
    }
    return {
      circle: 'bg-gray-200 border-gray-200',
      icon: 'text-gray-400',
      line: 'bg-gray-200',
      label: 'text-gray-400',
    };
  };

  const styles = getStepStyles();

  return (
    <div className="flex items-center flex-1">
      <Tooltip content={step.description}>
        <div className="flex flex-col items-center cursor-help">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${styles.circle}`}
          >
            {step.completed ? (
              <svg className={`w-4 h-4 ${styles.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : step.current ? (
              <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            )}
          </div>
          {/* Label */}
          <span className={`mt-2 text-xs text-center max-w-[80px] ${styles.label}`}>
            {step.label}
          </span>
        </div>
      </Tooltip>

      {/* Connector line */}
      {!isLast && (
        <div className={`flex-1 h-1 mx-2 rounded ${styles.line}`} />
      )}
    </div>
  );
}

interface StablecoinTrackerProps {
  stablecoin: CanadianStablecoin;
}

function StablecoinTracker({ stablecoin }: StablecoinTrackerProps) {
  const statusColors = {
    live: 'bg-green-100 text-green-800 border-green-200',
    coming_soon: 'bg-amber-100 text-amber-800 border-amber-200',
    pending_approval: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{stablecoin.name}</h3>
          <span className="text-sm text-gray-500">({stablecoin.issuer})</span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[stablecoin.status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${stablecoin.status === 'live' ? 'bg-green-500' : 'bg-amber-500'}`} />
          {stablecoin.statusLabel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex items-start">
        {stablecoin.regulatorySteps.map((step, index) => (
          <ProgressStep
            key={step.id}
            step={step}
            isLast={index === stablecoin.regulatorySteps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface RegulatoryStatusTrackerProps {
  stablecoins: CanadianStablecoin[];
}

export function RegulatoryStatusTracker({ stablecoins }: RegulatoryStatusTrackerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Regulatory Status</h2>
        <p className="text-sm text-gray-500 mt-1">Hover over each step for details</p>
      </div>
      <div className="p-6 space-y-4">
        {stablecoins.map((stablecoin) => (
          <StablecoinTracker key={stablecoin.id} stablecoin={stablecoin} />
        ))}
      </div>
    </div>
  );
}
