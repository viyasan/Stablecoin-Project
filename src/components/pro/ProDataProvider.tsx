import { createContext, useContext } from 'react';
import type { MarketSummary, MarketCapDataPoint, StablecoinWithSnapshot } from '../../types';
import type { UseApiResult } from '../../types/yield';
import { useMarketSummary, useStablecoinList, useMarketCapChart } from '../../api';

interface ProDataContextValue {
  market: UseApiResult<MarketSummary>;
  stablecoins: UseApiResult<StablecoinWithSnapshot[]>;
  chart30d: UseApiResult<MarketCapDataPoint[]>;
}

const ProDataContext = createContext<ProDataContextValue | null>(null);

export function ProDataProvider({ children }: { children: React.ReactNode }) {
  const market = useMarketSummary();
  const stablecoins = useStablecoinList();
  const chart30d = useMarketCapChart('30d');

  return (
    <ProDataContext.Provider value={{ market, stablecoins, chart30d }}>
      {children}
    </ProDataContext.Provider>
  );
}

export function useProData() {
  const ctx = useContext(ProDataContext);
  if (!ctx) throw new Error('useProData must be used within ProDataProvider');
  return ctx;
}
