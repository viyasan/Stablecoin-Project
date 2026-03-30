import { supabaseAdmin } from '../_lib/supabase-server';

const DEFILLAMA_STABLECOINS_API = 'https://stablecoins.llama.fi/stablecoins?includePrices=true';
const DEFILLAMA_CHARTS_API = 'https://stablecoins.llama.fi/stablecoincharts/all';

const TOP_N = 10;

interface DefiLlamaStablecoin {
  id: string;
  name: string;
  symbol: string;
  gecko_id: string;
  pegType: string;
  pegMechanism: string;
  price: number;
  circulating: { peggedUSD: number };
  circulatingPrevDay: { peggedUSD: number };
  circulatingPrevWeek: { peggedUSD: number };
  circulatingPrevMonth: { peggedUSD: number };
}

interface DefiLlamaChartPoint {
  date: string;
  totalCirculating: { peggedUSD: number };
  totalCirculatingUSD: { peggedUSD: number };
}

function findClosestDataPoint(
  chartsData: DefiLlamaChartPoint[],
  targetTimestamp: number,
): DefiLlamaChartPoint | null {
  let closest: DefiLlamaChartPoint | null = null;
  let minDiff = Infinity;
  for (const point of chartsData) {
    const diff = Math.abs(parseInt(point.date) * 1000 - targetTimestamp);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }
  return closest;
}

function chartValue(point: DefiLlamaChartPoint | null): number {
  if (!point) return 0;
  return point.totalCirculatingUSD?.peggedUSD || point.totalCirculating?.peggedUSD || 0;
}

export default async function handler(req: Request): Promise<Response> {
  // Validate cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch both DefiLlama endpoints in parallel
    const [stablecoinsRes, chartsRes] = await Promise.all([
      fetch(DEFILLAMA_STABLECOINS_API),
      fetch(DEFILLAMA_CHARTS_API),
    ]);

    if (!stablecoinsRes.ok) throw new Error(`DefiLlama stablecoins API returned ${stablecoinsRes.status}`);
    if (!chartsRes.ok) throw new Error(`DefiLlama charts API returned ${chartsRes.status}`);

    const stablecoinsData = await stablecoinsRes.json();
    const chartsData: DefiLlamaChartPoint[] = await chartsRes.json();
    const coins: DefiLlamaStablecoin[] = stablecoinsData.peggedAssets;

    // Calculate total market cap from ALL coins
    let totalMarketCap = 0;
    let totalPrevDay = 0;
    for (const coin of coins) {
      totalMarketCap += coin.circulating?.peggedUSD || 0;
      totalPrevDay += coin.circulatingPrevDay?.peggedUSD || 0;
    }

    // Use chart data for 7d and 30d changes (matches existing marketApi.ts logic)
    const now = Date.now();
    const latestChartPoint = chartsData[chartsData.length - 1];
    const currentFromChart = chartValue(latestChartPoint) || totalMarketCap;
    const sevenDayValue = chartValue(findClosestDataPoint(chartsData, now - 7 * 86400_000));
    const thirtyDayValue = chartValue(findClosestDataPoint(chartsData, now - 30 * 86400_000));

    const change24h = totalPrevDay > 0
      ? Math.round(((totalMarketCap - totalPrevDay) / totalPrevDay) * 10000) / 100
      : 0;
    const change7d = sevenDayValue > 0
      ? Math.round(((currentFromChart - sevenDayValue) / sevenDayValue) * 10000) / 100
      : 0;
    const change30d = thirtyDayValue > 0
      ? Math.round(((currentFromChart - thirtyDayValue) / thirtyDayValue) * 10000) / 100
      : 0;

    const fetchedAt = new Date().toISOString();

    // Insert market summary
    const { error: summaryError } = await supabaseAdmin
      .from('market_summaries')
      .insert({
        total_market_cap: totalMarketCap,
        change_24h: change24h,
        change_24h_value: totalMarketCap - totalPrevDay,
        change_7d: change7d,
        change_7d_value: currentFromChart - sevenDayValue,
        change_30d: change30d,
        change_30d_value: currentFromChart - thirtyDayValue,
        tracked_stablecoins: coins.filter((c) => (c.circulating?.peggedUSD || 0) > 0).length,
        fetched_at: fetchedAt,
      });

    if (summaryError) throw new Error(`Supabase market_summaries insert failed: ${summaryError.message}`);

    // Sort by circulating market cap, take top N
    const topCoins = coins
      .filter((c) => (c.circulating?.peggedUSD || 0) > 0)
      .sort((a, b) => (b.circulating?.peggedUSD || 0) - (a.circulating?.peggedUSD || 0))
      .slice(0, TOP_N);

    const snapshotRows = topCoins.map((coin) => {
      const marketCap = coin.circulating?.peggedUSD || 0;
      return {
        coin_id: coin.id,
        gecko_id: coin.gecko_id || null,
        symbol: coin.symbol,
        name: coin.name,
        price_usd: coin.price || null,
        market_cap: marketCap,
        volume_24h: null,
        peg_deviation: coin.price ? Math.round((coin.price - 1) * 1_000_000) / 1_000_000 : null,
        dominance_pct: totalMarketCap > 0
          ? Math.round((marketCap / totalMarketCap) * 10000) / 100
          : null,
        peg_type: coin.pegType || null,
        peg_mechanism: coin.pegMechanism || null,
        fetched_at: fetchedAt,
      };
    });

    const { error: snapshotsError } = await supabaseAdmin
      .from('snapshots')
      .insert(snapshotRows);

    if (snapshotsError) throw new Error(`Supabase snapshots insert failed: ${snapshotsError.message}`);

    return new Response(
      JSON.stringify({
        ok: true,
        total_market_cap: totalMarketCap,
        snapshots_count: snapshotRows.length,
        top_coins: snapshotRows.map((r) => r.symbol),
        fetched_at: fetchedAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
