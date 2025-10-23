"use client";

import React from 'react';
import Section from '@/components/Section';
import JobCard from '@/components/JobCard';
import Button from '@/components/Button';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import { Job, Project } from '@/types/interfaces';

interface ExperienceViewProps {
  jobs: Job[];
  getRelatedProjects: (jobId: string) => Project[];
}

const ExperienceView: React.FC<ExperienceViewProps> = ({ jobs, getRelatedProjects }) => {
  // Ensure jobs is an array and filter featured jobs
  const featuredJobs = Array.isArray(jobs) ? jobs.filter(job => job.featured) : [];

  return (
    <Section className="py-16" containerClassName="max-w-5xl">
      <div className="space-y-10">
        <h2 className="heading-gradient text-4xl font-bold text-center">Professional Experience</h2>
        <ExperienceTimeline jobs={jobs} />
        <div className="space-y-8">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <div key={job.id} id={`job-${job.id}`} className="timeline-card-wrapper transition">
                <JobCard
                  {...job}
                  projects={getRelatedProjects(job.id)}
                  compact={false}
                  href={`/experience/${job.id}`}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No featured jobs available at the moment.</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <Button className="btn-primary" href="/experience">
            View All Experience
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ExperienceView;
