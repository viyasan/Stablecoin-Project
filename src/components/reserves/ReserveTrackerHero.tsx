import { Shield } from 'lucide-react';
import type { CoinSymbol, StablecoinReserveHistory } from '../../data/reserveHistory';

const COINS: CoinSymbol[] = ['USDC', 'USDT', 'DAI'];

const COIN_COLORS: Record<CoinSymbol, string> = {
  USDT: 'bg-green-600 text-white',
  USDC: 'bg-blue-600 text-white',
  DAI: 'bg-yellow-500 text-white',
};

interface ReserveTrackerHeroProps {
  selected: CoinSymbol;
  onSelect: (coin: CoinSymbol) => void;
  coinData: StablecoinReserveHistory;
}

export function ReserveTrackerHero({ selected, onSelect, coinData }: ReserveTrackerHeroProps) {
  const latestSnapshot = coinData.history[coinData.history.length - 1];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-chrome-100 rounded-lg">
          <Shield className="w-6 h-6 text-chrome-600" />
        </div>
        <h1 className="text-3xl font-bold text-chrome-800">Reserve Tracker</h1>
        <span className="px-2.5 py-1 text-xs font-medium bg-gold-50 text-gold-600 rounded-full border border-gold-100">
          Coming Soon
        </span>
      </div>
      <p className="text-chrome-500 text-lg mb-6">
        Track how stablecoin reserve compositions change over time using attestation reports and on-chain data.
      </p>

      <div className="flex gap-2 mb-6">
        {COINS.map((coin) => (
          <button
            key={coin}
            onClick={() => onSelect(coin)}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-colors ${
              selected === coin
                ? COIN_COLORS[coin]
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            {coin}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-chrome-600">
        <span>
          <span className="text-chrome-400">Issuer:</span>{' '}
          <span className="font-medium text-chrome-800">{coinData.issuer}</span>
        </span>
        <span>
          <span className="text-chrome-400">Frequency:</span>{' '}
          <span className="font-medium text-chrome-800 capitalize">{coinData.reportFrequency}</span>
        </span>
        <span>
          <span className="text-chrome-400">Latest Report:</span>{' '}
          <span className="font-medium text-chrome-800">
            {latestSnapshot ? latestSnapshot.reportPeriod : 'No reports yet'}
          </span>
        </span>
      </div>
    </div>
  );
}
