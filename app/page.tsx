import React from 'react'
import Image from 'next/image'
import { loadJson } from '@/utils/loadJson'
import Card from '@/components/Card'
import Section from '@/components/Section'
import Button from '@/components/Button'

interface Project {
  id: string
  name: string
  description: string
  shortDescription: string
  thumbnail?: string
  category: string
  featured: boolean
  skills: string[]
  demoUrl?: string
  githubUrl?: string
}

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
  skills: string[]
}

interface Certificate {
  name: string;
  file: string;
  provider: string;
  field: string;
  skills: string[];
  issueDate: string | null;
  credentialId: string | null;
  description: string;
  featured: boolean;
}

interface IntroData {
  profileImage: {
    src: string
    alt: string
  }
  name: string
  title: string
  about: string
  socialLinks: {
    email: string
    github: string
    linkedin: string
  }
}

export default async function Home() {
  // Load data from JSON files
  const introData: IntroData = loadJson('intro.json')
  const projects: Project[] = loadJson('projects_new.json')
  const jobs: Job[] = loadJson('jobs.json')
  const certificates: Certificate[] = loadJson('certificates.json')

  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)

  // Get featured certificates
  const featuredCertificates = certificates.filter(certificate => certificate.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-20 pb-16 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Image
              src={introData.profileImage.src}
              alt={introData.profileImage.alt}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full mx-auto mb-8 shadow-lg"
              priority
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 heading-gradient">
              {introData.name}
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              {introData.title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {introData.about}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn-primary" href="#projects">
                View Projects
              </Button>
              <Button className="btn-secondary" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Projects Section */}
      <Section id="projects" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            ))}z
          </div>
          <div className="text-center mt-12">
            <Button className="btn-primary" href="/projects">
              View All Projects
            </Button>
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section id="experience" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
            Professional Experience
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {jobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    {job.companyLogo && (
                      <Image
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {job.company} • {job.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {job.startDate} - {job.isCurrent ? 'Present' : job.endDate}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="btn-primary" href="/experience">
              View All Experience
            </Button>
          </div>
        </div>
      </Section>

      {/* Featured Certificates Section */}
      <Section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCertificates.map(certificate => (
              <Card
                key={certificate.name}
                title={certificate.name}
                description={certificate.description}
                imageUrl={`/certificates/${certificate.file}`}
              />
            ))}
          </div>
          <Button className="mt-8" href="/certificates">
            View All Certificates
          </Button>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 heading-gradient">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and collaborations. 
            Feel free to reach out if you&apos;d like to discuss projects, job opportunities, or just chat about technology!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="btn-primary" href={`mailto:${introData.socialLinks.email}`}>
              Send Email
            </Button>
            <Button className="btn-secondary" href={introData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </Button>
            <Button className="btn-secondary" href={introData.socialLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
