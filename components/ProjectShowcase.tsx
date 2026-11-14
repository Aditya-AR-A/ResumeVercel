'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/types/interfaces';

export default function ProjectShowcase({ showcase }: { showcase: NonNullable<Project['showcase']> }) {
  const [selected, setSelected] = useState(0);
  const active = showcase.items[selected];
  if (!active) return null;

  return <section aria-label={showcase.title} className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-surface shadow-lg">
    <div className="p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-indigo-600 dark:text-indigo-300">Project gallery</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-textStrong">{showcase.title}</h2>
      <p className="mt-2 text-sm leading-6 text-textMuted">{showcase.description}</p>
      {showcase.items.length > 1 && <div className="mt-5 flex flex-wrap gap-2" aria-label="Choose a project image">
        {showcase.items.map((item, index) => <button key={item.image} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${index === selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-[var(--color-border)] bg-surfaceAlt text-text hover:border-indigo-400'}`}>{item.title}</button>)}
      </div>}
    </div>
    <figure>
      <div className="flex aspect-[16/10] items-center justify-center border-y border-[var(--color-border)] bg-slate-100 p-2 dark:bg-slate-950 sm:p-4">
        <Image key={active.image} src={active.image} alt={`${active.title} — ${active.label}`} width={active.width} height={active.height} sizes="(max-width: 768px) 90vw, 1000px" className="h-full w-full object-contain" priority={selected === 0} />
      </div>
      <figcaption className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7" aria-live="polite">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.15em] text-indigo-600 dark:text-indigo-300">{active.label}</p><p className="mt-2 text-sm leading-6 text-textMuted">{active.description}</p></div>
        <a href={active.image} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300">Open full image <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  </section>;
}
