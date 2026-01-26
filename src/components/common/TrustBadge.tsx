type BadgeVariant = 'defillama' | 'allium' | 'coindesk' | 'cointelegraph';

interface TrustBadgeProps {
  variant: BadgeVariant;
}

const badgeConfig: Record<BadgeVariant, { name: string; url: string }> = {
  defillama: {
    name: 'DefiLlama',
    url: 'https://defillama.com/',
  },
  allium: {
    name: 'Allium',
    url: 'https://www.allium.so/',
  },
  coindesk: {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/',
  },
  cointelegraph: {
    name: 'CoinTelegraph',
    url: 'https://cointelegraph.com/',
  },
};

export function TrustBadge({ variant }: TrustBadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span className="text-xs text-gray-400 flex items-center gap-1">
      <span className="italic">Powered by</span>
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
      >
        {config.name}
      </a>
    </span>
  );
}
