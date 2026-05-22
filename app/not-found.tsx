import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-zinc-950">
      <div className="space-y-4">
        {/* Angka 404 besar dengan warna pudar khas */}
        <h1 className="text-8xl font-black tracking-tight text-zinc-200 dark:text-zinc-800/50 select-none">
          404
        </h1>
        
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Resource Not Found !
        </h2>
        
        <p className="mx-auto max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Sorry, Page is not Registered, or has been deleted
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-6 text-xs font-bold text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}