'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Something went wrong</h2>
        <p className="text-slate-600 dark:text-slate-300">We could not fetch the search results right now. Please try again.</p>
        <button onClick={reset} className="btn-primary">Retry</button>
      </div>
    </div>
  );
}

