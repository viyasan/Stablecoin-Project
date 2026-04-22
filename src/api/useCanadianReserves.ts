import { useState, useEffect, useCallback } from 'react';

export interface CanadianReserveSupply {
  cadc: number | null;
  qcad: number | null;
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

async function fetchCadcSupply(): Promise<number> {
  const res = await fetch(`https://stablecoins.llama.fi/stablecoins`);
  if (!res.ok) throw new Error('DefiLlama fetch failed');
  const json = await res.json();
  const cadc = json.peggedAssets?.find((a: { id: string }) => a.id === CADC_DEFILLAMA_ID);
  if (!cadc) throw new Error('CADC not found in DefiLlama');
  return cadc.circulating?.peggedCAD ?? 0;
}

async function fetchQcadSupply(): Promise<number> {
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
  const raw = BigInt(json.result);
  return Number(raw) / 10 ** QCAD_ETH_DECIMALS;
}

export function useCanadianReserves(): UseApiResult<CanadianReserveSupply> {
  const [data, setData] = useState<CanadianReserveSupply | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cadc, qcad] = await Promise.allSettled([fetchCadcSupply(), fetchQcadSupply()]);
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
