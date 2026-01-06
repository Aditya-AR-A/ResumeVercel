"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, LayoutGroup } from 'framer-motion';
import CommandInterface from './CommandInterface';
// Removed unused Hero import
import DynamicContentManager, { ViewType } from './DynamicContentManager';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

interface ScrollBasedContentProps {
  introData: IntroData;
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
}

const ScrollBasedContent: React.FC<ScrollBasedContentProps> = ({
  introData,
  projects,
  jobs,
  certificates
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [commandInput, setCommandInput] = useState('');
  // Track refs for sections (including hero as index 0)
  const sectionRefs = useRef<HTMLElement[]>([]);
  
  // Define the sequence of views
  const viewSequence: ViewType[] = useMemo(() => ['home', 'about', 'experience', 'projects', 'certificates'], []);

  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const jobCount = Array.isArray(jobs) ? jobs.length : 0;
  const certificateCount = Array.isArray(certificates) ? certificates.length : 0;

  const heroSummary = useMemo(() => {
    const about = introData?.about?.trim();
    if (!about) return '';
    const sentences = about
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return sentences.slice(0, 2).join(' ');
  }, [introData]);

  const sortedJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return [...jobs].sort((a, b) => {
      const aDate = new Date(a.startDate).getTime();
      const bDate = new Date(b.startDate).getTime();
      return Number.isNaN(bDate) || Number.isNaN(aDate) ? 0 : bDate - aDate;
    });
  }, [jobs]);

  const experienceYears = useMemo(() => {
    if (sortedJobs.length === 0) {
      return null;
    }
    const parsedDates = sortedJobs
      .map((job) => new Date(job.startDate))
      .filter((date) => !Number.isNaN(date.getTime()));
    if (parsedDates.length === 0) {
      return null;
    }
    const earliest = parsedDates.reduce((min, date) => (date < min ? date : min));
    const now = new Date();
    const diffMs = now.getTime() - earliest.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears > 0 ? diffYears : null;
  }, [sortedJobs]);

  const topSkills = useMemo(() => {
    const tally = new Map<string, number>();
    const pushSkills = (skills: string[] | undefined) => {
      (skills || []).forEach((skill) => {
        const key = skill.trim();
        if (!key) return;
        tally.set(key, (tally.get(key) || 0) + 1);
      });
    };

    if (Array.isArray(projects)) {
      projects.forEach((project) => pushSkills(project.skills));
    }
    if (Array.isArray(jobs)) {
      jobs.forEach((job) => pushSkills(job.skills));
    }
    if (Array.isArray(certificates)) {
      certificates.forEach((certificate) => pushSkills(certificate.skills));
    }

    return Array.from(tally.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3)
      .map(([skill]) => skill);
  }, [projects, jobs, certificates]);

  const heroStats = useMemo(() => {
    const stats: Array<{ label: string; value: string; accentClass: string }> = [];

    if (projectCount > 0) {
      stats.push({
        label: 'Projects',
        value: `${projectCount}`,
        accentClass: 'accent-projects'
      });
    }

    if (certificateCount > 0) {
      stats.push({
        label: 'Certificates',
        value: `${certificateCount}`,
        accentClass: 'accent-cert'
      });
    }

    if (experienceYears) {
      const rounded = experienceYears >= 5 ? Math.round(experienceYears) : Math.max(1, Number(experienceYears.toFixed(1)));
      stats.push({
        label: 'Years Experience',
        value: `${rounded}+`,
        accentClass: 'accent-experience'
      });
    }

    if (topSkills.length > 0) {
      const primarySkill = topSkills[0];
      const remainingCount = topSkills.length - 1;
      stats.push({
        label: 'Core Focus',
        value: remainingCount > 0 ? `${primarySkill} +${remainingCount}` : primarySkill,
        accentClass: 'accent-ai'
      });
    }

    return stats;
  }, [projectCount, certificateCount, experienceYears, topSkills]);
  
  const handleViewChange = (view: ViewType) => {
    // Optimistically set current view so UI highlights immediately
    if (view !== currentView) {
      setCurrentView(view);
    }
    const viewIndex = viewSequence.indexOf(view);
    if (viewIndex >= 0 && sectionRefs.current[viewIndex]) {
      sectionRefs.current[viewIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Fallback re-sync after scroll finishes (in case observer misses due to snap)
      setTimeout(() => {
        const el = sectionRefs.current[viewIndex];
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
            const ratio = visible / Math.min(vh, rect.height || vh);
          if (ratio >= 0.3 && currentView !== view) {
            setCurrentView(view);
          }
        }
      }, 400);
    }
  };

  // Visibility percentage based activation (choose section occupying largest portion of viewport)
  useEffect(() => {
    let ticking = false;
    const calcActive = () => {
      const vh = window.innerHeight || 1;
      let bestIdx = -1;
      let bestRatio = 0;
      sectionRefs.current.forEach((el, idx) => {
        if (!el) {
          return;
        }
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = visible / Math.min(vh, rect.height || vh);
        // Prefer higher ratio; in tie choose nearer to viewport center
        if (ratio > bestRatio + 0.001) {
          bestRatio = ratio;
          bestIdx = idx;
        } else if (Math.abs(ratio - bestRatio) <= 0.001 && ratio > 0) {
          const center = vh / 2;
          const elCenter = rect.top + rect.height / 2;
          const bestEl = sectionRefs.current[bestIdx];
          if (bestEl) {
            const bestRect = bestEl.getBoundingClientRect();
            const bestCenter = bestRect.top + bestRect.height / 2;
            if (Math.abs(elCenter - center) < Math.abs(bestCenter - center)) {
              bestIdx = idx;
            }
          }
        }
      });
      if (bestIdx >= 0) {
        const view = viewSequence[bestIdx];
        if (view && view !== currentView) {
          setCurrentView(view);
        }
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calcActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    // Initial calculation
    calcActive();
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [currentView, viewSequence]);

  return (
    <LayoutGroup id="app-shared-layout">
    <div className="scroll-smooth">
      {/* Hero + Interactive (combined) */}
      <motion.div
        ref={el => { if (el) { sectionRefs.current[0] = el; } }}
        data-view="home"
        className="relative flex min-h-[88vh] flex-col justify-start gap-8 sm:gap-10 lg:gap-12 snap-start px-4 sm:px-0"
        initial={false}
        animate={{ 
          scale: currentView === 'home' ? 1 : 0.992,
          filter: currentView === 'home' ? 'blur(0px)' : 'blur(0.25px)'
        }}
        style={{ pointerEvents: 'auto' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Dim overlay when hero not active instead of lowering opacity of content */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          initial={false}
          animate={{ backgroundColor: currentView === 'home' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.55)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ mixBlendMode: 'multiply' }}
        />
        <section className="flex flex-col justify-center pt-10 sm:pt-14 md:pt-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
                {/* Left Column - Text Content */}
                <div className="relative z-10 space-y-5 sm:space-y-6 lg:space-y-8 order-2 lg:order-1 lg:flex-1">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1 sm:w-1.5 h-5 sm:h-6 lg:h-8 brand-gradient-bar rounded-full"></div>
                      <span className="intro-badge text-[11px] sm:text-xs">Welcome to my portfolio</span>
                    </div>
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Hi, I&apos;m{' '}
                      <motion.span className="heading-gradient" layoutId="brand-name">{introData.name}</motion.span>
                    </h1>
                    <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                      {introData.title}
                    </h2>
                  </div>
                  {heroSummary && (
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
                      {heroSummary}
                    </p>
                  )}

                  {heroStats.length > 0 && (
                    <div className="flex flex-wrap gap-4 sm:gap-6 pt-1">
                      {heroStats.map((stat) => (
                        <div key={stat.label} className="text-center min-w-[60px]">
                          <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.accentClass}`}>{stat.value}</div>
                          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Profile Image & Command Interface */}
                <div className="relative z-10 order-1 lg:order-2 flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 lg:flex-shrink-0">
                  <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                    <div className="absolute -inset-2 sm:-inset-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--accent-gradient-start)_0%,transparent_65%)] opacity-60 blur-md sm:blur-lg lg:blur-xl" />
                    <Image
                      src={introData.profileImage?.src || 'https://avatars.githubusercontent.com/u/126697615?v=4'}
                      alt={introData.profileImage?.alt || 'Portrait of ' + introData.name}
                      width={256}
                      height={256}
                      sizes="(max-width: 475px) 128px, (max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                      className="w-full h-full rounded-full object-cover shadow-lg ring-1 ring-[color-mix(in_srgb,var(--accent-gradient-mid)_35%,transparent)]"
                      priority
                    />
                  </div>

                  <motion.div
                    layout
                    layoutId="command-interface"
                    className="w-full max-w-sm sm:max-w-md"
                    transition={{ layout: { duration: 0.45, ease: [0.4, 0.0, 0.2, 1] } }}
                  >
                    <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/65 p-3 sm:p-4 shadow-[0_12px_32px_rgba(15,23,42,0.15)] sm:shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/70">
                      <CommandInterface
                        variant="full"
                        onViewChange={handleViewChange}
                        currentView={currentView}
                        value={commandInput}
                        onValueChange={setCommandInput}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/60 p-4 sm:p-5 shadow-[0_12px_32px_rgba(15,23,42,0.15)] sm:shadow-[0_18px_45px_rgba(15,23,42,0.18)] dark:border-white/15 dark:bg-slate-950/60">
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    At a Glance
                  </h3>
                  <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-3 sm:gap-4 text-slate-700 dark:text-slate-200">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-sky-500 dark:text-sky-400">{projectCount}</div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-emerald-500 dark:text-emerald-400">{jobCount}</div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-amber-500 dark:text-amber-400">{certificateCount}</div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Certs</div>
                    </div>
                    {topSkills[0] && (
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-violet-500 dark:text-violet-400 truncate">{topSkills[0]}</div>
                        <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Focus</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Sequential Content Sections (About .. Contact) */}
      {viewSequence.slice(1).map((view, idx) => {
        const sectionIndex = idx + 1; // offset for hero
        return (
          <motion.section
            key={view}
            ref={el => { if (el) sectionRefs.current[sectionIndex] = el; }}
            data-view={view}
            className="min-h-screen flex items-center justify-center snap-start overflow-hidden"
            initial={false}
            animate={{ 
              opacity: currentView === view ? 1 : 0.05,
              scale: currentView === view ? 1 : 0.99,
              filter: currentView === view ? 'blur(0px)' : 'blur(0.3px)'
            }}
            style={{ pointerEvents: 'auto' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-full"
              initial={false}
              animate={{ 
                y: currentView === view ? 0 : 10,
                scale: currentView === view ? 1 : 0.985,
                opacity: currentView === view ? 1 : 0.85
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <DynamicContentManager
                currentView={view}
                introData={introData}
                projects={projects}
                jobs={jobs}
                certificates={certificates}
              />
            </motion.div>
          </motion.section>
        );
      })}

      {/* Scroll Progress Indicator */}
  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="flex flex-col space-y-2">
          {viewSequence.map((view) => (
            <motion.div
              key={view}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 progress-dot ${currentView === view ? 'progress-dot-active' : ''}`}
              onClick={() => handleViewChange(view)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
  </div>
  </LayoutGroup>
  );
};

export default ScrollBasedContent;
