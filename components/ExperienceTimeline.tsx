"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Job } from '@/types/interfaces';

interface ExperienceTimelineProps {
  jobs: Job[];
}

interface TimelineItem {
  id: string;
  title: string;
  company: string;
  start: Date;
  end: Date;
  isCurrent: boolean;
}

type GradientSpec = {
  stops: [string, string, string];
  accent: string;
  pill: string;
  line: string;
};

interface ComputedTimelineItem extends TimelineItem {
  startPct: number;
  widthPct: number;
  midPct: number;
  durationLabel: string;
  durationMonths: number;
  durationMs: number;
  paletteIndex: number;
}

interface TimelineShape extends ComputedTimelineItem {
  path: string;
  gradientId: string;
  peakYPx: number;
  labelTopPx: number;
  connectorHeightPx: number;
  peakYPercent: number;
  palette: GradientSpec;
}

const gradientPalette: GradientSpec[] = [
  {
    stops: ['#38bdf8', '#6366f1', '#8b5cf6'],
    accent: 'rgba(99,102,241,0.3)',
    pill: '#312e81',
    line: 'rgba(99,102,241,0.35)'
  },
  {
    stops: ['#34d399', '#22d3ee', '#0ea5e9'],
    accent: 'rgba(16,185,129,0.32)',
    pill: '#064e3b',
    line: 'rgba(16,185,129,0.35)'
  },
  {
    stops: ['#a78bfa', '#f472b6', '#fb7185'],
    accent: 'rgba(217,70,239,0.28)',
    pill: '#6b21a8',
    line: 'rgba(217,70,239,0.32)'
  },
  {
    stops: ['#f97316', '#f59e0b', '#facc15'],
    accent: 'rgba(249,115,22,0.32)',
    pill: '#7c2d12',
    line: 'rgba(249,115,22,0.32)'
  }
];

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 220;
const CONTAINER_HEIGHT_PX = 256; // matches h-64 container height (16rem)
const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

const formatMonthYear = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const formatDuration = (start: Date, end: Date) => {
  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  const totalMonths = Math.max(Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)), 1);
  if (totalMonths < 12) {
    return `${totalMonths} mo${totalMonths === 1 ? '' : 's'}`;
  }
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  if (remainingMonths === 0) {
    return `${years} yr${years === 1 ? '' : 's'}`;
  }
  return `${years} yr${years === 1 ? '' : 's'} ${remainingMonths} mo${remainingMonths === 1 ? '' : 's'}`;
};

const toTimelineItems = (jobs: Job[]): TimelineItem[] => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs
    .map((job) => {
      const start = new Date(job.startDate);
      const isValidStart = !Number.isNaN(start.getTime());
      if (!isValidStart) {
        return null;
      }

      const endSource = job.isCurrent ? new Date() : job.endDate ? new Date(job.endDate) : start;
      const end = new Date(endSource);
      const isValidEnd = !Number.isNaN(end.getTime());

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        start,
        end: isValidEnd ? end : start,
        isCurrent: job.isCurrent
      } as TimelineItem;
    })
    .filter((item): item is TimelineItem => Boolean(item))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ jobs }) => {
  const items = useMemo(() => toTimelineItems(jobs), [jobs]);
  const hasItems = items.length > 0;
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const previousHoveredId = useRef<string | null>(null);
  const router = useRouter();

  const { earliest, latest, totalDuration } = useMemo(() => {
    if (!hasItems) {
      const now = new Date();
      return { earliest: now, latest: now, totalDuration: 1 };
    }

    const earliestDate = items.reduce((min, item) => (item.start < min ? item.start : min), items[0].start);
    const latestDate = items.reduce((max, item) => (item.end > max ? item.end : max), items[0].end);
    const duration = Math.max(latestDate.getTime() - earliestDate.getTime(), 1);

    return { earliest: earliestDate, latest: latestDate, totalDuration: duration };
  }, [items, hasItems]);

  const computed = useMemo<ComputedTimelineItem[]>(() => {
    if (!hasItems) {
      return [];
    }

    return items.map((item, index) => {
      const startOffset = item.start.getTime() - earliest.getTime();
      const durationMs = Math.max(item.end.getTime() - item.start.getTime(), 1);
      const startPct = Math.max(0, (startOffset / totalDuration) * 100);
      const rawWidth = (durationMs / totalDuration) * 100;
      const widthPct = Math.min(Math.max(rawWidth, 10), 100 - startPct);
      const midPct = Math.min(startPct + widthPct / 2, 100);
      const durationMonths = Math.max(Math.round(durationMs / MONTH_IN_MS), 1);
      const paletteIndex = index % gradientPalette.length;

      return {
        ...item,
        startPct,
        widthPct,
        midPct,
        durationLabel: formatDuration(item.start, item.end),
        durationMonths,
        durationMs,
        paletteIndex
      };
    });
  }, [items, earliest, totalDuration, hasItems]);

  const shapes = useMemo<TimelineShape[]>(() => {
    if (!hasItems) {
      return [];
    }

    const maxDurationMonths = computed.reduce((max, item) => Math.max(max, item.durationMonths), 1);

    return computed.map((item) => {
      const palette = gradientPalette[item.paletteIndex];
      const startX = (item.startPct / 100) * VIEWBOX_WIDTH;
      const endPct = Math.min(item.startPct + item.widthPct, 100);
      const endX = (endPct / 100) * VIEWBOX_WIDTH;
      const midX = (item.midPct / 100) * VIEWBOX_WIDTH;
      const heightFactor = maxDurationMonths ? item.durationMonths / maxDurationMonths : 0.5;
      const peakY = VIEWBOX_HEIGHT - (VIEWBOX_HEIGHT * (0.3 + heightFactor * 0.5));
      const peakYClamped = Math.max(VIEWBOX_HEIGHT * 0.12, Math.min(peakY, VIEWBOX_HEIGHT * 0.82));
      const path = `M ${startX} ${VIEWBOX_HEIGHT} Q ${midX} ${peakYClamped} ${endX} ${VIEWBOX_HEIGHT} Z`;
      const peakYPx = (peakYClamped / VIEWBOX_HEIGHT) * CONTAINER_HEIGHT_PX;
      const labelTopPx = Math.max(20, peakYPx - 120);
      const connectorHeightPx = Math.max(28, peakYPx - labelTopPx - 12);

      return {
        ...item,
        path,
        gradientId: `timelineGradient-${item.id}`,
        peakYPx,
        labelTopPx,
        connectorHeightPx,
        peakYPercent: (peakYClamped / VIEWBOX_HEIGHT) * 100,
        palette
      };
    });
  }, [computed, hasItems]);

  const shapesForSvg = useMemo(() => {
    return [...shapes].sort((a, b) => b.durationMonths - a.durationMonths);
  }, [shapes]);

  const hoveredShape = useMemo(() => {
    if (!hoveredJobId) {
      return null;
    }
    return shapes.find((shape) => shape.id === hoveredJobId) ?? null;
  }, [hoveredJobId, shapes]);

  const timelineTicks = useMemo(() => {
    if (!hasItems) {
      return [] as { label: string; position: number }[];
    }

    const ticks: { label: string; position: number }[] = [];
    const startYear = earliest.getFullYear();
    const endYear = latest.getFullYear() + (items[items.length - 1].isCurrent ? 1 : 0);

    for (let year = startYear; year <= endYear; year++) {
      const reference = new Date(year, 0, 1);
      const offset = reference.getTime() - earliest.getTime();
      const position = Math.min(Math.max((offset / totalDuration) * 100, 2), 98);
      ticks.push({ label: `${year}`, position });
    }

    return ticks;
  }, [earliest, latest, totalDuration, items, hasItems]);

  const focusJob = useCallback((jobId: string) => {
    setHoveredJobId(jobId);

    const target = document.getElementById(`job-${jobId}`);
    if (!target) {
      router.push(`/experience/${jobId}`);
      return;
    }

    target.classList.add('timeline-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

    window.setTimeout(() => {
      target.classList.remove('timeline-highlight');
    }, 1400);
  }, [router]);

  const clearHover = useCallback(() => {
    setHoveredJobId(null);
  }, []);

  useEffect(() => {
    const previousId = previousHoveredId.current;
    if (previousId && previousId !== hoveredJobId) {
      const previousElement = document.getElementById(`job-${previousId}`);
      previousElement?.classList.remove('timeline-hover-card');
    }

    if (hoveredJobId) {
      const element = document.getElementById(`job-${hoveredJobId}`);
      element?.classList.add('timeline-hover-card');
    }

    previousHoveredId.current = hoveredJobId;

    return () => {
      if (hoveredJobId) {
        const element = document.getElementById(`job-${hoveredJobId}`);
        element?.classList.remove('timeline-hover-card');
      }
    };
  }, [hoveredJobId]);

  if (!hasItems) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/70 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
              Timeline
            </p>
            <h2 className="heading-gradient text-2xl font-semibold sm:text-3xl">Career Progression</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:max-w-sm">
            Hover or tap a milestone to jump to the detailed role below. Length of each band shows time spent in that role.
          </p>
        </div>

        <div className="relative mt-10 hidden h-64 px-10 md:block">
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="timelineBackdropGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(148,163,184,0.25)" />
                <stop offset="65%" stopColor="rgba(148,163,184,0.12)" />
                <stop offset="100%" stopColor="rgba(15,23,42,0.2)" />
              </linearGradient>
              <filter id="timelineGlow" x="-8%" y="-8%" width="116%" height="116%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {shapes.map((shape) => (
                <linearGradient
                  key={shape.gradientId}
                  id={shape.gradientId}
                  x1={shape.startPct}
                  x2={shape.startPct + shape.widthPct}
                  y1="0"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={shape.palette.stops[0]} stopOpacity={0.72} />
                  <stop offset="55%" stopColor={shape.palette.stops[1]} stopOpacity={0.85} />
                  <stop offset="100%" stopColor={shape.palette.stops[2]} stopOpacity={0.75} />
                </linearGradient>
              ))}
            </defs>

            <rect x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#timelineBackdropGradient)" opacity="0.2" />

            <line
              x1="0"
              x2={VIEWBOX_WIDTH}
              y1={VIEWBOX_HEIGHT}
              y2={VIEWBOX_HEIGHT}
              stroke="rgba(148,163,184,0.4)"
              strokeWidth={1}
              strokeDasharray="12 10"
            />

            {shapesForSvg.map((shape) => (
              <path
                key={`${shape.id}-shape`}
                d={shape.path}
                fill={`url(#${shape.gradientId})`}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={hoveredJobId === shape.id ? 1.5 : 1.1}
                opacity={hoveredJobId && hoveredJobId !== shape.id ? 0.45 : 0.9}
              />
            ))}
            {hoveredShape && (
              <path
                d={hoveredShape.path}
                fill={`url(#${hoveredShape.gradientId})`}
                stroke={hoveredShape.palette.accent}
                strokeOpacity={0.8}
                strokeWidth={2.2}
                opacity={1}
                filter="url(#timelineGlow)"
              />
            )}
          </svg>

          {timelineTicks.map((tick) => (
            <div
              key={tick.label}
              className="absolute bottom-6 flex flex-col items-center"
              style={{ left: `${tick.position}%`, transform: 'translateX(-50%)' }}
            >
              <span className="h-6 w-px rounded-full bg-slate-300/70 dark:bg-slate-700/70" />
              <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                {tick.label}
              </span>
            </div>
          ))}

          {shapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => focusJob(shape.id)}
              onMouseEnter={() => setHoveredJobId(shape.id)}
              onMouseLeave={clearHover}
              onFocus={() => setHoveredJobId(shape.id)}
              onBlur={clearHover}
              className="group absolute flex translate-x-[-50%] flex-col items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
              style={{
                left: `${shape.midPct}%`,
                top: `${shape.labelTopPx}px`,
                zIndex: hoveredJobId === shape.id ? 40 : 10,
                opacity: hoveredJobId && hoveredJobId !== shape.id ? 0.6 : 1,
                transform: hoveredJobId === shape.id ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%)'
              }}
              aria-label={`View details for ${shape.title} at ${shape.company}`}
            >
              <span
                className={`timeline-node-card min-w-[180px] rounded-2xl border px-4 py-3 text-xs text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.22)] transition dark:text-slate-200 ${
                  hoveredJobId === shape.id ? 'timeline-node-card-active bg-white dark:bg-slate-950/95' : 'bg-white/90 dark:bg-slate-950/85'
                }`}
                style={{
                  borderColor: shape.palette.accent,
                  boxShadow: '0 20px 40px rgba(15,23,42,0.25)'
                }}
              >
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-900 dark:text-white">
                  {shape.title}
                  <span
                    className="rounded-full px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white"
                    style={{ background: shape.palette.pill }}
                  >
                    {shape.durationLabel}
                  </span>
                </span>
                <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.32em] text-slate-400 dark:text-slate-400">
                  {shape.company}
                </span>
                <span className="mt-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  <span>{formatMonthYear(shape.start)}</span>
                  <span className="block h-px w-6 bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                  <span>{shape.isCurrent ? 'Present' : formatMonthYear(shape.end)}</span>
                </span>
              </span>
              <span
                className="w-px border-l-2 border-dashed"
                style={{
                  height: `${shape.connectorHeightPx}px`,
                  borderColor: shape.palette.line,
                  opacity: hoveredJobId && hoveredJobId !== shape.id ? 0.35 : 0.7
                }}
              />
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              role="button"
              tabIndex={0}
              onClick={() => focusJob(shape.id)}
              onMouseEnter={() => setHoveredJobId(shape.id)}
              onMouseLeave={clearHover}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  focusJob(shape.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border border-white/10 bg-white/65 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.15)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-white/10 dark:bg-slate-950/60 ${
                hoveredJobId === shape.id ? 'timeline-node-card-active' : 'hover:shadow-[0_18px_45px_rgba(15,23,42,0.22)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{shape.title}</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">
                    {shape.company}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white"
                  style={{ background: shape.palette.pill }}
                >
                  {shape.durationLabel}
                </span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${shape.widthPct}%`,
                    background: `linear-gradient(90deg, ${shape.palette.stops[0]}, ${shape.palette.stops[1]}, ${shape.palette.stops[2]})`
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                <span>{formatMonthYear(shape.start)}</span>
                <span className="block h-px w-6 bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                <span>{shape.isCurrent ? 'Present' : formatMonthYear(shape.end)}</span>
                <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white dark:bg-white/15 dark:text-white">
                  Tap to view role
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
