import { useState } from 'react';
import type { CanadianStablecoin, RegulatoryStep } from '../../api';

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

interface LogoCircleProps {
  name: string;
  status: CanadianStablecoin['status'];
}

function LogoCircle({ name, status }: LogoCircleProps) {
  const bgColors = {
    live: 'bg-red-100 text-red-700',
    coming_soon: 'bg-gray-100 text-gray-600',
    pending_approval: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${bgColors[status]}`}>
      {name.charAt(0)}
    </div>
  );
}

interface StatusBadgeProps {
  status: CanadianStablecoin['status'];
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    live: 'bg-green-100 text-green-700',
    coming_soon: 'bg-amber-100 text-amber-700',
    pending_approval: 'bg-amber-100 text-amber-700',
  };

  const dotColors = {
    live: 'bg-green-500',
    coming_soon: 'bg-amber-500',
    pending_approval: 'bg-amber-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
  );
}

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
  // Determine step appearance
  const isCompleted = step.completed;
  const isCurrent = step.current;

  // Get colors for the circle
  const getCircleStyles = () => {
    if (isCompleted) {
      return 'bg-green-500 border-green-500';
    }
    if (isCurrent) {
      return 'bg-white border-amber-400 border-2';
    }
    return 'bg-gray-200 border-gray-200';
  };

  // Get line color (line to the right of this step)
  const getLineColor = () => {
    if (isCompleted) {
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  // Get label styles
  const getLabelStyles = () => {
    if (isCompleted) {
      return 'text-gray-700 font-medium';
    }
    if (isCurrent) {
      return 'text-amber-600 font-medium';
    }
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center flex-1">
      <Tooltip content={step.description}>
        <div className="flex flex-col items-center cursor-help">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getCircleStyles()}`}
          >
            {isCompleted ? (
              <CheckIcon className="w-4 h-4 text-white" />
            ) : isCurrent ? (
              <ClockIcon className="w-4 h-4 text-amber-500" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </div>
          {/* Label */}
          <span className={`mt-2 text-xs text-center max-w-[80px] leading-tight ${getLabelStyles()}`}>
            {step.label}
          </span>
        </div>
      </Tooltip>

      {/* Connector line */}
      {!isLast && (
        <div className={`flex-1 h-1 mx-2 rounded-full ${getLineColor()}`} />
      )}
    </div>
  );
}

interface StablecoinTrackerProps {
  stablecoin: CanadianStablecoin;
}

function StablecoinTracker({ stablecoin }: StablecoinTrackerProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LogoCircle name={stablecoin.name} status={stablecoin.status} />
          <div>
            <h3 className="text-base font-bold text-gray-900">{stablecoin.name}</h3>
            <p className="text-sm text-gray-500">{stablecoin.issuer}</p>
          </div>
        </div>
        <StatusBadge status={stablecoin.status} label={stablecoin.statusLabel} />
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
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Regulatory Status
        </h2>
        <p className="text-sm text-gray-500 mt-1">Hover over each step for details</p>
      </div>
      <div className="space-y-4">
        {stablecoins.map((stablecoin) => (
          <StablecoinTracker key={stablecoin.id} stablecoin={stablecoin} />
        ))}
      </div>
    </div>
  );
}
