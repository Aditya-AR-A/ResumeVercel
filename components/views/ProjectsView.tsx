"use client";

import React, { useMemo } from 'react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Job, Project } from '@/types/interfaces';

interface ProjectsViewProps {
  projects: Project[];
  jobs?: Job[];
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, jobs = [] }) => {
  const jobLookup = useMemo(() => {
    const map = new Map<string, Job>();
    if (Array.isArray(jobs)) {
      jobs.forEach((job) => {
        map.set(job.id, job);
      });
    }
    return map;
  }, [jobs]);

  const featuredProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      return [];
    }
    return projects.filter((project) => project.featured).slice(0, 3);
  }, [projects]);

  const getJobMeta = (project: Project) => {
    const candidateIds = [project.jobId, ...(project.relatedJobIds ?? [])].filter(Boolean) as string[];
    for (const id of candidateIds) {
      const job = jobLookup.get(id);
      if (job) {
        return { id: job.id, title: job.title, company: job.company };
      }
    }
    return undefined;
  };

  return (
    <Section className="py-16" containerClassName="max-w-5xl">
      <div className="space-y-10">
        <h2 className="heading-gradient text-4xl font-bold text-center">Featured Projects</h2>
        <div className="space-y-6">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <Card
                key={project.id}
                title={project.name}
                description={project.shortDescription}
                imageUrl={project.thumbnail}
                tags={project.skills.slice(0, 4)}
                featured={project.featured}
                jobMeta={getJobMeta(project)}
                linkUrl={`/projects/${project.id}`}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No featured projects available at the moment.</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <Button className="btn-primary" href="/projects">
            View All Projects
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ProjectsView;
