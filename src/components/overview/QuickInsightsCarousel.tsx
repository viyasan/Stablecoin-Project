import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

// Hardcoded insights - update weekly
// Last updated: March 2026
const INSIGHTS = [
  {
    id: 1,
    text: "USDT and USDC together control over 83% of the $313 billion stablecoin market.",
  },
  {
    id: 2,
    text: "Ethereum and Tron blockchains host over 80% of all stablecoin value, with Tron alone holding $84B in stablecoins.",
  },
  {
    id: 5,
    text: "There are over 250 stablecoins being tracked, but only about 10 have market caps exceeding $1 billion.",
  },
  {
    id: 6,
    text: "Fiat-backed stablecoins dominate, representing over 90% of total market value. 95%+ of which are USD-pegged.",
  },
  {
    id: 7,
    text: "The stablecoin market grew 49% in 2025, adding over $100 billion to reach $306B in total market cap.",
  },
];

export function QuickInsightsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + INSIGHTS.length) % INSIGHTS.length);
  };

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  return (
    <div
      className="bg-white border border-gold-500 rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-chrome-100">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-chrome-900">
            Quick Market Insights
          </h3>
        </div>
        <span className="text-xs text-chrome-500">
          Last updated: March 2026
        </span>
      </div>
      <div className="px-6 py-5 flex-1 flex flex-col min-h-0">

        {/* Insight Content */}
        <div className="relative flex-1 flex items-center justify-center">
          <button
            onClick={goToPrevious}
            className="absolute left-0 -ml-2 p-1 z-10 text-gold-500 hover:text-gold-600 hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
            aria-label="Previous insight"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 px-6 relative overflow-hidden flex items-center justify-center">
            <p
              key={INSIGHTS[currentIndex].id}
              className={`text-chrome-800 text-2xl font-normal text-center leading-relaxed ${
                direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
              }`}
            >
              {INSIGHTS[currentIndex].text}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 -mr-2 p-1 z-10 text-gold-500 hover:text-gold-600 hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
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
              className={`h-2 rounded-full transition-all duration-150 ease-out hover:scale-125 active:scale-100 ${
                index === currentIndex
                  ? 'bg-gold-500 w-4'
                  : 'bg-chrome-300 hover:bg-chrome-400 w-2'
              }`}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
