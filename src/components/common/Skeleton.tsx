interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Base skeleton element with pulse animation
 */
export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClass} ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton for KPI card content
 */
export function SkeletonKpiCard({ showSparkline = true }: { showSparkline?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width={180} height={20} />
          <Skeleton width={100} height={14} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={60} height={28} rounded="md" />
          <Skeleton width={70} height={28} rounded="md" />
          <Skeleton width={80} height={28} rounded="md" />
        </div>
      </div>
      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="flex flex-col items-center justify-center px-4 py-2">
            <Skeleton width={100} height={14} className="mb-2" />
            <Skeleton width={140} height={32} className="mb-2" />
            {showSparkline && (
              <div className="flex items-center gap-2 mt-1">
                <Skeleton width={80} height={24} />
                <Skeleton width={50} height={14} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center px-4 py-2">
            <Skeleton width={90} height={14} className="mb-2" />
            <Skeleton width={60} height={32} />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Skeleton width={200} height={12} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for chart content
 */
export function SkeletonChart({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <Skeleton width={160} height={20} className="mb-2" />
          <Skeleton width={200} height={12} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={50} height={28} rounded="md" />
          <Skeleton width={50} height={28} rounded="md" />
          <Skeleton width={50} height={28} rounded="md" />
        </div>
      </div>
      {/* Chart area */}
      <div className="p-6">
        <div className="relative" style={{ height }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between">
            <Skeleton width={40} height={10} />
            <Skeleton width={35} height={10} />
            <Skeleton width={40} height={10} />
            <Skeleton width={30} height={10} />
            <Skeleton width={40} height={10} />
          </div>
          {/* Chart placeholder */}
          <div className="ml-14 h-full flex items-end gap-1 pb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-200 animate-pulse rounded-t-sm"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-14 right-0 flex justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} width={30} height={10} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for pie chart
 */
export function SkeletonPieChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <Skeleton width={140} height={20} className="mb-1" />
        <Skeleton width={100} height={12} />
      </div>
      {/* Content */}
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-8">
          {/* Pie chart circle */}
          <Skeleton width={180} height={180} rounded="full" />
          {/* Legend */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton width={12} height={12} rounded="full" />
                <Skeleton width={60 + Math.random() * 40} height={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for news/headline list items
 */
export function SkeletonHeadlineList({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <Skeleton width={160} height={20} className="mb-1" />
          <Skeleton width={200} height={12} />
        </div>
        <Skeleton width={100} height={14} />
      </div>
      {/* List items */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4">
            {/* Thumbnail */}
            <Skeleton width={80} height={60} rounded="md" className="flex-shrink-0" />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Skeleton width="90%" height={16} className="mb-2" />
              <Skeleton width="70%" height={12} className="mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton width={60} height={10} />
                <Skeleton width={80} height={10} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for horizontal bar chart
 */
export function SkeletonBarChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <Skeleton width={180} height={20} className="mb-2" />
          <Skeleton width={160} height={12} />
        </div>
        <Skeleton width={80} height={28} rounded="md" />
      </div>
      {/* Bar chart */}
      <div className="p-6 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton width={80} height={14} className="flex-shrink-0" />
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <Skeleton
                height={24}
                width={`${90 - i * 10}%`}
                rounded="full"
              />
            </div>
            <Skeleton width={60} height={14} className="flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for country detail page
 */
export function SkeletonCountryDetail() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton width={120} height={16} />

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Skeleton width={200} height={32} className="mb-2" />
          <Skeleton width={100} height={20} />
        </div>
        <Skeleton width={120} height={28} rounded="full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Regulatory Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Skeleton width={160} height={20} className="mb-4" />
            <div className="space-y-2">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="80%" />
            </div>
            <div className="mt-4">
              <Skeleton width={100} height={14} className="mb-2" />
              <div className="flex gap-2">
                <Skeleton width={60} height={24} rounded="full" />
                <Skeleton width={80} height={24} rounded="full" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Skeleton width={100} height={20} className="mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <Skeleton width={80} height={14} className="flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton width="70%" height={16} className="mb-2" />
                    <Skeleton width="100%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Key Frameworks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Skeleton width={120} height={20} className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} width={150} height={14} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Canada page
 */
export function SkeletonCanadaPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton width={120} height={32} />
          <Skeleton width={32} height={32} rounded="md" />
        </div>
        <Skeleton width={320} height={20} />
      </div>

      {/* Company Profile Cards */}
      <section className="mb-8">
        <Skeleton width={200} height={24} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton height={80} rounded="none" />
              <div className="p-6 space-y-4">
                <Skeleton height={16} width="80%" />
                <Skeleton height={14} width="60%" />
                <Skeleton height={14} width="70%" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reserve & Transparency */}
      <section className="mb-8">
        <Skeleton width={180} height={24} className="mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton height={56} rounded="none" />
              <div className="p-5 space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Skeleton width={40} height={40} rounded="full" />
                    <div className="flex-1">
                      <Skeleton width="70%" height={14} className="mb-1" />
                      <Skeleton width="90%" height={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Skeleton width={160} height={20} />
          </div>
          <div className="p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                <Skeleton width={100} height={16} />
                <Skeleton width="30%" height={14} />
                <Skeleton width="20%" height={14} />
                <Skeleton width="20%" height={14} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

