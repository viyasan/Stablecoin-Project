import { Check } from 'lucide-react';
import type { RegulationStage } from './regulationMapData';
import { STAGE_LABELS, STAGE_COLORS } from './regulationMapData';

interface RegulationProgressBarProps {
  stage: RegulationStage;
}

const STAGES: RegulationStage[] = ['proposed', 'approved', 'implemented'];

export function RegulationProgressBar({ stage }: RegulationProgressBarProps) {
  const currentIndex = STAGES.indexOf(stage);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {STAGES.map((s, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isCompleted
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                style={{
                  backgroundColor: isCompleted ? STAGE_COLORS[s] : undefined,
                  boxShadow: isCurrent ? `0 0 0 4px ${STAGE_COLORS[s]}30` : undefined,
                }}
              >
                {isCompleted ? (
                  index < currentIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {STAGE_LABELS[s]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress line */}
      <div className="relative mt-1">
        <div className="absolute top-0 left-[16.67%] right-[16.67%] h-1 bg-gray-200 rounded-full" />
        <div
          className="absolute top-0 left-[16.67%] h-1 rounded-full transition-all duration-500"
          style={{
            width: `${(currentIndex / (STAGES.length - 1)) * 66.67}%`,
            backgroundColor: STAGE_COLORS[stage],
          }}
        />
      </div>
    </div>
  );
}
