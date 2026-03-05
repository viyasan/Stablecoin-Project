import { Skeleton } from '../common/Skeleton';

export function SkeletonYieldsTable() {
  return (
    <div className="space-y-6">
      {/* Filter bar skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <Skeleton width={40} height={12} className="mb-2" />
            <div className="flex gap-1">
              <Skeleton width={80} height={30} rounded="full" />
              <Skeleton width={70} height={30} rounded="full" />
              <Skeleton width={65} height={30} rounded="full" />
              <Skeleton width={75} height={30} rounded="full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Skeleton width={40} height={12} className="mb-2" />
            <div className="flex gap-1">
              <Skeleton width={80} height={30} rounded="full" />
              <Skeleton width={50} height={30} rounded="full" />
              <Skeleton width={50} height={30} rounded="full" />
              <Skeleton width={45} height={30} rounded="full" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-3 pt-3 border-t border-chrome-100">
          <Skeleton width={60} height={14} />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
        {/* Header */}
        <div className="bg-chrome-50 flex items-center px-4 py-3 gap-4">
          <Skeleton width={60} height={12} />
          <Skeleton width={60} height={12} />
          <Skeleton width={50} height={12} />
          <div className="ml-auto flex gap-6">
            <Skeleton width={40} height={12} />
            <Skeleton width={40} height={12} />
            <Skeleton width={60} height={12} className="hidden md:block" />
            <Skeleton width={70} height={12} className="hidden md:block" />
          </div>
        </div>
        {/* Rows */}
        <div className="divide-y divide-chrome-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center px-4 py-3 gap-4 ${i % 2 === 1 ? 'bg-chrome-50/50' : ''}`}
            >
              <Skeleton width={60 + Math.random() * 20} height={16} />
              <Skeleton width={80 + Math.random() * 30} height={14} />
              <Skeleton width={70 + Math.random() * 20} height={14} />
              <div className="ml-auto flex gap-6">
                <Skeleton width={60} height={14} />
                <Skeleton width={45} height={14} />
                <Skeleton width={45} height={14} className="hidden md:block" />
                <Skeleton width={45} height={14} className="hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
