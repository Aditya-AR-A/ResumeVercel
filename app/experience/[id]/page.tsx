import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JobDetailView from '@/components/DetailView/JobDetailView'
import { dataApi } from '@/utils/api'
import type { Job, Project } from '@/types/interfaces'

interface Props {
  params: { id: string }
}

async function loadJobs(): Promise<Job[]> {
  try {
    const data = await dataApi.getJobs()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('JobDetailPage: failed to fetch jobs from API', error)
    return []
  }
}

async function loadJob(id: string): Promise<Job | null> {
  try {
    const job = await dataApi.getJob(id)
    return job as Job
  } catch (error) {
    console.error(`JobDetailPage: failed to fetch job ${id}`, error)
    return null
  }
}

async function loadProjects(): Promise<Project[]> {
  try {
    const data = await dataApi.getProjects()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('JobDetailPage: failed to fetch projects from API', error)
    return []
  }
}

export async function generateStaticParams() {
  const jobs = await loadJobs()
  return jobs.map((job) => ({ id: job.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await loadJob(params.id)

  if (!job) {
    return {
      title: 'Job Not Found',
    }
  }

  return {
    title: `${job.title} at ${job.company} | Experience`,
    description: job.description,
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await loadJob(params.id)

  if (!job) {
    notFound()
    return null
  }

  const projects = await loadProjects()
  const relatedProjects = projects.filter(
    (project) => project.jobId === job.id || project.relatedJobIds?.includes(job.id)
  )

  return <JobDetailView job={job} projects={relatedProjects} />
}
