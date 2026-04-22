import { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import {
  ReserveTrackerHero,
  ReserveCompositionTimeline,
  ReserveSnapshotTable,
  ReserveInsightsPanel,
} from '../components/reserves';
import { reserveHistories } from '../data/reserveHistory';
import type { CoinSymbol } from '../data/reserveHistory';

export function ReservesPage() {
  const [selected, setSelected] = useState<CoinSymbol>('USDC');
  const coinData = useMemo(
    () => reserveHistories.find((c) => c.symbol === selected) ?? null,
    [selected]
  );

  if (!coinData) return null;

  return (
    <PageContainer>
      <FadeInSlide>
        <ReserveTrackerHero
          selected={selected}
          onSelect={setSelected}
          coinData={coinData}
        />
      </FadeInSlide>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <FadeInSlide delay={150}>
          <ReserveInsightsPanel
            snapshots={coinData.history}
            symbol={coinData.symbol}
          />
        </FadeInSlide>
        <FadeInSlide delay={200} className="lg:col-span-2">
          <ReserveCompositionTimeline
            snapshots={coinData.history}
            symbol={coinData.symbol}
          />
        </FadeInSlide>
      </section>

      <section className="mb-8">
        <FadeInSlide delay={300}>
          <ReserveSnapshotTable
            snapshots={coinData.history}
            symbol={coinData.symbol}
          />
        </FadeInSlide>
      </section>
    </PageContainer>
  );
}
