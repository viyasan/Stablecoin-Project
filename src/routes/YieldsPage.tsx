import { useState, useMemo } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { YieldsFilterBar, YieldsTable, YieldsPagination, SkeletonYieldsTable } from '../components/yields';
import { useStablecoinYields } from '../api/yieldApi';
import type { SortField, SortOrder } from '../components/yields/YieldsTable';

const ROWS_PER_PAGE = 15;

export function YieldsPage() {
  const { data, isLoading, error, refetch } = useStablecoinYields();

  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('tvlUsd');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters or sort change
  const handleChainChange = (chain: string | null) => {
    setSelectedChain(chain);
    setCurrentPage(1);
  };
  const handleTokenChange = (token: string | null) => {
    setSelectedToken(token);
    setCurrentPage(1);
  };
  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Filter → sort → paginate
  const { paginatedPools, filteredCount, totalPages } = useMemo(() => {
    if (!data) return { paginatedPools: [], filteredCount: 0, totalPages: 0 };

    let pools = data.data;

    if (selectedChain) pools = pools.filter(p => p.chain === selectedChain);
    if (selectedToken) pools = pools.filter(p => p.symbol === selectedToken);

    pools = [...pools].sort((a, b) => {
      const aVal = a[sortBy] ?? -1;
      const bVal = b[sortBy] ?? -1;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    const total = Math.ceil(pools.length / ROWS_PER_PAGE);
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const paginated = pools.slice(start, start + ROWS_PER_PAGE);

    return { paginatedPools: paginated, filteredCount: pools.length, totalPages: total };
  }, [data, selectedChain, selectedToken, sortBy, sortOrder, currentPage]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-chrome-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-chrome-600" />
          </div>
          <h1 className="text-3xl font-bold text-chrome-800">Stablecoin Yields</h1>
        </div>
        <p className="text-chrome-600">
          Compare live stablecoin yields across DeFi protocols and chains.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && <SkeletonYieldsTable />}

      {/* Error state */}
      {error && (
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 py-16 flex flex-col items-center justify-center text-center">
          <p className="text-chrome-600 mb-4">Failed to load yield data. Please try again.</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Loaded state */}
      {data && !isLoading && (
        <>
          <YieldsFilterBar
            chains={data.chains}
            tokens={data.tokens}
            selectedChain={selectedChain}
            selectedToken={selectedToken}
            onChainChange={handleChainChange}
            onTokenChange={handleTokenChange}
            resultCount={filteredCount}
          />

          <YieldsTable
            pools={paginatedPools}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            projectLogos={data.projectLogos}
          />

          <YieldsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Attribution */}
          <p className="text-center text-xs text-chrome-400 mt-6">
            Data sourced from{' '}
            <a
              href="https://defillama.com/yields"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-chrome-600"
            >
              DeFi Llama
            </a>
          </p>
        </>
      )}
    </PageContainer>
  );
}
