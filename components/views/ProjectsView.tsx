"use client";

import React from 'react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Project } from '@/types/interfaces';

interface ProjectsViewProps {
  projects: Project[];
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);

  return (
    <Section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
          Featured Projects
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {featuredProjects.map((project) => (
            <Card
              key={project.id}
              title={project.name}
              description={project.shortDescription}
              imageUrl={project.thumbnail}
              tags={project.skills.slice(0, 4)}
              featured={project.featured}
              linkUrl={project.demoUrl || project.githubUrl}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button className="btn-primary" href="/projects">
            View All Projects
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ProjectsView;
