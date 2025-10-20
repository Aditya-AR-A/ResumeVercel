import Image from 'next/image'
import SkillTag from '@/components/SkillTag'
import FeaturedBadge from '@/components/FeaturedBadge'
import Section from '@/components/Section'
import PageHero from '@/components/PageHero'
import Button from '@/components/Button'
import { Certificate } from '@/types/interfaces'
import { getAssetUrl } from '@/utils/assets'

interface CertificateDetailProps {
  certificate: Certificate
}

export default function CertificateDetailView({ certificate }: CertificateDetailProps) {
  const formattedIssueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null

  const thumbnail = certificate.file
    ? getAssetUrl('certificate_thumbnails', certificate.file.replace(/\.(pdf)$/i, '.png'))
    : undefined
  const certificateFileUrl = certificate.file ? getAssetUrl('certificates', certificate.file) : undefined

  const heroStats = [
    {
      label: 'Provider',
      value: certificate.provider,
      accentClass: 'text-sky-500 dark:text-sky-400',
    },
    {
      label: 'Domain',
      value: certificate.field,
      accentClass: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Issued',
      value: formattedIssueDate ?? 'N/A',
      accentClass: 'text-violet-500 dark:text-violet-400',
    },
    {
      label: 'Credential ID',
      value: certificate.credentialId || '—',
      accentClass: 'text-amber-500 dark:text-amber-400',
    },
  ]

  return (
    <div className="relative min-h-screen space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Credential"
        title={certificate.name}
        description={certificate.description || 'This certification validates domain expertise and hands-on capabilities.'}
        stats={heroStats}
        actions={(
          <>
            <Button className="btn-secondary" href="/certificates">
              Back to Certificates
            </Button>
            {certificateFileUrl && (
              <Button className="btn-primary" href={certificateFileUrl} target="_blank" rel="noopener noreferrer">
                View Certificate
              </Button>
            )}
          </>
        )}
      />

      {thumbnail && (
        <Section background="default" containerClassName="max-w-5xl">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/10 p-6 shadow-[inset_0_1px_30px_rgba(148,163,184,0.12)] dark:border-white/10 dark:bg-slate-900/40">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={thumbnail}
                alt={certificate.name}
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 60vw, 840px"
                className="object-contain"
              />
            </div>
          </div>
        </Section>
      )}

      <Section background="gray" containerClassName="max-w-5xl space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
            <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
              Provider
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              {certificate.provider}
            </p>
            {formattedIssueDate && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                Issued {formattedIssueDate}
              </p>
            )}
            {certificate.expiryDate && (
              <p className="mt-1 text-sm text-rose-500 dark:text-rose-300">
                Expires {certificate.expiryDate}
              </p>
            )}
            {certificate.featured && <FeaturedBadge className="mt-4 inline-flex px-3 py-1" />}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-slate-900/40">
            <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
              Credential Details
            </h2>
            {certificate.credentialId ? (
              <p className="mt-3 font-mono text-sm text-slate-700 dark:text-slate-200">
                ID: {certificate.credentialId}
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Credential ID not provided for this record.
              </p>
            )}
            {certificate.credentialUrl && (
              <Button className="btn-secondary mt-4" href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                Verify Credential
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Skills Verified
          </h2>
          {certificate.skills && certificate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Skill metadata is not available for this certification.
            </p>
          )}
        </div>
      </Section>

      {certificate.file && certificateFileUrl && (
        <Section background="default" containerClassName="max-w-5xl space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Full Certificate Preview
          </h2>
          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 shadow-[inset_0_1px_40px_rgba(148,163,184,0.18)] dark:border-white/10 dark:bg-slate-900/40">
            {certificate.file.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${certificateFileUrl}#view=FitH`}
                title={`${certificate.name} certificate preview`}
                className="h-[70vh] w-full"
              />
            ) : (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={certificateFileUrl}
                  alt={`${certificate.name} certificate`}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 960px"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  )
}
