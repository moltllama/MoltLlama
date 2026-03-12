export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-48 rounded-molt-sm bg-molt-bg-hover mb-6" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="h-3 w-20 rounded bg-molt-bg-hover mb-3" />
            <div className="h-7 w-32 rounded bg-molt-bg-hover" />
          </div>
        ))}
      </div>

      {/* Chart + table skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="h-4 w-24 rounded bg-molt-bg-hover mb-4" />
          <div className="h-48 rounded-molt-sm bg-molt-bg-hover" />
        </div>
        <div className="glass-card p-5">
          <div className="h-4 w-32 rounded bg-molt-bg-hover mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-molt-bg-hover" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
