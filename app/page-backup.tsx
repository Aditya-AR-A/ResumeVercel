import React from 'react'
import Image from 'next/image'
import Card from '@/components/Card'
import Section from '@/components/Section'
import Button from '@/components/Button'
import SkillTag from '@/components/SkillTag';
import JobCard from '@/components/JobCard';
import { dataApi } from '@/utils/api'
import type { Project, Job, Certificate, IntroData } from '@/types/interfaces';
import { getAssetUrl } from '@/utils/assets';

async function loadIntro(): Promise<IntroData | null> {
  try {
    const data = await dataApi.getIntro()
    return data as IntroData
  } catch (error) {
    console.error('BackupHome: failed to fetch intro data', error)
    return null
  }
}

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('BackupHome: failed to fetch projects data', error)
    return []
  }
}

async function loadJobs(): Promise<Job[]> {
  try {
    const data = await dataApi.getJobs()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('BackupHome: failed to fetch jobs data', error)
    return []
  }
}

async function loadCertificates(): Promise<Certificate[]> {
  try {
    const data = await dataApi.getCertificates()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('BackupHome: failed to fetch certificates data', error)
    return []
  }
}

export default async function Home() {
  const [introData, projects, jobs, certificates] = await Promise.all([
    loadIntro(),
    loadProjects(),
    loadJobs(),
    loadCertificates()
  ])

  const intro = introData || {
    name: 'Aditya',
    title: 'AI & Python Developer',
    profileImage: { src: 'https://avatars.githubusercontent.com/u/126697615?v=4', alt: 'Profile image' },
    about: '',
    socialLinks: {
      email: 'aditya@example.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  } as IntroData

  const resumeLink = getAssetUrl('resume.pdf');

  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)

  // Get featured jobs
  const featuredJobs = jobs.filter(job => job.featured)

  // Get featured certificates
  const featuredCertificates = certificates.filter(certificate => certificate.featured);

  // Function to get related projects for a job
  const getRelatedProjects = (jobId: string) => {
    return projects.filter(project => project.jobId === jobId || project.relatedJobIds?.includes(jobId));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-8 pb-16">
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
                    <span className="heading-gradient">
                      {intro.name}
                    </span>
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                    {intro.title}
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    I&apos;m a passionate <strong>AI and Python Developer</strong> with expertise in building 
                    intelligent systems that solve real-world problems. Currently working at Addmin Web World, 
                    I specialize in integrating <strong>LLMs with SIP call agents</strong> and developing 
                    AI-driven automation solutions.
                  </p>
                  <p>
                    From creating <strong>VS Code extensions</strong> to implementing advanced 
                    <strong>machine learning models</strong>, I love transforming complex data into 
                    actionable insights and building tools that make developers&apos; lives easier.
                  </p>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
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
                  <Button className="btn-secondary" href={resumeLink} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resume
                    </span>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 pt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Connect with me:</span>
                  <div className="flex gap-3">
                    <a
                      href={intro.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors group"
                      title="GitHub"
                    >
                      <svg className="w-4 h-4 text-white dark:text-gray-900 group-hover:text-gray-200 dark:group-hover:text-gray-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href={intro.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors group"
                      title="LinkedIn"
                    >
                      <svg className="w-4 h-4 text-white group-hover:text-gray-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a
                      href={`mailto:${intro.socialLinks.email}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors group"
                      title="Email"
                    >
                      <svg className="w-4 h-4 text-white group-hover:text-gray-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Image & Skills */}
              <div className="space-y-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                    <Image
                      src={intro.profileImage?.src || 'https://avatars.githubusercontent.com/u/126697615?v=4'}
                      alt={intro.profileImage?.alt || 'Profile image'}
                      width={300}
                      height={300}
                      className="w-full max-w-xs mx-auto rounded-2xl shadow-lg"
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Available for work
                    </div>
                  </div>
                </div>

                {/* Key Technologies */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Core Technologies
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Python', 'LLMs', 'TypeScript', 'React', 'FastAPI', 'TensorFlow', 'VS Code Extensions', 'SIP Integration'].map((tech) => (
                      <div key={tech} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                href={`/experience/${job.id}`}
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
                linkUrl={`/projects/${project.id}`}
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
            {featuredCertificates.map(certificate => {
              const thumbnailUrl = certificate.file
                ? getAssetUrl('certificate_thumbnails', certificate.file.replace('.pdf', '.png'))
                : undefined

              return (
                <div key={certificate.name} className="relative w-full">
                  {thumbnailUrl && (
                    <Image
                      src={thumbnailUrl}
                      alt={certificate.name}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain rounded-lg shadow-lg"
                      priority
                    />
                  )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-lg font-semibold px-4">{certificate.description}</p>
                </div>              
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {certificate.skills && certificate.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
                </div>
              )
            })}
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
            <Button className="btn-primary" href={`mailto:${intro.socialLinks.email}`}>
              Send Email
            </Button>
            <Button className="btn-secondary" href={intro.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </Button>
            <Button className="btn-secondary" href={intro.socialLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
