import type { ReactNode, MouseEvent } from 'react';
import { useRef } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

const MAX_TILT = 6;

export function TiltCard({ children, className = '', maxTilt = MAX_TILT }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    const rotateY = offsetX * maxTilt;
    const rotateX = -offsetY * maxTilt;

    card.style.transition = 'transform 80ms linear';
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 400ms ease-out';
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }

  return (
    <div
      ref={cardRef}
      className={`group relative ${className}`}
      style={{ willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer sweep overlay — sweeps on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden z-10"
        aria-hidden
      >
        <div className="absolute top-0 left-0 h-full w-full -translate-x-full group-hover:animate-shimmer-sweep bg-gradient-to-r from-transparent via-[rgba(212,164,55,0.07)] to-transparent" />
      </div>
      {children}
    </div>
  );
}
