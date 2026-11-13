import source from '@/data/portfolio.json';
import type { IntroData, Project, Job, Certificate, SkillsResponse, SearchResponse } from '@/types/interfaces';

// Versioned editorial content keeps every public route consistent and independent
// of the separately hosted API's availability.
export const intro = source.intro as unknown as IntroData;
export const projects = source.projects as unknown as Project[];
export const jobs = source.jobs as unknown as Job[];
export const certificates = source.certificates as unknown as Certificate[];
export const PROFILE_TITLE = intro.title;

export function categoryForSkill(value: string) {
  const s = value.toLowerCase();
  if (/^(python|sql|javascript|typescript|r|html|css)$/.test(s)) return 'Languages';
  if (/mongo|mysql|postgres|dbms|database/.test(s)) return 'Databases';
  if (/power bi|qlik|tableau|excel|pandas|numpy|plotly|seaborn|matplotlib|data |eda|statistic/.test(s)) return 'Data & BI';
  if (/llm|prompt|embedding|livekit|twilio|nlp|learning|cnn|rnn|transformer|yolo|opencv|tensorflow/.test(s)) return 'AI & Automation';
  return 'Development & Tools';
}

export function getSkills(): SkillsResponse {
  const entries = new Map<string, { skill: string; count: number; categories: string[] }>();
  for (const record of [...projects, ...jobs, ...certificates]) {
    for (const skill of record.skills ?? []) {
      const key = skill.trim().toLowerCase();
      const old = entries.get(key);
      entries.set(key, { skill: old?.skill ?? skill.trim(), count: (old?.count ?? 0) + 1, categories: [categoryForSkill(skill)] });
    }
  }
  const skills = Array.from(entries.values()).sort((a, b) => a.skill.localeCompare(b.skill));
  return { skills, categories: Array.from(new Set(skills.flatMap(s => s.categories))), total_unique_skills: skills.length };
}

export function searchPortfolio(query: string): SearchResponse {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const sections = [
    { type: 'projects', items: projects },
    { type: 'jobs', items: jobs },
    { type: 'certificates', items: certificates },
  ].map(section => ({
    type: section.type,
    items: section.items.filter(item => {
      // Search only public content, excluding asset markup and file paths.
      const record = item as unknown as Record<string, unknown>;
      const text = ['name', 'title', 'company', 'description', 'shortDescription', 'skills', 'highlights', 'category', 'field', 'provider']
        .map(key => JSON.stringify(record[key] ?? '')).join(' ').toLowerCase();
      return terms.length > 0 && terms.every(term => text.includes(term));
    }),
    count: 0,
  }));
  sections.forEach(s => { s.count = s.items.length; });
  const total = sections.reduce((sum, s) => sum + s.count, 0);
  return { query, sections, items: [], total_count: total, search_time: 0, search_type: 'keyword', pagination: { total_count: total, limit: total, offset: 0, has_more: false } };
}
