import type { Job } from '@/types/interfaces';

export function calendarMonths(start: Date, end: Date): number {
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) return 0;
  const months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth();
  return Math.max(0, months - (end.getUTCDate() < start.getUTCDate() ? 1 : 0));
}
export function formatMonths(months: number): string {
  if (months < 1) return 'Less than 1 month';
  const years = Math.floor(months / 12), rest = months % 12;
  return [years ? `${years} ${years === 1 ? 'year' : 'years'}` : '', rest ? `${rest} ${rest === 1 ? 'month' : 'months'}` : ''].filter(Boolean).join(' ');
}
export function formatDuration(start: Date, end: Date): string {
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) return 'Dates unavailable';
  return formatMonths(calendarMonths(start, end));
}
export function jobDuration(job: Pick<Job, 'startDate' | 'endDate' | 'isCurrent'>, now = new Date()): string {
  return formatDuration(new Date(job.startDate), job.isCurrent ? now : new Date(job.endDate ?? ''));
}
// Merge overlapping employment periods before counting; do not count gaps as work.
export function totalExperience(jobs: Job[], now = new Date()): string {
  const ranges = jobs.map(j => [new Date(j.startDate), j.isCurrent ? now : new Date(j.endDate ?? '')])
    .filter(([start, end]) => Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end >= start)
    .sort((a, b) => a[0].getTime() - b[0].getTime());
  const merged: Date[][] = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) { if (end > last[1]) last[1] = end; }
    else merged.push([start, end]);
  }
  return merged.length ? formatMonths(merged.reduce((n, [s, e]) => n + calendarMonths(s, e), 0)) : 'Dates unavailable';
}
