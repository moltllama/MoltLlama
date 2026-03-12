export default function ProtocolDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-28 rounded bg-molt-bg-hover mb-4" />

      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-full bg-molt-bg-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 rounded bg-molt-bg-hover" />
          <div className="h-4 w-72 rounded bg-molt-bg-hover" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded-molt-sm bg-molt-bg-hover" />
          <div className="h-9 w-20 rounded-molt-sm bg-molt-bg-hover" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="h-3 w-20 rounded bg-molt-bg-hover mb-3" />
            <div className="h-7 w-32 rounded bg-molt-bg-hover" />
          </div>
        ))}
      </div>

      {/* Chain breakdown skeleton */}
      <div className="mb-8">
        <div className="h-4 w-24 rounded bg-molt-bg-hover mb-3" />
        <div className="glass-card p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-molt-bg-hover" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
