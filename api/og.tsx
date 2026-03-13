import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'nodejs',
};

interface MarketData {
  totalMarketCap: number;
  change30d: number;
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

async function fetchMarketData(): Promise<MarketData> {
  const [stablecoinsRes, chartsRes] = await Promise.all([
    fetch('https://stablecoins.llama.fi/stablecoins?includePrices=true'),
    fetch('https://stablecoins.llama.fi/stablecoincharts/all'),
  ]);

  if (!stablecoinsRes.ok || !chartsRes.ok) {
    throw new Error('DefiLlama API error');
  }

  const stablecoinsData = await stablecoinsRes.json();
  const chartsData: { date: string; totalCirculatingUSD?: { peggedUSD: number }; totalCirculating?: { peggedUSD: number } }[] = await chartsRes.json();

  // Calculate total market cap from stablecoins list
  let totalMarketCap = 0;
  for (const coin of stablecoinsData.peggedAssets) {
    totalMarketCap += coin.circulating?.peggedUSD || 0;
  }

  // Calculate 30d change from chart data
  const latestPoint = chartsData[chartsData.length - 1];
  const currentFromChart = latestPoint?.totalCirculatingUSD?.peggedUSD
    ?? latestPoint?.totalCirculating?.peggedUSD
    ?? totalMarketCap;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let thirtyDayPoint = chartsData[0];
  let minDiff = Infinity;
  for (const point of chartsData) {
    const diff = Math.abs(parseInt(point.date) * 1000 - thirtyDaysAgo);
    if (diff < minDiff) {
      minDiff = diff;
      thirtyDayPoint = point;
    }
  }

  const thirtyDayValue = thirtyDayPoint?.totalCirculatingUSD?.peggedUSD
    ?? thirtyDayPoint?.totalCirculating?.peggedUSD
    ?? currentFromChart;

  const change30d = thirtyDayValue > 0
    ? Math.round(((currentFromChart - thirtyDayValue) / thirtyDayValue) * 10000) / 100
    : 0;

  return { totalMarketCap, change30d };
}

export default async function handler() {
  let marketData: MarketData | null = null;

  try {
    marketData = await fetchMarketData();
  } catch {
    // Fallback: render branding without live data
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1A1D21',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex: 1,
          }}
        >
          {/* Left side: branding */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: '560px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: '#D4A437',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                display: 'flex',
              }}
            >
              Real-Time Market Data
            </div>
            <div
              style={{
                fontSize: '52px',
                fontWeight: 800,
                lineHeight: 1.1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>Everything</span>
              <span style={{ color: '#D4A437' }}>Stablecoins</span>
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#9CA3AF',
                marginTop: '20px',
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              A comprehensive outlook on the global stablecoin market
            </div>
          </div>

          {/* Right side: live data */}
          {marketData && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center',
                minWidth: '380px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: '#9CA3AF',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '12px',
                  display: 'flex',
                }}
              >
                Total Market Cap
              </div>
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 800,
                  color: '#D4A437',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                {formatMarketCap(marketData.totalMarketCap)}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '16px',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: marketData.change30d >= 0 ? '#22C55E' : '#EF4444',
                    display: 'flex',
                  }}
                >
                  {formatChange(marketData.change30d)}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#9CA3AF',
                    fontWeight: 400,
                    display: 'flex',
                  }}
                >
                  30d change
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #2D3139',
            paddingTop: '24px',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#D4A437',
              display: 'flex',
            }}
          >
            stablecoinstats.xyz
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#6B7280',
              display: 'flex',
            }}
          >
            Track USDT, USDC, DAI & 200+ stablecoins
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
