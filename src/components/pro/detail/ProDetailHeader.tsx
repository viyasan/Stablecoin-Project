interface ProDetailHeaderProps {
  coin: {
    symbol: string;
    name: string;
    price: number;
    priceDeviation: number;
    marketCap: number;
    change7d: number;
    change30d: number;
    dominantChain: string;
    issuerType: string;
    pegCurrency: string;
  };
}

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function deviationColor(deviation: number): string {
  const abs = Math.abs(deviation);
  if (abs < 0.1) return 'text-status-positive';
  if (abs < 0.5) return 'text-gold-500';
  return 'text-status-negative';
}

function changeColor(value: number): string {
  return value >= 0 ? 'text-status-positive' : 'text-status-negative';
}

export function ProDetailHeader({ coin }: ProDetailHeaderProps) {
  return (
    <div className="border-b border-pro-border pb-6 mb-6">
      {/* Top row: name + symbol badge */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-pro-text">{coin.name}</h1>
        <span className="bg-pro-elevated px-2 py-0.5 rounded text-gold-500 font-mono text-sm">
          {coin.symbol}
        </span>
      </div>

      {/* Price + deviation */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-mono font-bold text-pro-text">
          ${coin.price.toFixed(4)}
        </span>
        <span className={`text-sm font-mono ${deviationColor(coin.priceDeviation)}`}>
          {coin.priceDeviation >= 0 ? '+' : ''}
          {coin.priceDeviation.toFixed(4)}%
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mt-4 flex-wrap">
        <div>
          <p className="text-pro-text-muted text-xs uppercase font-mono">Market Cap</p>
          <p className="text-pro-text font-mono text-sm font-semibold">
            {formatCompactCurrency(coin.marketCap)}
          </p>
        </div>
        <div>
          <p className="text-pro-text-muted text-xs uppercase font-mono">7d Change</p>
          <p className={`font-mono text-sm font-semibold ${changeColor(coin.change7d)}`}>
            {formatSignedPercent(coin.change7d)}
          </p>
        </div>
        <div>
          <p className="text-pro-text-muted text-xs uppercase font-mono">30d Change</p>
          <p className={`font-mono text-sm font-semibold ${changeColor(coin.change30d)}`}>
            {formatSignedPercent(coin.change30d)}
          </p>
        </div>
        <div>
          <p className="text-pro-text-muted text-xs uppercase font-mono">Chain</p>
          <p className="text-pro-text font-mono text-sm font-semibold">
            {coin.dominantChain}
          </p>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex gap-2 mt-4">
        <span className="bg-pro-elevated text-pro-text-secondary text-xs px-2 py-0.5 rounded">
          {coin.issuerType}
        </span>
        <span className="bg-pro-elevated text-pro-text-secondary text-xs px-2 py-0.5 rounded">
          {coin.pegCurrency}
        </span>
      </div>
    </div>
  );
}
