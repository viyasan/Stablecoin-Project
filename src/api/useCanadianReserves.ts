import { useState, useEffect, useCallback } from 'react';

export interface ChainSupply {
  chain: string;
  amount: number;
}

export interface CanadianReserveSupply {
  cadc: ChainSupply[] | null;
  qcad: ChainSupply[] | null;
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const CADC_DEFILLAMA_ID = '145';
const QCAD_ETH_CONTRACT = '0x4a16baf414b8e637ed12019fad5dd705735db2e0';
const QCAD_ETH_DECIMALS = 2;
const ETH_RPC = 'https://ethereum.publicnode.com';

async function fetchCadcChains(): Promise<ChainSupply[]> {
  const res = await fetch('https://stablecoins.llama.fi/stablecoins');
  if (!res.ok) throw new Error('DefiLlama fetch failed');
  const json = await res.json();
  const cadc = json.peggedAssets?.find((a: { id: string }) => a.id === CADC_DEFILLAMA_ID);
  if (!cadc) throw new Error('CADC not found in DefiLlama');

  const chains: ChainSupply[] = Object.entries(
    cadc.chainCirculating as Record<string, { current: { peggedCAD: number } }>
  )
    .map(([chain, data]) => ({ chain, amount: data.current?.peggedCAD ?? 0 }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return chains;
}

async function fetchQcadChains(): Promise<ChainSupply[]> {
  const res = await fetch(ETH_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to: QCAD_ETH_CONTRACT, data: '0x18160ddd' }, 'latest'],
      id: 1,
    }),
  });
  if (!res.ok) throw new Error('Ethereum RPC fetch failed');
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  const amount = Number(BigInt(json.result)) / 10 ** QCAD_ETH_DECIMALS;
  return amount > 0 ? [{ chain: 'Ethereum', amount }] : [];
}

export function useCanadianReserves(): UseApiResult<CanadianReserveSupply> {
  const [data, setData] = useState<CanadianReserveSupply | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cadc, qcad] = await Promise.allSettled([fetchCadcChains(), fetchQcadChains()]);
      setData({
        cadc: cadc.status === 'fulfilled' ? cadc.value : null,
        qcad: qcad.status === 'fulfilled' ? qcad.value : null,
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
