import SkillTag from '@/components/SkillTag'
import FeaturedBadge from '@/components/FeaturedBadge'
import Section from '@/components/Section'
import PageHero from '@/components/PageHero'
import Button from '@/components/Button'
import { Project, Job } from '@/types/interfaces'
import { resolveAssetUrl } from '@/utils/assets'

interface ProjectDetailProps {
  project: Project
  relatedJob?: Job
}

export default function ProjectDetailView({ project, relatedJob }: ProjectDetailProps) {
  const heroThumbnail = resolveAssetUrl(project.thumbnail)

  const projectStatus = project.status ?? (project.endDate ? 'Completed' : 'In Progress')

  const heroStats = [
    {
      label: 'Category',
      value: project.category,
      accentClass: 'text-sky-500 dark:text-sky-400',
    },
    {
      label: 'Status',
      value: projectStatus,
      accentClass: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Skills Used',
      value: project.skills.length || '0',
      accentClass: 'text-violet-500 dark:text-violet-400',
    },
    {
      label: 'Featured',
      value: project.featured ? 'Yes' : 'No',
      accentClass: 'text-amber-500 dark:text-amber-400',
    },
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Project"
        title={project.name}
        description={project.shortDescription}
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-secondary" href="/projects">
              Back to Projects
            </Button>
            {project.demoUrl && (
              <Button className="btn-primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                View Live Demo
              </Button>
            )}
            {project.githubUrl && !project.demoUrl && (
              <Button className="btn-primary" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                View Repository
              </Button>
            )}
          </>
        )}
      />

      <Section background="default" containerClassName="max-w-5xl space-y-10">
        {heroThumbnail && (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-900/35 via-transparent to-transparent" aria-hidden="true" />
            <img
              src={heroThumbnail}
              alt={project.name}
              className="relative z-[1] h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-sm font-semibold text-sky-600 dark:text-sky-300">
              {project.category}
            </span>
            {project.featured && <FeaturedBadge className="px-3 py-1" />}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
            <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
              Overview
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
          <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
            Technologies
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>

        {(project.demoUrl || project.githubUrl) && (
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button className="btn-primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
              </Button>
            )}
            {project.githubUrl && (
              <Button className="btn-secondary" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                View Source
              </Button>
            )}
          </div>
        )}
      </Section>

      {relatedJob && (
        <Section background="gray" containerClassName="max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Related Role
            </h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              This project was delivered while serving as{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{relatedJob.title}</span>{' '}
              at{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{relatedJob.company}</span>.
            </p>
            <Button className="btn-secondary" href={`/experience/${relatedJob.id}`}>
              View Role Details
            </Button>
          </div>
        </Section>
      )}
    </div>
  )
}
