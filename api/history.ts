import { supabaseAnon } from './_lib/supabase-server';

const CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
};

const ALLOWED_DAYS = new Set([7, 30, 90]);
const ALLOWED_METRICS = new Set([
  'dominance_pct',
  'market_cap',
  'price_usd',
  'peg_deviation',
]);

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const coin = url.searchParams.get('coin');
    const daysParam = parseInt(url.searchParams.get('days') || '30', 10);
    const metric = url.searchParams.get('metric') || 'dominance_pct';

    const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 30;
    if (!ALLOWED_METRICS.has(metric)) {
      return new Response(
        JSON.stringify({ error: `Invalid metric. Allowed: ${[...ALLOWED_METRICS].join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const since = new Date(Date.now() - days * 86400_000).toISOString();

    // For market_cap without a specific coin, return total market cap from market_summaries
    if (metric === 'market_cap' && !coin) {
      const { data, error } = await supabaseAnon
        .from('market_summaries')
        .select('total_market_cap, fetched_at')
        .gte('fetched_at', since)
        .order('fetched_at', { ascending: true });

      if (error) throw error;

      const result = (data ?? []).map((row) => ({
        timestamp: row.fetched_at,
        totalMarketCap: Number(row.total_market_cap),
      }));

      return new Response(JSON.stringify(result), { status: 200, headers: CACHE_HEADERS });
    }

    // For per-coin queries, read from snapshots
    let query = supabaseAnon
      .from('snapshots')
      .select(`coin_id, gecko_id, symbol, ${metric}, fetched_at`)
      .gte('fetched_at', since)
      .order('fetched_at', { ascending: true });

    if (coin) {
      query = query.eq('coin_id', coin);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group by coin_id
    const grouped: Record<string, Array<{ date: string; value: number; symbol: string }>> = {};
    for (const row of data ?? []) {
      const key = row.gecko_id || row.coin_id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        date: row.fetched_at,
        value: Number(row[metric as keyof typeof row]),
        symbol: row.symbol,
      });
    }

    return new Response(JSON.stringify(grouped), { status: 200, headers: CACHE_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
