export default function Loading() {
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-6 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/60 p-4 backdrop-blur dark:bg-slate-900/40">
              <div className="h-32 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

