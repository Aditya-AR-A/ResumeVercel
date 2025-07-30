import { Project } from '@/types/projects';
import { ProjectCard } from '../ProjectCard';
import styles from '../../Projects.module.css';

interface ProjectsByCategoryProps {
  categoryProjects: Record<string, Project[]>;
}

export function ProjectsByCategory({ categoryProjects }: ProjectsByCategoryProps) {
  return (
    <>
      {Object.entries(categoryProjects).map(([category, projects]) => (
        <section key={category} className={styles.categorySection}>
          <h3 className={styles.sectionTitle}>{category}</h3>
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
