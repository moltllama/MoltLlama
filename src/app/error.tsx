"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card p-10 text-center max-w-md w-full">
        <p className="text-5xl font-extrabold text-data-negative mb-4">
          Oops
        </p>
        <h1 className="text-xl font-bold text-molt-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-molt-text-secondary mb-8 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="btn-accent inline-block text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
