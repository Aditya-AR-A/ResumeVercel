import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CardProps } from '@/types/interfaces';
import SkillTag from './SkillTag';
import { resolveAssetUrl } from '@/utils/assets';

export default function Card({
  title,
  description,
  imageUrl,
  linkUrl,
  tags,
  children,
  projects,
  jobMeta,
}: CardProps) {
  const isExternalLink = linkUrl ? /^https?:/i.test(linkUrl) : false;
  const ctaLabel = isExternalLink ? 'Open link →' : 'View details →';

  const resolvedImageUrl = resolveAssetUrl(imageUrl);
  const isSvg = typeof resolvedImageUrl === 'string' && resolvedImageUrl.toLowerCase().endsWith('.svg');

  const content = (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-surfaceAlt p-6 shadow-[0_25px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-[0_35px_90px_rgba(59,130,246,0.25)]"
    >
      {resolvedImageUrl && (
          <div className="relative mb-6 overflow-hidden rounded-[1.3rem] border border-[var(--color-border)] bg-[color-mix(in srgb,var(--color-surface) 15%, transparent)]">
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent" aria-hidden="true" />
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={resolvedImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 560px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              unoptimized={isSvg}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-5">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-textStrong sm:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="text-sm leading-6 text-text">
              {description}
            </p>
          )}
        </div>

        {jobMeta && (
          <Link
            href={`/experience/${jobMeta.id}`}
            className="inline-flex flex-col gap-1 self-start rounded-2xl border border-[var(--color-border)] bg-surfaceAlt px-4 py-2.5 text-left transition hover:brightness-105"
          >
            <span className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-text">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-sky-500"
              >
                <path d="M8 17h8" />
                <path d="M12 3v14" />
                <path d="M5 21h14" />
              </svg>
              Built at {jobMeta.company}
            </span>
            {jobMeta.title && (
              <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-textMuted">
                Role · {jobMeta.title}
              </span>
            )}
          </Link>
        )}

        {tags && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <SkillTag key={tag} skill={tag} />
            ))}
          </div>
        )}

        {projects && projects.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">
              Related Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border border-white/10 bg-white/5 p-4 dark:border-white/10 dark:bg-slate-900/30">
                  <h4 className="text-sm font-semibold text-textStrong">
                    {project.name}
                  </h4>
                  <p className="mt-2 text-xs text-textMuted">
                    {project.shortDescription}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.skills.slice(0, 3).map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                    {project.skills.length > 3 && (
                      <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] text-textMuted">
                        +{project.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {children}

        {linkUrl && (
          isExternalLink ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-outline)]"
            >
              {ctaLabel}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <Link
              href={linkUrl}
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-outline)]"
            >
              {ctaLabel}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        )}
      </div>
    </div>
  );

  return content;
}
