import React from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { loadJson } from '@/utils/loadJson'
import Card from '@/components/Card'
import Section from '@/components/Section'
import Button from '@/components/Button'
import SkillTag from '@/components/SkillTag';
import JobCard from '@/components/JobCard';
import CommandInterface from '@/components/CommandInterface';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

export default async function Home() {
  // Load data from JSON files
  const introData: IntroData = loadJson('intro.json')
  const projects: Project[] = loadJson('projects_new.json')
  const jobs: Job[] = loadJson('jobs.json')
  const certificates: Certificate[] = loadJson('certificates.json')

  // Handle scroll animation in client component
  const MainContent = dynamic(() => import('@/components/MainContent'), { ssr: false })

  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)

  // Get featured jobs
  const featuredJobs = jobs.filter(job => job.featured)

  // Get featured certificates
  const featuredCertificates = certificates.filter(certificate => certificate.featured);

  // Function to get related projects for a job
  const getRelatedProjects = (jobId: string) => {
    return projects.filter(project => project.jobId === jobId);
  };

  return (
    <div className="min-h-screen">
      {/* Animated hero + collapsing chat / navbar controller */}
      <MainContent />

      {/* Hero Section - 2/3 of viewport */}
      <Section className="h-[75vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                      Welcome to my portfolio
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Hi, I&apos;m{' '}
                    <span className="heading-gradient">{introData.name}</span>
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                    {introData.title}
                  </h2>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Certificates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">20+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">3+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">AI</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Specialist</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button className="btn-primary" href="#experience">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      View My Work
                    </span>
                  </Button>
                </div>
              </div>

              {/* Right Column - Profile Image */}
              <div className="relative">
                <Image
                  src="/default.png"
                  alt="Profile Picture"
                  width={300}
                  height={300}
                  className="rounded-full shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

      </Section>

      {/* Interactive Section - 1/3 of viewport */}
      <Section className="h-[30vh] flex items-center bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Column - Description */}
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold mb-4">Let&apos;s Explore Together</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  I&apos;m a passionate <strong>AI and Python Developer</strong> with expertise in building 
                  intelligent systems that solve real-world problems. Currently working at Addmin Web World, 
                  I specialize in integrating <strong>LLMs with SIP call agents</strong> and developing 
                  AI-driven automation solutions.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Type a command to explore my work, skills, or start a conversation!
                </p>
              </div>

              {/* Right Column - Input Bar */}
              <CommandInterface />
            </div>
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section id="experience" className="py-16">
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

      {/* Featured Projects Section */}
      <Section id="projects" className="py-16 bg-gray-50 dark:bg-gray-900">
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

      {/* Featured Certificates Section */}
      <Section id="certificates" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Certificates</h2>
          <div className="space-y-12">
            {featuredCertificates.map(certificate => (
              <div key={certificate.name} className="relative w-full">
                <Image
                  src={`/certificate_thumbnails/${certificate.file.replace('.pdf', '.png')}`}
                  alt={certificate.name}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-lg font-semibold px-4">{certificate.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {certificate.skills && certificate.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>
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
