import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

// Hardcoded insights - update weekly
// Last updated: January 2026
const INSIGHTS = [
  {
    id: 1,
    text: "USDT and USDC together control 87% of the entire stablecoin market, valued at over $270 billion.",
  },
  {
    id: 2,
    text: "Ethereum and Tron host 75% of all stablecoin value, with Ethereum leading at $126B and Tron at $66B.",
  },
  {
    id: 3,
    text: "The stablecoin market has processed over $29 trillion in adjusted transaction volume since 2019.",
  },
  {
    id: 4,
    text: "Over 722 million unique addresses have interacted with stablecoins across all chains.",
  },
  {
    id: 5,
    text: "There are currently 327 stablecoins being tracked, but only 10 have market caps over $1 billion.",
  },
  {
    id: 6,
    text: "Fiat-backed stablecoins dominate the market, representing over 95% of total stablecoin value.",
  },
  {
    id: 7,
    text: "The stablecoin market has grown 15% in the last 12 months, adding over $40 billion in market cap.",
  },
];

export function QuickInsightsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + INSIGHTS.length) % INSIGHTS.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary-200" />
          <h3 className="text-sm font-semibold text-primary-100 uppercase tracking-wide">
            Quick Market Insights
          </h3>
        </div>

        {/* Insight Content */}
        <div className="relative min-h-[60px] flex items-center">
          <button
            onClick={goToPrevious}
            className="absolute left-0 -ml-2 p-1 text-primary-200 hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
            aria-label="Previous insight"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 px-6">
            <p className="text-white text-lg font-medium text-center leading-relaxed">
              {INSIGHTS[currentIndex].text}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 -mr-2 p-1 text-primary-200 hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
            aria-label="Next insight"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {INSIGHTS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-150 ease-out hover:scale-125 active:scale-100 ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-primary-300 hover:bg-primary-200'
              }`}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
