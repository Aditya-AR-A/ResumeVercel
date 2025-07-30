import { useMemo } from 'react';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/projects';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ProjectsByCategory } from './components/ProjectsByCategory';
import { groupByCategory } from './utils/groupByCategory';
import styles from './Projects.module.css';

export default function Projects() {
  const projects: Project[] = (projectsData as Project[]).filter((p) => p && p.name);
  const featured = useMemo(() => projects.filter(p => p.featured), [projects]);
  const grouped = useMemo(() => groupByCategory(projects.filter(p => !p.featured)), [projects]);

  return (
    <div className={styles.projectsPage}>
      <FeaturedProjects projects={featured} />
      <ProjectsByCategory categoryProjects={grouped} />
    </div>
  );
}
