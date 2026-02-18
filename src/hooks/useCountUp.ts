import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  easing?: 'easeOut' | 'easeInOut' | 'linear';
  formatter?: (value: number) => string;
  shouldAnimate?: boolean;
  delay?: number;
}

export function useCountUp({
  start = 0,
  end,
  duration = 1400,
  decimals = 0,
  easing = 'easeOut',
  formatter,
  shouldAnimate = true,
  delay = 0,
}: UseCountUpOptions) {
  const [count, setCount] = useState<number>(start);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  // Tracks the live displayed value each frame so tab switches animate from
  // the current position. StrictMode cleanup fires before any frames run,
  // so it naturally resets to the initial value (0) on remount.
  const currentValueRef = useRef<number>(start);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      currentValueRef.current = end;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      currentValueRef.current = end;
      return;
    }

    const actualStart = currentValueRef.current;

    let delayTimer: ReturnType<typeof setTimeout> | undefined;

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
      currentValueRef.current = currentCount;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = undefined;
      }
    };

    if (delay > 0) {
      delayTimer = setTimeout(() => {
        frameRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      clearTimeout(delayTimer);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = undefined;
    };
  }, [end, duration, easing, shouldAnimate, delay]);

  const displayValue = formatter ? formatter(count) : count.toFixed(decimals);

  return { count, displayValue };
}
