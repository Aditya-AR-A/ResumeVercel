import Link from 'next/link'
import SkillTag from '@/components/SkillTag'
import FeaturedBadge from '@/components/FeaturedBadge'
import Section from '@/components/Section'
import PageHero from '@/components/PageHero'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Job, Project } from '@/types/interfaces'

interface JobDetailProps {
  job: Job
  projects?: Project[]
}

export default function JobDetailView({ job, projects = [] }: JobDetailProps) {
  const hasRelatedProjects = projects.length > 0
  const responsibilities = job.responsibilities ?? []
  const achievements = job.achievements ?? []
  const jobLinks = job.links ? Object.entries(job.links) : []

  const formatDate = (value?: string) => {
    if (!value) {
      return null
    }

    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const startDate = formatDate(job.startDate)
  const endDate = job.isCurrent ? 'Present' : formatDate(job.endDate) ?? 'N/A'

  const durationLabel = (() => {
    if (!job.startDate) {
      return null
    }

    const start = new Date(job.startDate)
    const end = job.isCurrent || !job.endDate ? new Date() : new Date(job.endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null
    }

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    if (months < 1) {
      return null
    }

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    const parts: string[] = []
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
    }
    if (remainingMonths > 0) {
      parts.push(`${remainingMonths} mo`)
    }

    return parts.join(' ')
  })()

  const heroStats = [
    {
      label: 'Timeline',
      value: `${startDate ?? 'N/A'} → ${endDate}`,
      accentClass: 'text-sky-500 dark:text-sky-400',
    },
    {
      label: 'Duration',
      value: durationLabel ?? '—',
      helperText: job.isCurrent ? 'Currently in role' : undefined,
      accentClass: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Projects',
      value: projects.length || '0',
      accentClass: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: 'Location',
      value: job.location,
      accentClass: 'text-violet-500 dark:text-violet-400',
    },
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Experience"
        title={job.title}
        description={job.description}
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-secondary" href="/experience">
              Back to Experience
            </Button>
            {hasRelatedProjects && (
              <Button className="btn-primary" href="#related-projects">
                Related Projects
              </Button>
            )}
          </>
        )}
      />

      <Section background="default" containerClassName="max-w-5xl space-y-10">
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,0.7fr)]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-600 dark:text-blue-300">
                {job.company}
              </span>
              {job.isCurrent && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-500 dark:text-emerald-300">
                  Current Role
                </span>
              )}
              {job.featured && <FeaturedBadge className="px-3 py-1" />}
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
              <h2 className="text-base font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
                Timeline
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <strong className="text-slate-800 dark:text-white">Start:</strong> {startDate ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-white">End:</strong> {endDate}
                </p>
                {durationLabel && (
                  <p className="text-emerald-500 dark:text-emerald-300">
                    Duration: {durationLabel}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Role Overview
              </h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {job.companyLogo && (
            <div className="relative flex items-center justify-center rounded-3xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="max-h-32 w-auto object-contain"
              />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {responsibilities.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Key Responsibilities
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {responsibilities.map((responsibility, index) => (
                  <li key={`${responsibility}-${index}`} className="flex gap-3">
                    <span className="mt-0.5 text-sky-500">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                Highlighted Achievements
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-emerald-700 dark:text-emerald-200">
                {achievements.map((achievement, index) => (
                  <li key={`${achievement}-${index}`} className="flex gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <Section background="gray" containerClassName="max-w-5xl space-y-10">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Key Technologies & Skills
          </h2>
          {job.skills && job.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Skill metadata is still being curated for this role.
            </p>
          )}
        </div>

        {jobLinks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Notable Links
            </h2>
            <div className="flex flex-wrap gap-3">
              {jobLinks.map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-600 transition hover:border-sky-400 hover:bg-sky-500/20 dark:text-sky-300"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 3h7v7m0-7L10 14m4 7H3v-7"
                    />
                  </svg>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}

        {job.featured && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm font-semibold text-amber-600 dark:text-amber-300">
            ⭐ This role is part of the featured experience set.
          </div>
        )}
      </Section>

      {hasRelatedProjects && (
        <Section
          id="related-projects"
          background="gradient"
          containerClassName="max-w-6xl space-y-8"
        >
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
              Related Work
            </span>
            <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
              Projects from this Role
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Deliverables and platforms that originated while leading this position.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <Card
                key={project.id}
                title={project.name}
                description={project.shortDescription}
                imageUrl={project.thumbnail}
                tags={project.skills.slice(0, 4)}
                linkUrl={`/projects/${project.id}`}
                featured={project.featured}
              >
                <div className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                  {project.category}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
