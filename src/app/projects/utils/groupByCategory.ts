import { Project } from '@/types/projects';

export function groupByCategory(projects: Project[]): Record<string, Project[]> {
  return projects.reduce((acc: Record<string, Project[]>, p) => {
    const cat = p.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});
}
