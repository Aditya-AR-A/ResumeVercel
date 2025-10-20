import Link from 'next/link';
import Image from 'next/image';
import FeaturedBadge from '@/components/FeaturedBadge';
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
  } catch (error) {
    return certificate.issueDate;
  }
}

const cardBaseStyles =
  'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/75 p-0 shadow-lg transition-transform duration-300 backdrop-blur hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700/70 dark:bg-slate-900/70';

export default function CertificateCard({ certificate, href, variant = 'default', priority }: CertificateCardProps) {
  const thumbnail = getThumbnail(certificate);
  const issuedOn = formatIssueDate(certificate);

  const imageContainerClassName =
    variant === 'showcase'
      ? 'relative w-full bg-slate-950/95 p-5'
      : 'relative w-full bg-slate-950/90';

  const imageWrapperClassName =
    variant === 'showcase'
      ? 'relative mx-auto aspect-[4/3] w-full max-w-3xl'
      : 'relative aspect-[4/3] w-full';

  const imageClassName = variant === 'showcase' ? 'object-contain' : 'object-contain';

  const cardContent = (
    <div className={cardBaseStyles}>
      <div className={imageContainerClassName}>
        <div className={imageWrapperClassName}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={certificate.name}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 340px, 360px"
              className={`${imageClassName} transition-transform duration-500 group-hover:scale-[1.03]`}
              priority={Boolean(priority)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/80 text-sm text-slate-500">
              Preview unavailable
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {certificate.featured && (
            <div className="absolute left-4 top-4 z-10">
              <FeaturedBadge />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-600 dark:text-blue-300">
            {certificate.provider}
          </span>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-600 dark:text-purple-300">
            {certificate.field || 'General'}
          </span>
          {issuedOn && <span className="text-slate-400">Issued {issuedOn}</span>}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white">
            {certificate.name}
          </h3>
          {certificate.description && (
            <p className="text-sm text-slate-600 line-clamp-4 dark:text-slate-300">
              {certificate.description}
            </p>
          )}
        </div>

        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {certificate.skills.slice(0, variant === 'showcase' ? 5 : 4).map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {certificate.skills.length > (variant === 'showcase' ? 5 : 4) && (
              <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                +{certificate.skills.length - (variant === 'showcase' ? 5 : 4)}
              </span>
            )}
          </div>
        )}

        {href && (
          <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-300 dark:group-hover:text-blue-200">
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
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {cardContent}
    </Link>
  );
}
