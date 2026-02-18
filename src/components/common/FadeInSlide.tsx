import type { ReactNode } from 'react';

interface FadeInSlideProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInSlide({ children, delay = 0, className = '' }: FadeInSlideProps) {
  return (
    <div
      className={`animate-fade-in-slide ${className}`}
      style={{ animationDelay: delay > 0 ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
