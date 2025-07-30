import { Project } from '@/types/projects';
import { ProjectCard } from '../ProjectCard';
import styles from '../../Projects.module.css';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) return null;

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Featured Projects</h2>
      <div className={styles.featuredGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} featured />
        ))}
      </div>
    </section>
  );
}
