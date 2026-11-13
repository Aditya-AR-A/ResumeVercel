import Link from 'next/link';
import Card from '@/components/Card';
import JobCard from '@/components/JobCard';
import CertificateCard from '@/components/CertificateCard';
import { searchPortfolio } from '@/utils/portfolio';
import { toSlug } from '@/utils/slug';
import type { Project, Job, Certificate } from '@/types/interfaces';

export default function SearchPage({ searchParams = {} }: { searchParams?: { query?: string | string[]; q?: string | string[] } }) {
  const raw = searchParams.query ?? searchParams.q ?? '';
  const query = (Array.isArray(raw) ? raw[0] : raw).trim().slice(0, 200);
  const result = searchPortfolio(query);
  return <div className="space-y-10 py-10 sm:py-16">
    <header className="max-w-3xl space-y-4"><p className="intro-badge">Search the portfolio</p><h1 className="text-3xl font-semibold text-textStrong sm:text-4xl">{query ? `Results for “${query}”` : 'Find a project, skill, or credential'}</h1><p className="text-textMuted">Search the same project, experience, and certificate records shown across this portfolio.</p>
      <form action="/search" className="flex gap-2"><label htmlFor="portfolio-query" className="sr-only">Search terms</label><input id="portfolio-query" name="query" type="search" defaultValue={query} placeholder="Python, Power BI, recruitment…" maxLength={200} className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-surface px-4 py-3 text-text" /><button className="btn-primary" type="submit">Search</button></form>
      {query && <p className="text-sm text-textMuted" role="status">{result.total_count} matching record{result.total_count === 1 ? '' : 's'}</p>}
    </header>
    {query && result.total_count === 0 && <p className="text-textMuted">No matches. Try a technology name or a shorter project keyword.</p>}
    {result.sections?.filter(s => s.count > 0).map(section => <section key={section.type} className="space-y-5">
      <h2 className="text-2xl font-semibold text-textStrong">{section.type === 'jobs' ? 'Experience' : section.type === 'projects' ? 'Projects' : 'Certificates'}</h2>
      <div className="grid gap-5 md:grid-cols-2">{section.type === 'projects' ? (section.items as Project[]).map(p => <Card key={p.id} title={p.name} description={p.shortDescription} tags={p.skills.slice(0,4)} linkUrl={`/projects/${p.id}`} />) : section.type === 'jobs' ? (section.items as Job[]).map(j => <JobCard key={j.id} {...j} compact href={`/experience/${j.id}`} />) : (section.items as Certificate[]).map(c => <CertificateCard key={c.name} certificate={c} href={`/certificates/${toSlug(c.name)}`} />)}</div>
    </section>)}
    <Link href="/projects" className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Browse all projects →</Link>
  </div>;
}
