"use client";

import React from 'react';
import Section from '@/components/Section';
import JobCard from '@/components/JobCard';
import Button from '@/components/Button';
import { Job, Project } from '@/types/interfaces';

interface ExperienceViewProps {
  jobs: Job[];
  getRelatedProjects: (jobId: string) => Project[];
}

const ExperienceView: React.FC<ExperienceViewProps> = ({ jobs, getRelatedProjects }) => {
  const featuredJobs = jobs.filter(job => job.featured);

  return (
    <Section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
          Professional Experience
        </h2>
        <div className="max-w-5xl mx-auto space-y-8">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              projects={getRelatedProjects(job.id)}
              compact={false}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button className="btn-primary" href="/experience">
            View All Experience
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ExperienceView;
