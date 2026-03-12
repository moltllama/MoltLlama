export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-molt-stroke-light border-t-molt-pink" />
        <p className="text-sm text-molt-text-secondary animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
