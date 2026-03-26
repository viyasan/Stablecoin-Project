export function ProSkeletonCard() {
  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <div className="h-3 w-20 bg-pro-elevated rounded animate-pulse mb-3" />
      <div className="h-6 w-24 bg-pro-elevated rounded animate-pulse mb-2" />
      <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse" />
    </div>
  );
}

export function ProSkeletonTable() {
  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg overflow-hidden">
      <div className="bg-pro-elevated px-4 py-3">
        <div className="h-3 w-full bg-pro-border rounded animate-pulse" />
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-t border-pro-border"
        >
          <div className="h-3 w-6 bg-pro-elevated rounded animate-pulse" />
          <div className="h-3 w-20 bg-pro-elevated rounded animate-pulse" />
          <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse" />
          <div className="h-3 w-14 bg-pro-elevated rounded animate-pulse" />
          <div className="h-3 w-18 bg-pro-elevated rounded animate-pulse flex-1" />
        </div>
      ))}
    </div>
  );
}

export function ProSkeletonChart() {
  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <div className="h-3 w-28 bg-pro-elevated rounded animate-pulse mb-3" />
      <div className="h-[180px] bg-pro-elevated rounded animate-pulse" />
    </div>
  );
}
