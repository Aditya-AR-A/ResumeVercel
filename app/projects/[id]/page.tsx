import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetailView from '@/components/DetailView/ProjectDetailView'
import { dataApi } from '@/utils/api'
import type { Project, Job } from '@/types/interfaces'

interface Props {
  params: { id: string }
}

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('ProjectDetailPage: failed to fetch projects from API', error)
    return []
  }
}

async function loadProject(id: string): Promise<Project | null> {
  try {
    const project = await dataApi.getProject(id)
    return project as Project
  } catch (error) {
    console.error(`ProjectDetailPage: failed to fetch project ${id}`, error)
    return null
  }
}

async function loadJob(id: string): Promise<Job | null> {
  try {
    const job = await dataApi.getJob(id)
    return job as Job
  } catch (error) {
    console.error(`ProjectDetailPage: failed to fetch related job ${id}`, error)
    return null
  }
}

export async function generateStaticParams() {
  const projects = await loadProjects()
  return projects.map((project) => ({ id: project.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await loadProject(params.id)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.name} | Projects`,
    description: project.shortDescription || project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await loadProject(params.id)

  if (!project) {
    notFound()
    return null
  }

  let relatedJob: Job | undefined

  const jobLookupIds = [project.jobId, ...(project.relatedJobIds ?? [])].filter(Boolean) as string[]

  for (const jobId of jobLookupIds) {
    const job = await loadJob(jobId)
    if (job) {
      relatedJob = job
      break
    }
  }

  return <ProjectDetailView project={project} relatedJob={relatedJob} />
}
