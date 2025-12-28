import { useWeeklyBriefing } from '../../api';
import { Spinner } from '../common';

function formatWeekOf(dateString: string): string {
  const date = new Date(dateString);
  return `Week of ${date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function WeeklyBriefingCard() {
  const { data: briefing, isLoading, error, refetch } = useWeeklyBriefing();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center h-32">
          <Spinner size="lg" className="border-white/30 border-t-white" />
        </div>
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-white/80 mb-4">Failed to load briefing</p>
            <button
              onClick={refetch}
              className="text-white hover:text-white/80 font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-2">
              Weekly Briefing
            </span>
            <h2 className="text-xl font-bold text-white">{briefing.title}</h2>
            <p className="text-primary-100 text-sm mt-1">
              {formatWeekOf(briefing.weekOf)}
            </p>
          </div>
        </div>

        <p className="text-white/90 leading-relaxed mb-6">
          {briefing.summaryParagraph}
        </p>

        {briefing.topEvents && briefing.topEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">
              Key Events This Week
            </h3>
            <div className="space-y-3">
              {briefing.topEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/10 rounded-lg p-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-white/70 mt-0.5">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
