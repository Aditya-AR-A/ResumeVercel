"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import type { Certificate, IntroData, Job, Project, SkillsResponse } from '@/types/interfaces';
import { categoryForSkill } from '@/utils/portfolio';
import { totalExperience } from '@/utils/experience';

interface AboutViewProps {
  introData: IntroData; projects: Project[]; jobs: Job[]; certificates: Certificate[];
  skillsAggregation?: SkillsResponse; compact?: boolean;
}
const focusAreas = [
  { title: 'AI & Python', description: 'Recruitment workflows, conversational prompts, and voice integrations.', skills: ['Python', 'LLMs', 'Prompt Engineering', 'LiveKit / Twilio'] },
  { title: 'Data & analytics', description: 'Operational reporting, HR data preparation, and business intelligence.', skills: ['Power BI / DAX', 'Dash / Plotly', 'Pandas / openpyxl', 'Qlik Enterprise'] },
  { title: 'Backend & workflows', description: 'APIs, data processing, and tools that connect business workflows.', skills: ['Django / DRF', 'FastAPI', 'MongoDB', 'REST APIs'] },
];
export default function AboutView({ introData, projects, jobs, certificates, skillsAggregation, compact = false }: AboutViewProps) {
  const groups = useMemo(() => {
    const entries = new Map<string, Set<string>>();
    const skills = skillsAggregation?.skills.map(s => s.skill) ?? [...projects, ...jobs, ...certificates].flatMap(r => r.skills ?? []);
    for (const skill of skills) {
      const category = categoryForSkill(skill);
      const list = entries.get(category) ?? new Set<string>();
      list.add(skill); entries.set(category, list);
    }
    return Array.from(entries.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [projects, jobs, certificates, skillsAggregation]);
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl space-y-3">
          <p className="intro-badge">Focus & skills</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-textStrong">AI workflows. Useful data. Practical tools.</h2>
          {!compact && <p className="text-textMuted leading-7">{introData.about}</p>}
        </div>
        {compact && <Link href="/about" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">More about me →</Link>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {focusAreas.map(area => <article key={area.title} className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-textStrong">{area.title}</h3>
          <p className="mt-2 text-sm leading-6 text-textMuted">{area.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{area.skills.map(skill => <span key={skill} className="rounded-md bg-surfaceAlt px-2 py-1 text-xs text-text">{skill}</span>)}</div>
        </article>)}
      </div>
      {!compact && <>
        <p className="text-sm text-textMuted">{totalExperience(jobs)} across the listed employment periods. Earlier ML explorations and certificates are included as background; current work centres on AI/Python development and data analysis.</p>
        <details className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 sm:p-6">
          <summary className="cursor-pointer font-semibold text-textStrong">Explore all technologies & study topics</summary>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-textMuted">Collected from project, employment, and certificate records. A certificate or a mention indicates exposure, rather than a proficiency rating. Django and DRF appear in my backend project work and remain current learning priorities.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{groups.map(([category, skills]) => <div key={category}>
            <h3 className="mb-3 text-sm font-semibold text-textStrong">{category}</h3>
            <div className="flex flex-wrap gap-2">{Array.from(skills).sort().map(skill => <span key={skill} className="rounded-md bg-surfaceAlt px-2 py-1 text-xs text-text">{skill}</span>)}</div>
          </div>)}</div>
        </details>
      </>}
    </div>
  );
}
