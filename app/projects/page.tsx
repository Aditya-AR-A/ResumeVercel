import Card from '@/components/Card'
import Section from '@/components/Section'
import Button from '@/components/Button'
import PageHero from '@/components/PageHero'
import { dataApi } from '@/utils/api'
import type { Job, Project } from '@/types/interfaces'

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('ProjectsPage: failed to fetch projects from API', error)
    return []
  }
}

async function loadJobs(): Promise<Job[]> {
  try {
    const data = await dataApi.getJobs()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('ProjectsPage: failed to fetch jobs from API', error)
    return []
  }
}

export default async function ProjectsPage() {
  const [projects, jobs] = await Promise.all([loadProjects(), loadJobs()])

  const jobMap = new Map<string, Job>()
  jobs.forEach((job) => {
    jobMap.set(job.id, job)
  })

  const projectsByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = []
    }
    acc[project.category].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  const categoryNames = Object.keys(projectsByCategory).sort((a, b) => a.localeCompare(b))

  const heroStats = [
    {
      label: 'Projects',
      value: projects.length || '0',
      suffix: projects.length ? '+' : undefined,
      accentClass: 'text-sky-500 dark:text-sky-400'
    },
    {
      label: 'Categories',
      value: categoryNames.length || '0',
      accentClass: 'text-violet-500 dark:text-violet-400'
    },
    {
      label: 'Featured',
      value: projects.filter((project) => project.featured).length || '0',
      accentClass: 'text-amber-500 dark:text-amber-400'
    },
    {
      label: 'Tech Stack',
      value: new Set(projects.flatMap((project) => project.skills)).size || '0',
      accentClass: 'text-emerald-500 dark:text-emerald-400'
    }
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Projects"
        title="All Projects"
        description="Every build, experiment, and deployment that shaped my journey across AI, automation, and product engineering."
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-primary" href="/certificates">
              Browse Credentials
            </Button>
            <Button className="btn-secondary" href="/experience">
              View Experience
            </Button>
          </>
        )}
      />

      {categoryNames.map((category, index) => {
        const categoryProjects = projectsByCategory[category] ?? []

        return (
          <Section
            key={category}
            background={index % 2 === 0 ? 'default' : 'gradient'}
            className="py-12 lg:py-16"
            containerClassName="max-w-6xl"
          >
            <div className="space-y-10">
              <div className="space-y-3 text-center">
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                  Category
                </span>
                <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
                  {category}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Showcasing {categoryProjects.length} project{categoryProjects.length === 1 ? '' : 's'} in this track.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {categoryProjects.map((project) => (
                  <Card
                    key={project.id}
                    title={project.name}
                    description={project.shortDescription}
                    imageUrl={project.thumbnail}
                    tags={project.skills.slice(0, 4)}
                    jobMeta={(() => {
                      const candidateIds = [project.jobId, ...(project.relatedJobIds ?? [])].filter(Boolean) as string[]
                      for (const id of candidateIds) {
                        const job = jobMap.get(id)
                        if (job) {
                          return { id: job.id, title: job.title, company: job.company }
                        }
                      }
                      return undefined
                    })()}
                    linkUrl={`/projects/${project.id}`}
                  />
                ))}
              </div>
            </div>
          </Section>
        )
      })}
    </div>
  )
}
