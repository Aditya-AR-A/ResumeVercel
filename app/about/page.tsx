import PageHero from '@/components/PageHero'
import Section from '@/components/Section'
import AboutView from '@/components/views/AboutView'
import { dataApi } from '@/utils/api'
import type { IntroData, Project, Job, Certificate } from '@/types/interfaces'

async function loadIntro(): Promise<IntroData | null> {
  try {
    const data = await dataApi.getIntro()
    return data as IntroData
  } catch {
    return null
  }
}

function defaultIntro(): IntroData {
  return {
    profileImage: { src: '', alt: '' },
    name: '',
    title: '',
    about: '',
    socialLinks: { email: '', github: '', linkedin: '' },
  }
}

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function loadJobs(): Promise<Job[]> {
  try {
    const data = await dataApi.getJobs()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function loadCertificates(): Promise<Certificate[]> {
  try {
    const data = await dataApi.getCertificates()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function AboutPage() {
  const [introData, projects, jobs, certificates] = await Promise.all([
    loadIntro(),
    loadProjects(),
    loadJobs(),
    loadCertificates(),
  ])

  return (
    <div className="space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="About"
        title="About Me"
        description="Background, values, and how I approach building reliable, thoughtful software and AI systems."
        align="left"
      />

      <Section background="default" containerClassName="max-w-5xl">
        <AboutView introData={introData || defaultIntro()} projects={projects} jobs={jobs} certificates={certificates} />
      </Section>
    </div>
  )
}

