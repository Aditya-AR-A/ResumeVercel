import React from 'react'
import Image from 'next/image'
import { loadJson } from '@/utils/loadJson'
import Section from '@/components/Section'
import Card from '@/components/Card'
import { Project } from '@/types/interfaces'

interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  position: string
  location: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  responsibilities?: string[]
  skills: string[]
  featured?: boolean
}

export default async function ExperiencePage() {
  const jobs: Job[] = loadJson('jobs.json')
  const projects: Project[] = loadJson('projects_new.json')
  
  // Sort jobs by startDate descending (most recent first)
  const sortedJobs = jobs.slice().sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    return bDate - aDate;
  });

  // Function to get related projects for a job
  const getRelatedProjects = (jobId: string) => {
    return projects.filter(project => (project as any).jobId === jobId);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <Section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 heading-gradient">
            Professional Experience
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            My journey in data science, machine learning, and software development.
          </p>
        </div>
      </Section>

      {/* Experience Timeline */}
      <Section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedJobs.map((job) => (
              <Card
                key={job.id}
                title={job.title}
                description={`${job.company} • ${job.location} • ${job.startDate} - ${job.isCurrent ? 'Present' : job.endDate}`}
                imageUrl={job.companyLogo}
                tags={job.skills}
                featured={job.featured}
                projects={getRelatedProjects(job.id)}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 heading-gradient">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Contact Me
            </a>
            <a
              href="/"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
