import React from 'react';

interface PageHeroStat {
  label: string;
  value: string | number;
  suffix?: string;
  helperText?: string;
  accentClass?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actions?: React.ReactNode;
  stats?: PageHeroStat[];
}

const accentFallback = 'text-blue-500 dark:text-blue-400';

const alignmentMap: Record<'left' | 'center', string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
};

const actionsAlignmentMap: Record<'left' | 'center', string> = {
  left: 'justify-start',
  center: 'justify-center',
};

const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  actions,
  stats,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 px-8 py-12 shadow-[0_35px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl dark:border-white/5 dark:bg-slate-950/60 sm:px-12 lg:px-16">
      <div className="pointer-events-none absolute -top-40 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/35 via-indigo-500/10 to-transparent blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -left-12 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-500/25 via-pink-500/10 to-transparent blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-6">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 dark:border-white/10 dark:text-slate-200">
            {eyebrow}
          </span>
        )}

        <div className={`flex flex-col gap-4 ${alignmentMap[align]}`}>
          <h1 className="heading-gradient text-4xl font-bold sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              {description}
            </p>
          )}
          {actions && (
            <div className={`flex flex-wrap gap-4 ${actionsAlignmentMap[align]}`}>
              {actions}
            </div>
          )}
        </div>

        {Array.isArray(stats) && stats.length > 0 && (
          <div
            className={`grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ${
              align === 'center' ? 'mx-auto' : 'mx-auto sm:mx-0 sm:mr-auto'
            }`}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 text-center shadow-inner dark:border-white/10 dark:bg-slate-900/40"
              >
                <div className={`text-2xl font-semibold sm:text-3xl ${stat.accentClass ?? accentFallback}`}>
                  <span>{stat.value}</span>
                  {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                  {stat.label}
                </p>
                {stat.helperText && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {stat.helperText}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export type { PageHeroStat };
export default PageHero;
