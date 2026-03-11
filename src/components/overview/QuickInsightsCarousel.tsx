import { useState, useEffect, useCallback, useRef } from 'react';
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
    text: "Ethereum and Tron blockchains host over 80% of all stablecoin value.",
  },
  {
    id: 5,
    text: "There are over 340+ stablecoins tracked, but only 10 have market caps exceeding $1 billion.",
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

const FLIP_HALF_DURATION = 250; // ms — matches animation duration in tailwind config

export function QuickInsightsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isFlipping, setIsFlipping] = useState(false);
  const pendingIndex = useRef<number | null>(null);

  const navigate = useCallback((newIndex: number, dir: 'left' | 'right') => {
    if (isFlipping) return;
    setDirection(dir);
    setIsFlipping(true);
    pendingIndex.current = newIndex;

    // After the exit animation completes, swap the content and play the enter animation
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFlipping(false);
      pendingIndex.current = null;
    }, FLIP_HALF_DURATION);
  }, [isFlipping]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % INSIGHTS.length;
      navigate(nextIndex, 'right');
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, navigate]);

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + INSIGHTS.length) % INSIGHTS.length;
    navigate(prevIndex, 'left');
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % INSIGHTS.length;
    navigate(nextIndex, 'right');
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    navigate(index, index > currentIndex ? 'right' : 'left');
  };

  // Determine animation class
  let flipClass = '';
  if (isFlipping) {
    // Exit phase: current card flips out
    flipClass = direction === 'right' ? 'animate-flip-out-left' : 'animate-flip-out-right';
  } else {
    // Enter phase: new card flips in (or initial render with no animation)
    flipClass = direction === 'right' ? 'animate-flip-in-right' : 'animate-flip-in-left';
  }

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

          <div
            className="flex-1 px-6 relative overflow-hidden flex items-center justify-center"
            style={{ perspective: '800px' }}
          >
            <div
              key={`${INSIGHTS[currentIndex].id}-${isFlipping ? 'out' : 'in'}`}
              className={`relative bg-white rounded-lg border border-chrome-200 px-10 py-8 w-full ${flipClass}`}
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              {/* Corner ornaments — matching WordDefinitionCard */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-gold-500/50" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-gold-500/50" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-gold-500/50" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-gold-500/50" />

              <p className="text-chrome-900 text-2xl font-normal text-center leading-relaxed">
                {INSIGHTS[currentIndex].text}
              </p>
            </div>
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
