"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-red-400">Error</p>
      <h1 className="mt-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400"
      >
        Try Again
      </button>
    </div>
  );
}