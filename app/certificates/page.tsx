import { toSlug } from '@/utils/slug'
import Section from '@/components/Section'
import CertificateCard from '@/components/CertificateCard'
import Button from '@/components/Button'
import PageHero from '@/components/PageHero'
import { dataApi } from '@/utils/api'
import type { Certificate } from '@/types/interfaces'

async function loadCertificates(): Promise<Certificate[]> {
  try {
    const data = await dataApi.getCertificates()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('CertificatesPage: failed to fetch certificates from API', error)
    return []
  }
}

export default async function CertificatesPage() {
  const certificates = await loadCertificates()
  const featuredCertificates = certificates.filter((certificate) => certificate.featured)

  const certificatesByField = certificates.reduce<Record<string, Certificate[]>>((acc, certificate) => {
    const field = certificate.field || 'Other'
    if (!acc[field]) {
      acc[field] = []
    }
    acc[field].push(certificate)
    return acc
  }, {})

  const fields = Object.keys(certificatesByField).sort((a, b) => a.localeCompare(b))

  const heroStats = [
    {
      label: 'Certificates',
      value: certificates.length || '0',
      suffix: certificates.length ? '+' : undefined,
      accentClass: 'text-sky-500 dark:text-sky-400'
    },
    {
      label: 'Domains',
      value: fields.length || '0',
      accentClass: 'text-emerald-500 dark:text-emerald-400'
    },
    {
      label: 'Featured',
      value: featuredCertificates.length || '0',
      accentClass: 'text-violet-500 dark:text-violet-400'
    },
    {
      label: 'Providers',
      value: new Set(certificates.map(cert => cert.provider)).size || '0',
      accentClass: 'text-amber-500 dark:text-amber-400'
    }
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Credentials"
        title="Certificates & Achievements"
        description="Evidence of continuous learning and specialization across data science, AI, cloud, and advanced software engineering."
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-primary" href="#contact">
              Hire for a Project
            </Button>
            <Button className="btn-secondary" href="/projects">
              View Projects
            </Button>
          </>
        )}
      />

      {featuredCertificates.length > 0 && (
        <Section
          background="gradient"
          className="py-12 lg:py-16"
          containerClassName="max-w-6xl"
        >
          <div className="space-y-10">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                Spotlight
              </span>
              <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
                Featured Certifications
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Deep dives where I led initiatives, specialized in advanced tooling, or achieved elite recognition.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featuredCertificates.map((certificate, index) => {
                const slug = toSlug(certificate.name)

                return (
                  <CertificateCard
                    key={certificate.name}
                    certificate={certificate}
                    href={`/certificates/${slug}`}
                    variant="showcase"
                    priority={index === 0}
                  />
                )
              })}
            </div>
          </div>
        </Section>
      )}

      {fields.map((field, index) => {
        const fieldCertificates = certificatesByField[field]

        return (
          <Section
            key={field}
            background={index % 2 === 0 ? 'default' : 'gray'}
            className="py-12 lg:py-16"
            containerClassName="max-w-6xl"
          >
            <div className="space-y-10">
              <div className="space-y-3 text-center">
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:text-slate-200">
                  Specialization
                </span>
                <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
                  {field}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {fieldCertificates.length} certification{fieldCertificates.length === 1 ? '' : 's'} advancing this focus area.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {fieldCertificates.map((certificate, index) => {
                  const slug = toSlug(certificate.name)

                  return (
                    <CertificateCard
                      key={certificate.name}
                      certificate={certificate}
                      href={`/certificates/${slug}`}
                      variant="showcase"
                      priority={index === 0}
                    />
                  )
                })}
              </div>
            </div>
          </Section>
        )
      })}

      <Section
        background="gradient"
        className="py-12 text-center lg:py-16"
        containerClassName="max-w-5xl"
      >
        <div className="space-y-6">
          <h2 className="heading-gradient text-3xl font-bold sm:text-4xl">
            Continuous learning is the advantage
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Let&apos;s partner on your toughest data, automation, or AI problems. I bring fresh research, practical experience, and proven results to every engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="btn-primary" href="#contact">
              Start a Conversation
            </Button>
            <Button className="btn-secondary" href="/">
              Back to Home
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
