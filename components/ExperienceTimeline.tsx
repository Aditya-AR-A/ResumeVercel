import Link from 'next/link';
import type { Job } from '@/types/interfaces';
import { jobDuration } from '@/utils/experience';
const date = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export default function ExperienceTimeline({ jobs }: { jobs: Job[] }) {
  return <section aria-label="Employment timeline" className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 sm:p-8">
    <h2 className="mb-5 text-xl font-semibold text-textStrong">Employment timeline</h2>
    <ol className="space-y-5 border-l-2 border-blue-500/30 pl-5">{jobs.map(job => <li key={job.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
      <div><Link className="font-semibold text-textStrong hover:text-blue-500" href={`/experience/${job.id}`}>{job.title}</Link><p className="mt-1 text-sm text-textMuted">{job.company}</p></div>
      <div className="text-sm text-textMuted sm:text-right"><p>{date(job.startDate)} – {job.isCurrent ? 'Present' : job.endDate ? date(job.endDate) : 'End date unavailable'}</p><p className="mt-1">{jobDuration(job)}</p></div>
    </li>)}</ol>
  </section>;
}
