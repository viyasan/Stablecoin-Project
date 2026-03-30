import { supabaseAnon } from './_lib/supabase-server';

const CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
};

export default async function handler(): Promise<Response> {
  try {
    const { data, error } = await supabaseAnon
      .from('latest_market_summary')
      .select('*')
      .single();

    if (error) throw error;
    if (!data) {
      return new Response(JSON.stringify(null), { status: 200, headers: CACHE_HEADERS });
    }

    // Map DB column names to the MarketSummary interface the frontend expects
    return new Response(
      JSON.stringify({
        totalMarketCap: Number(data.total_market_cap),
        change24h: Number(data.change_24h),
        change24hValue: Number(data.change_24h_value),
        change7d: Number(data.change_7d),
        change7dValue: Number(data.change_7d_value),
        change30d: Number(data.change_30d),
        change30dValue: Number(data.change_30d_value),
        trackedStablecoins: data.tracked_stablecoins,
        lastUpdated: data.fetched_at,
        dataSource: 'DefiLlama',
      }),
      { status: 200, headers: CACHE_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
