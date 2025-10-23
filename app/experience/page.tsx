import Section from '@/components/Section'
import JobCard from '@/components/JobCard'
import Button from '@/components/Button'
import PageHero from '@/components/PageHero'
import { dataApi } from '@/utils/api'
import type { Job, Project } from '@/types/interfaces'
import ExperienceTimeline from '@/components/ExperienceTimeline'

async function loadJobs(): Promise<Job[]> {
  try {
    const data = await dataApi.getJobs()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('ExperiencePage: failed to fetch jobs from API', error)
    return []
  }
}

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('ExperiencePage: failed to fetch projects from API', error)
    return []
  }
}

export default async function ExperiencePage() {
  const [jobs, projects] = await Promise.all([loadJobs(), loadProjects()])

  // Sort jobs by startDate descending (most recent first)
  const sortedJobs = jobs.slice().sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    return bDate - aDate;
  });

  const getRelatedProjects = (jobId: string) =>
    projects.filter((project) => project.jobId === jobId || project.relatedJobIds?.includes(jobId));

  const heroStats = [
    {
      label: 'Roles',
      value: jobs.length || '0',
      accentClass: 'text-sky-500 dark:text-sky-400'
    },
    {
      label: 'Companies',
      value: new Set(jobs.map(job => job.company)).size || '0',
      accentClass: 'text-emerald-500 dark:text-emerald-400'
    },
    {
      label: 'Featured Projects',
      value: projects.filter(project => project.featured).length || '0',
      accentClass: 'text-violet-500 dark:text-violet-400'
    },
    {
      label: 'Active Roles',
      value: sortedJobs.filter(job => job.isCurrent).length || '0',
      helperText: 'Currently engaged',
      accentClass: 'text-amber-500 dark:text-amber-400'
    }
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Experience"
        title="Professional Journey"
        description="Highlights from building intelligent systems, shipping AI products, and scaling teams from idea to launch."
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-primary" href="/projects">
              Explore Projects
            </Button>
            <Button className="btn-secondary" href="#contact">
              Let&apos;s Connect
            </Button>
          </>
        )}
      />

      <ExperienceTimeline jobs={sortedJobs} />

      <Section
        className="py-12 lg:py-16"
        containerClassName="max-w-5xl"
      >
        <div className="space-y-10">
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
              Work History
            </span>
            <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
              Roles & Impact
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Every position combines research, engineering, and delivery to create measurable outcomes.
            </p>
          </div>

          <div className="space-y-8">
            {sortedJobs.map((job) => (
              <div key={job.id} id={`job-${job.id}`} className="timeline-card-wrapper scroll-mt-32 transition">
                <JobCard
                  {...job}
                  href={`/experience/${job.id}`}
                  projects={getRelatedProjects(job.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
