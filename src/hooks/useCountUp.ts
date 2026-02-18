import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  easing?: 'easeOut' | 'easeInOut' | 'linear';
  formatter?: (value: number) => string;
  shouldAnimate?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 1400,
  decimals = 0,
  easing = 'easeOut',
  formatter,
  shouldAnimate = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState<number>(start);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const prevEndRef = useRef<number>(start);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const actualStart = prevEndRef.current;
    prevEndRef.current = end;

    const ease = (t: number): number => {
      if (easing === 'easeOut') {
        return 1 - Math.pow(1 - t, 3);
      }
      if (easing === 'easeInOut') {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }
      return t;
    };

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = ease(progress);

      const currentCount = actualStart + (end - actualStart) * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = undefined;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, easing, shouldAnimate]);

  const displayValue = formatter ? formatter(count) : count.toFixed(decimals);

  return { count, displayValue };
}
