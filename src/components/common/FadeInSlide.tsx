import type { ReactNode } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface FadeInSlideProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInSlide({ children, delay = 0, className = '' }: FadeInSlideProps) {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`${isIntersecting ? 'animate-fade-in-slide' : 'opacity-0'} ${className}`}
      style={{ animationDelay: isIntersecting && delay > 0 ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
