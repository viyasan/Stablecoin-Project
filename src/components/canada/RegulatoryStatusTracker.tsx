import { useState } from 'react';
import { Check } from 'lucide-react';
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
          <div className="bg-chrome-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs whitespace-normal text-center shadow-lg">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-chrome-900" />
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
        circle: 'bg-status-positive border-status-positive text-white',
        line: 'bg-status-positive',
        label: 'text-chrome-900 font-medium',
      };
    }
    if (step.current) {
      return {
        circle: 'bg-white border-gold-400',
        line: 'bg-chrome-200',
        label: 'text-gold-600 font-medium',
      };
    }
    return {
      circle: 'bg-white border-chrome-300',
      line: 'bg-chrome-200',
      label: 'text-chrome-400',
    };
  };

  const styles = getStepStyles();

  return (
    <div className="flex-1 flex flex-col items-center relative">
      {/* Connector line - positioned behind the circle */}
      {!isLast && (
        <div
          className={`absolute top-4 left-1/2 w-full h-0.5 ${styles.line}`}
          style={{ transform: 'translateY(-50%)' }}
        />
      )}

      <Tooltip content={step.description}>
        <div className="flex flex-col items-center cursor-help relative z-10">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${styles.circle}`}
          >
            {step.completed ? (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            ) : step.current ? (
              <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-chrome-300" />
            )}
          </div>
          {/* Label */}
          <span className={`mt-2 text-xs text-center whitespace-nowrap ${styles.label}`}>
            {step.label}
          </span>
        </div>
      </Tooltip>
    </div>
  );
}

interface StablecoinTrackerProps {
  stablecoin: CanadianStablecoin;
}

function StablecoinTracker({ stablecoin }: StablecoinTrackerProps) {
  const statusColors = {
    live: 'bg-status-positive/10 text-status-positive border-status-positive/20',
    coming_soon: 'bg-gold-50 text-gold-600 border-gold-100',
    pending_approval: 'bg-gold-50 text-gold-600 border-gold-100',
  };

  return (
    <div className="bg-white rounded-lg border border-chrome-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-chrome-900">{stablecoin.name}</h3>
          <span className="text-sm text-chrome-500">({stablecoin.issuer})</span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[stablecoin.status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${stablecoin.status === 'live' ? 'bg-status-positive' : 'bg-gold-400'}`} />
          {stablecoin.statusLabel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex items-start px-4">
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
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-chrome-100">
        <h2 className="text-lg font-semibold text-chrome-900">Regulatory Status</h2>
        <p className="text-sm text-chrome-500 mt-1">Hover over each step for details</p>
      </div>
      <div className="p-6 space-y-4">
        {stablecoins.map((stablecoin) => (
          <StablecoinTracker key={stablecoin.id} stablecoin={stablecoin} />
        ))}
      </div>
    </div>
  );
}
