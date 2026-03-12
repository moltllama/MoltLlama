"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="glass-card p-10 text-center max-w-md w-full">
        <p className="text-5xl font-extrabold text-data-negative mb-4">
          Error
        </p>
        <h1 className="text-xl font-bold text-molt-text-primary mb-2">
          Dashboard Error
        </h1>
        <p className="text-sm text-molt-text-secondary mb-8 leading-relaxed">
          {error.message || "Failed to load the dashboard. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-accent inline-block text-sm"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary inline-block text-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
