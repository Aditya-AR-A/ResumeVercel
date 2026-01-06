"use client";

import React, { useMemo } from 'react';
import Section from '@/components/Section';
import type { Certificate, IntroData, Job, Project, SkillsResponse, SkillAggregation } from '@/types/interfaces';

interface AboutViewProps {
  introData: IntroData;
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
  skillsAggregation?: SkillsResponse;
}

const surfaceClasses = 'rounded-3xl border border-white/12 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-lg dark:border-white/8 dark:bg-slate-950/65';

const AboutView: React.FC<AboutViewProps> = ({ introData, projects, jobs, certificates, skillsAggregation }) => {
  const aboutParagraphs = useMemo(() => {
    const about = introData?.about?.trim();
    if (!about) return [];
    return about
      .split(/(?<=[.!?])\s+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [introData]);

  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const jobCount = Array.isArray(jobs) ? jobs.length : 0;
  const certificateCount = Array.isArray(certificates) ? certificates.length : 0;

  const currentJob = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return undefined;
    return jobs.find((job) => job.isCurrent) || jobs[0];
  }, [jobs]);

  const experienceYears = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return null;
    const parsed = jobs
      .map((job) => new Date(job.startDate))
      .filter((date) => !Number.isNaN(date.getTime()));
    if (parsed.length === 0) return null;
    const earliest = parsed.reduce((min, date) => (date < min ? date : min));
    const now = new Date();
    const diffYears = (now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears > 0 ? diffYears : null;
  }, [jobs]);

  const projectCategories = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return Array.from(new Set(projects.map((project) => project.category).filter(Boolean))).slice(0, 5);
  }, [projects]);

  const certificateFields = useMemo(() => {
    if (!Array.isArray(certificates)) return [];
    return Array.from(new Set(certificates.map((certificate) => certificate.field).filter(Boolean))).slice(0, 4);
  }, [certificates]);

  const categorizedSkills = useMemo(() => {
    const aggs = skillsAggregation?.skills || [];
    const bucket = new Map<string, SkillAggregation[]>();
    const categorize = (skill: string) => {
      const s = skill.toLowerCase();
      if (['python', 'typescript', 'javascript', 'sql', 'r'].includes(s)) return 'Programming Languages';
      if (['fastapi', 'django', 'next.js', 'nextjs', 'tensorflow', 'pytorch', 'keras', 'opencv'].includes(s)) return 'Frameworks';
      if (['power bi', 'tableau', 'qlik sense', 'qlikview', 'excel', 'plotly', 'seaborn', 'matplotlib'].includes(s)) return 'Tools';
      if (['mysql', 'dbms', 'rdbms'].includes(s)) return 'Databases';
      if (['llms', 'cnn', 'rnn', 'lstm', 'yolov8', 'transformers', 'nlp', 'machine learning', 'deep learning', 'reinforcement learning'].includes(s)) return 'AI/ML';
      return 'Other';
    };
    const toLevel = (count: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
      if (count >= 6) return 'expert';
      if (count >= 4) return 'advanced';
      if (count >= 2) return 'intermediate';
      return 'beginner';
    };
    aggs.forEach((agg) => {
      const category = categorize(agg.skill);
      const level = toLevel(agg.count);
      const enriched: SkillAggregation = { ...agg, proficiency: level };
      const list = bucket.get(category) || [];
      list.push(enriched);
      bucket.set(category, list);
    });
    const entries = Array.from(bucket.entries()).map(([category, list]) => {
      const sorted = list.slice().sort((a, b) => {
        const order = { expert: 3, advanced: 2, intermediate: 1, beginner: 0 } as const;
        const ao = order[(a.proficiency as any) || 'beginner'];
        const bo = order[(b.proficiency as any) || 'beginner'];
        return bo - ao || a.skill.localeCompare(b.skill);
      });
      return { category, skills: sorted };
    });
    entries.sort((a, b) => a.category.localeCompare(b.category));
    return entries;
  }, [skillsAggregation]);

  const topSkills = useMemo(() => {
    const tally = new Map<string, number>();
    const tallySkills = (skills: string[] | undefined) => {
      (skills || []).forEach((skill) => {
        const key = skill.trim();
        if (!key) return;
        tally.set(key, (tally.get(key) || 0) + 1);
      });
    };

    if (Array.isArray(projects)) {
      projects.forEach((project) => tallySkills(project.skills));
    }
    if (Array.isArray(jobs)) {
      jobs.forEach((job) => tallySkills(job.skills));
    }
    if (Array.isArray(certificates)) {
      certificates.forEach((certificate) => tallySkills(certificate.skills));
    }

    return Array.from(tally.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([skill]) => skill);
  }, [projects, jobs, certificates]);

  const formatExperienceValue = () => {
    if (!experienceYears) return null;
    if (experienceYears >= 5) return `${Math.round(experienceYears)}+ years`;
    const rounded = Math.max(1, Number(experienceYears.toFixed(1)));
    return `${rounded} years`;
  };

  return (
    <Section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
          About Me
        </h2>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <div className="space-y-5 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {aboutParagraphs.length > 0 ? (
              aboutParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>
                I&apos;m a developer focused on AI-powered products, data-intensive applications, and the tooling that glues them together.
              </p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className={`${surfaceClasses} space-y-6`}>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Snapshot
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                    Current Role
                  </div>
                  <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
                    {currentJob ? (
                      <>
                        {currentJob.title}
                        <span className="block text-slate-500 dark:text-slate-300">{currentJob.company}</span>
                      </>
                    ) : (
                      'Available for opportunities'
                    )}
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                    Experience
                  </div>
                  <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
                    {formatExperienceValue() || '3+ years'}
                    <span className="block text-slate-500 dark:text-slate-300">Across {jobCount} roles</span>
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                    Portfolio Scale
                  </div>
                  <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
                    {projectCount} projects · {certificateCount} certificates
                  </p>
                </div>
                {projectCategories.length > 0 && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                      Focus Areas
                    </div>
                    <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
                      {projectCategories.join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${surfaceClasses} space-y-6`}>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Core Skills & Credentials
              </h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                {topSkills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                      Frequently applied technologies
                    </h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topSkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {certificateFields.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                      Certification domains
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {certificateFields.map((field) => (
                        <li key={field} className="flex items-center gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {categorizedSkills.length > 0 && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                      Categorized skills with proficiency
                    </h4>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {categorizedSkills.map(({ category, skills }) => (
                        <div key={category}>
                          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 mb-2">
                            {category}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((s) => {
                              const level = (s.proficiency as any) || 'beginner';
                              const levelClass =
                                level === 'expert' ? 'bg-purple-500' :
                                level === 'advanced' ? 'bg-green-500' :
                                level === 'intermediate' ? 'bg-blue-500' : 'bg-yellow-500';
                              return (
                                <span
                                  key={`${category}-${s.skill}`}
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                                  title={`Proficiency: ${level}`}
                                >
                                  <span className={`inline-block w-2 h-2 rounded-full ${levelClass}`} />
                                  {s.skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutView;
