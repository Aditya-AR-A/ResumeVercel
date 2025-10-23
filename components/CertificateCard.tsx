import Link from 'next/link';
import Image from 'next/image';
import SkillTag from '@/components/SkillTag';
import type { Certificate } from '@/types/interfaces';
import { getAssetUrl } from '@/utils/assets';

interface CertificateCardProps {
  certificate: Certificate;
  href?: string;
  variant?: 'default' | 'showcase';
  priority?: boolean;
}

function getThumbnail(certificate: Certificate) {
  if (!certificate.file) {
    return undefined;
  }

  const normalized = certificate.file.replace(/\.(pdf)$/i, '.png');

  return getAssetUrl('certificate_thumbnails', normalized);
}

function formatIssueDate(certificate: Certificate) {
  if (!certificate.issueDate) {
    return null;
  }

  try {
    return new Date(certificate.issueDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return certificate.issueDate;
  }
}

const baseContainerStyles =
  'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/65 shadow-[0_28px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-[4px] hover:shadow-[0_36px_96px_rgba(59,130,246,0.25)] dark:border-white/10 dark:bg-slate-950/60';

export default function CertificateCard({ certificate, href, variant = 'default', priority }: CertificateCardProps) {
  const thumbnail = getThumbnail(certificate);
  const issuedOn = formatIssueDate(certificate);

  const containerClassName = `${baseContainerStyles} ${variant === 'showcase' ? 'p-7 md:p-8 gap-6' : 'p-6 gap-5'}`;

  const imageFrameClassName =
    variant === 'showcase'
      ? 'relative rounded-[1.7rem] border border-white/10 bg-slate-950/35'
      : 'relative rounded-[1.6rem] border border-white/10 bg-slate-950/30';

  const imageWrapperClassName =
    variant === 'showcase'
      ? 'relative aspect-[16/10] w-full overflow-hidden'
      : 'relative aspect-[16/10] w-full overflow-hidden';

  const detailWrapperClassName = variant === 'showcase' ? 'flex flex-1 flex-col gap-5 md:gap-6' : 'flex flex-1 flex-col gap-4';

  const skillLimit = variant === 'showcase' ? 6 : 4;

  const cardContent = (
    <div className={containerClassName}>
      <div className={imageFrameClassName}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent-gradient-mid)_0%,transparent_60%)] opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" aria-hidden="true" />
        <div className={imageWrapperClassName}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={certificate.name}
              fill
              sizes="(max-width: 768px) 95vw, (max-width: 1280px) 520px, 560px"
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.04]"
              priority={Boolean(priority)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] border border-dashed border-slate-700/70 bg-slate-900/85 text-sm text-slate-500">
              Preview unavailable
            </div>
          )}
        </div>
      </div>

      <div className={detailWrapperClassName}>
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-600 dark:text-sky-300">
            {certificate.provider}
          </span>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-600 dark:text-violet-300">
            {certificate.field || 'General'}
          </span>
          {issuedOn && <span className="text-slate-400 dark:text-slate-500">Issued {issuedOn}</span>}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white md:text-2xl">
            {certificate.name}
          </h3>
          {certificate.description && (
            <p className="text-sm leading-6 text-slate-600 line-clamp-4 dark:text-slate-300">
              {certificate.description}
            </p>
          )}
        </div>

        {certificate.skills && certificate.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {certificate.skills.slice(0, skillLimit).map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {certificate.skills.length > skillLimit && (
              <span className="rounded-full bg-slate-200/70 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                +{certificate.skills.length - skillLimit}
              </span>
            )}
          </div>
        )}

        {href && (
          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition group-hover:text-sky-500 dark:text-sky-300">
            View certificate
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (!href) {
    return cardContent;
  }

  return (
    <Link
      href={href}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950"
    >
      {cardContent}
    </Link>
  );
}
