import PageHero from '@/components/PageHero'
import Section from '@/components/Section'
import Card from '@/components/Card'
import JobCard from '@/components/JobCard'
import CertificateCard from '@/components/CertificateCard'
import Button from '@/components/Button'
import { aiApi } from '@/utils/api'
import { toSlug } from '@/utils/slug'
import type { SearchResponse, SearchSectionResult, Project, Job, Certificate } from '@/types/interfaces'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams?: {
    query?: string | string[]
    q?: string | string[]
  }
}

function resolveParam(value?: string | string[]): string {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
}

const SECTION_TITLES: Record<string, string> = {
  projects: 'Projects',
  jobs: 'Experience',
  certificates: 'Certificates',
}

function formatSearchType(value?: string) {
  if (!value) {
    return 'keyword'
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

async function fetchSearchResults(query: string): Promise<SearchResponse | null> {
  try {
    const response = await aiApi.search(query, {
      searchType: 'keyword',
      includeSections: ['projects', 'jobs', 'certificates'],
      limit: 30,
    })
    return response as SearchResponse
  } catch (error) {
    console.error('SearchPage: unable to fetch AI search results', error)
    return null
  }
}

export default async function SearchPage({ searchParams = {} }: SearchPageProps) {
  const query = resolveParam(searchParams.query ?? searchParams.q)
  const trimmedQuery = query.trim()

  const searchResult = trimmedQuery ? await fetchSearchResults(trimmedQuery) : null

  const totalMatches = searchResult?.total_count ?? 0
  const searchDuration = searchResult?.search_time ?? 0
  const heroStats = trimmedQuery && searchResult ? [
    {
      label: 'Matches',
      value: totalMatches.toString(),
      accentClass: 'text-sky-500 dark:text-sky-400',
    },
    {
      label: 'Search Time',
      value: `${searchDuration.toFixed(2)}s`,
      accentClass: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Mode',
      value: formatSearchType(searchResult?.search_type),
      accentClass: 'text-violet-500 dark:text-violet-400',
    },
  ] : undefined

  return (
    <div className="space-y-12 py-12 lg:py-16">
      <PageHero
        eyebrow="Search"
        title={trimmedQuery ? `Results for "${trimmedQuery}"` : 'Search the Portfolio'}
        description={trimmedQuery
          ? 'Curated matches from projects, experience, and certifications related to your query.'
          : 'Look up technologies, roles, or ask the AI anything about this portfolio.'}
        align="left"
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-secondary" href="/">
              Back to Home
            </Button>
            <Button className="btn-primary" href="/#contact">
              Contact
            </Button>
          </>
        )}
      />

      {!trimmedQuery && (
        <Section background="gray" containerClassName="max-w-5xl space-y-6">
          <div className="space-y-4 text-slate-600 dark:text-slate-300">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">How search works</h2>
            <p>
              Type a keyword like &quot;python&quot; or &quot;fastapi&quot; to see relevant projects, roles, and certificates. Ask broader questions
              such as &ldquo;What&apos;s your AI experience?&rdquo; to receive a detailed AI-crafted response instead.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/60 p-5 backdrop-blur dark:bg-slate-900/40">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Keyword ideas</h3>
                <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>• python, data science, machine learning</li>
                  <li>• fastapi, next.js, tailwind</li>
                  <li>• llm, chatbot, automation</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/60 p-5 backdrop-blur dark:bg-slate-900/40">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Ask anything</h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  Try &ldquo;How do you apply AI to automation projects?&rdquo; or &ldquo;Tell me about your leadership experience&rdquo;.
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {trimmedQuery && !searchResult && (
        <Section background="default" containerClassName="max-w-4xl space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We couldn&apos;t fetch the search results right now. Please try again in a moment.
          </p>
        </Section>
      )}

      {searchResult?.summary && (
        <Section background="default" containerClassName="max-w-5xl space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {searchResult.summary.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {searchResult.summary.body}
            </p>
          </div>

          {searchResult.summary.highlights && Object.keys(searchResult.summary.highlights).length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(searchResult.summary.highlights).map(([key, values]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/60 p-5 dark:bg-slate-900/40">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                    {SECTION_TITLES[key] || key}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {values.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {searchResult?.llm_response && (
        <Section background="gradient" containerClassName="max-w-5xl space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Insight</h2>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {searchResult.llm_response}
          </p>
        </Section>
      )}

      {trimmedQuery && searchResult && searchResult.total_count === 0 && !searchResult.llm_response && (
        <Section background="default" containerClassName="max-w-4xl space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No matches found</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Try another keyword or ask a broader question to let the AI help you.
          </p>
        </Section>
      )}

      {searchResult?.sections?.map((section: SearchSectionResult) => {
        if (!section.items || section.items.length === 0) {
          return null
        }

        if (section.type === 'projects') {
          const projects = section.items as Project[]
          return (
            <Section key={section.type} background="default" containerClassName="max-w-6xl space-y-8">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                  Projects
                </span>
                <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">Highlighted Builds</h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    title={project.name}
                    description={project.shortDescription || project.description}
                    imageUrl={project.thumbnail}
                    linkUrl={`/projects/${project.id}`}
                    tags={project.skills?.slice(0, 5)}
                    featured={project.featured}
                  >
                    <div className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                      {project.category}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          )
        }

        if (section.type === 'jobs') {
          const jobs = section.items as Job[]
          return (
            <Section key={section.type} background="gray" containerClassName="max-w-5xl space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                  Experience
                </span>
                <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">Roles Featuring {trimmedQuery}</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    companyLogo={job.companyLogo}
                    position={job.position}
                    location={job.location}
                    startDate={job.startDate}
                    endDate={job.endDate || undefined}
                    isCurrent={job.isCurrent}
                    description={job.description}
                    responsibilities={job.responsibilities}
                    skills={job.skills}
                    featured={job.featured}
                    compact
                    href={`/experience/${job.id}`}
                  />
                ))}
              </div>
            </Section>
          )
        }

        if (section.type === 'certificates') {
          const certificates = section.items as Certificate[]
          return (
            <Section key={section.type} background="default" containerClassName="max-w-6xl space-y-8">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                  Certifications
                </span>
                <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">Verified Knowledge</h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {certificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.name}
                    certificate={certificate}
                    href={`/certificates/${toSlug(certificate.name)}`}
                  />
                ))}
              </div>
            </Section>
          )
        }

        return null
      })}
    </div>
  )
}
