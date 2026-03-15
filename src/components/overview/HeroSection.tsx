import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalKpiCard } from './GlobalKpiCard';

const ROTATING_NAMES = [
  'digital dollars',
  'USDC',
  'USDT',
  'CADC',
  'USD1',
  'PYUSD',
  'USDG',
  'USDS',
  'USDe',
  'DAI',
];

const CHAINS = [
  'Ethereum',
  'Tron',
  'Solana',
  'Arbitrum',
  'Base',
  'Polygon',
  'Avalanche',
  'BSC',
  'TON',
  'Optimism',
  'Stellar',
  'Sui',
  'Aptos',
];

export function HeroSection() {
  const [nameIndex, setNameIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hold "digital dollars" for 4s on first load, then 2s per coin
    const firstDelay = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setNameIndex(1);
        setVisible(true);
      }, 400);
    }, 4000);

    return () => clearTimeout(firstDelay);
  }, []);

  useEffect(() => {
    // Only start the 2s cycle after the first coin appears
    if (nameIndex === 0) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setNameIndex((prev) => {
          const next = prev + 1;
          return next >= ROTATING_NAMES.length ? 1 : next;
        });
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, [nameIndex > 0]);

  return (
    <section className="relative rounded-2xl bg-white border border-chrome-200 mb-8">
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 bg-hero-grid pointer-events-none" />
      <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-[280px] h-[280px] rounded-full bg-gold-500/8 blur-2xl pointer-events-none" />
      <div className="absolute top-[10%] left-[33%] w-px h-[60%] bg-gradient-to-b from-transparent via-gold-500/12 to-transparent pointer-events-none" />
      <div className="absolute top-[30%] right-[25%] w-px h-[40%] bg-gradient-to-b from-transparent via-gold-500/12 to-transparent pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-6 sm:gap-8 p-5 sm:p-8 lg:p-12">
        {/* Left column */}
        <div>
          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight text-chrome-800 mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Tracking
            <br />
            <span className="inline-block h-[1.2em]">
              <em
                className="text-gold-500 inline-block transition-opacity duration-400"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {ROTATING_NAMES[nameIndex]}
              </em>
            </span>
            <br />
            on-chain.
          </h1>

          {/* Subhead */}
          <p className="font-mono text-sm text-chrome-400 leading-relaxed max-w-md mb-8 tracking-wide">
            Stablecoin growth and dominance tracker, global digital asset
            regulatory progress, yield and insights, all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/countries"
              className="inline-flex items-center px-6 py-3 bg-gold-500 text-white text-sm font-medium rounded-md hover:bg-gold-600 transition-colors"
            >
              Explore Markets
            </Link>
            <Link
              to="/yields"
              className="inline-flex items-center px-6 py-3 border border-gold-500 text-gold-600 text-sm font-medium rounded-md hover:bg-gold-50 transition-colors"
            >
              View Yield
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="flex justify-center lg:justify-end">
          <GlobalKpiCard />
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="relative z-10 border-t border-chrome-200 px-5 sm:px-8 lg:px-12 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {CHAINS.map((chain) => (
            <span
              key={chain}
              className="font-mono text-[11px] text-chrome-400 tracking-wide"
            >
              {chain}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
