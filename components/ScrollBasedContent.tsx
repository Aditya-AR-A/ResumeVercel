import Image from 'next/image';
import Link from 'next/link';
import Card from './Card';
import JobCard from './JobCard';
import AboutView from './views/AboutView';
import type { IntroData, Project, Job, Certificate, SkillsResponse } from '@/types/interfaces';

interface Props { introData: IntroData; projects: Project[]; jobs: Job[]; certificates: Certificate[]; skillsAggregation?: SkillsResponse }

// Ordinary document flow: no scroll interception, section dimming, or viewport-height gates.
export default function ScrollBasedContent({ introData, projects, jobs, certificates, skillsAggregation }: Props) {
  const selected = projects.filter(p => p.featured).slice(0, 4);
  const sortedJobs = [...jobs].sort((a, b) => b.startDate.localeCompare(a.startDate));
  return <div className="space-y-16 pb-16 sm:space-y-24">
    <section id="home" className="grid items-center gap-10 pt-10 pb-2 sm:pt-16 lg:grid-cols-[1.5fr_1fr] lg:py-20">
      <div className="space-y-6">
        <p className="intro-badge">Python · Applied AI · Analytics</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Hi, I’m <span className="heading-gradient">{introData.name}.</span></h1>
        <p className="max-w-2xl text-xl font-medium text-textStrong sm:text-2xl">{introData.title}</p>
        <p className="max-w-xl text-base leading-7 text-textMuted sm:text-lg">I build AI-assisted workflows, Python applications, and dashboards that turn operational data into useful decisions.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="#projects" className="btn-primary inline-flex items-center min-h-11">View selected work →</Link>
          <Link href="/contact" className="btn-secondary inline-flex items-center min-h-11">Get in touch</Link>
        </div>
        <p className="text-sm text-textMuted">Focused on AI / Python Developer and Data Analyst opportunities.</p>
      </div>
      <div className="order-first lg:order-last flex justify-start lg:justify-center">
        <Image src={introData.profileImage.src} alt="Aditya Raj" width={256} height={256} sizes="(max-width: 640px) 112px, (max-width: 1024px) 160px, 256px" className="h-28 w-28 rounded-3xl object-cover shadow-lg sm:h-40 sm:w-40 lg:h-64 lg:w-64" priority />
      </div>
    </section>
    <section id="about"><AboutView introData={introData} projects={projects} jobs={jobs} certificates={certificates} skillsAggregation={skillsAggregation} compact /></section>
    <section id="projects" className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2"><p className="intro-badge">Selected work</p><h2 className="text-3xl font-semibold text-textStrong">From workflows to dashboards</h2></div>
        <Link href="/projects" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">All projects →</Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{selected.map(p => <Card key={p.id} title={p.name} description={p.shortDescription} tags={p.skills.slice(0, 4)} linkUrl={`/projects/${p.id}`} />)}</div>
    </section>
    <section id="experience" className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div className="space-y-2"><p className="intro-badge">Experience</p><h2 className="text-3xl font-semibold text-textStrong">Where I’ve contributed</h2></div><Link href="/experience" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Full experience →</Link></div>
      <div className="grid gap-5 lg:grid-cols-2">{sortedJobs.map(job => <JobCard key={job.id} {...job} compact href={`/experience/${job.id}`} />)}</div>
    </section>
    <section id="certificates" className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-xl font-semibold text-textStrong">Learning & credentials</h2><p className="mt-2 text-sm text-textMuted">Python, SQL, analytics, and earlier machine learning study.</p></div>
      <Link href="/certificates" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Browse certificates →</Link>
    </section>
  </div>;
}
