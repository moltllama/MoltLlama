import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card p-10 text-center max-w-md w-full">
        <p className="text-6xl font-extrabold bg-molt-accent bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-xl font-bold text-molt-text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-molt-text-secondary mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-accent inline-block text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
