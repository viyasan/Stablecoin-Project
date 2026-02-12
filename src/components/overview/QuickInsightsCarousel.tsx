import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

// Hardcoded insights - update weekly
// Last updated: February 2026
const INSIGHTS = [
  {
    id: 1,
    text: "USDT and USDC together control 83% of the $314 billion stablecoin market.",
  },
  {
    id: 2,
    text: "Ethereum and Tron host over 80% of all stablecoin value, with Tron alone holding $80B+ in USDT.",
  },
  {
    id: 3,
    text: "Stablecoin transaction volume hit a record $33 trillion in 2025, up 72% from the prior year.",
  },
  {
    id: 4,
    text: "Ethereum processed $18.6 trillion in stablecoin transactions in 2025—a 125% increase from 2024.",
  },
  {
    id: 5,
    text: "There are over 250 stablecoins being tracked, but only about 10 have market caps exceeding $1 billion.",
  },
  {
    id: 6,
    text: "Fiat-backed stablecoins dominate, representing over 90% of total market value—95%+ of which are USD-pegged.",
  },
  {
    id: 7,
    text: "The stablecoin market grew 46% in 2025, adding nearly $100 billion to reach $300B+ in total market cap.",
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
      className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg shadow-sm overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gold-200" />
            <h3 className="text-sm font-semibold text-gold-100 uppercase tracking-wide">
              Quick Market Insights
            </h3>
          </div>
          <span className="text-xs text-gold-200">
            Last updated: February 2026
          </span>
        </div>

        {/* Insight Content */}
        <div className="relative min-h-[60px] flex items-center">
          <button
            onClick={goToPrevious}
            className="absolute left-0 -ml-2 p-1 text-gold-200 hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
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
            className="absolute right-0 -mr-2 p-1 text-gold-200 hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 ease-out"
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
                  : 'bg-gold-300 hover:bg-gold-200'
              }`}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
