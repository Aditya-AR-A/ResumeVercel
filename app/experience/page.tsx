import React from 'react'
import Image from 'next/image'
import { loadJson } from '@/utils/loadJson'
import Section from '@/components/Section'

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
}

export default async function ExperiencePage() {
  const jobs: Job[] = loadJson('jobs.json')

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
          <div className="max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <div key={job.id} className="relative">
                {/* Timeline line */}
                {index !== jobs.length - 1 && (
                  <div className="absolute left-8 top-24 w-px h-full bg-gray-300 dark:bg-gray-600 z-0"></div>
                )}
                
                {/* Job Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 ml-16 transition-all duration-300 hover:shadow-xl">
                  {/* Timeline dot */}
                  <div className="absolute -left-20 top-8 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 z-10"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      {job.companyLogo && (
                        <Image
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-lg object-contain"
                        />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                          {job.company}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {job.location} • {job.position}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {job.startDate} - {job.isCurrent ? 'Present' : job.endDate}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">
                    {job.description}
                  </p>
                  
                  {job.responsibilities && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {job.responsibilities.slice(0, 5).map((responsibility, idx) => (
                          <li key={idx} className="text-sm leading-relaxed">{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
