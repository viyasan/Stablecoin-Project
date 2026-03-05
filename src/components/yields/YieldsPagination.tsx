interface YieldsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}

export function YieldsPagination({ currentPage, totalPages, onPageChange }: YieldsPaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-chrome-100 text-chrome-600 hover:bg-chrome-200"
      >
        Previous
      </button>

      {visiblePages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-chrome-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-gold-500 text-white'
                : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-chrome-100 text-chrome-600 hover:bg-chrome-200"
      >
        Next
      </button>
    </div>
  );
}
