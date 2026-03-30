import { supabaseAnon } from './_lib/supabase-server';

const CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
};

export default async function handler(): Promise<Response> {
  try {
    const { data, error } = await supabaseAnon
      .from('latest_snapshot')
      .select('*')
      .order('market_cap', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
