import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">404</p>
      <h1 className="mt-2 text-3xl font-bold">This page doesn&apos;t exist</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        The page you&apos;re looking for might have been moved, renamed, or never existed.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400">
          Go Home
        </Link>
        <Link href="/explore-campaigns" className="rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-emerald-400">
          Explore Campaigns
        </Link>
      </div>
    </div>
  );
}