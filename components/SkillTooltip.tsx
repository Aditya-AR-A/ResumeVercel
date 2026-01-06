"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { SkillTooltipProps, Project, Job, Certificate } from '@/types/interfaces';
import SkillTooltipContent from './SkillTooltipContent';
import Tooltip from './Tooltip';
import { dataApi } from '@/utils/api';

type RelatedData = {
  projects: Project[]
  jobs: Job[]
  certificates: Certificate[]
}

export default function SkillTooltip({
  skill,
  level = 'intermediate',
  children
}: Pick<SkillTooltipProps, 'skill' | 'level' | 'children'>) {
  const [isVisible, setIsVisible] = useState(false)
  const [data, setData] = useState<RelatedData>({ projects: [], jobs: [], certificates: [] })
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (!isVisible || hasFetched) {
      return
    }

    let isMounted = true

    const fetchData = async () => {
      try {
        const [projectsResponse, jobsResponse, certificatesResponse] = await Promise.all([
          dataApi.getProjects().catch(() => []),
          dataApi.getJobs().catch(() => []),
          dataApi.getCertificates().catch(() => [])
        ])

        if (!isMounted) {
          return
        }

        setData({
          projects: Array.isArray(projectsResponse) ? projectsResponse : [],
          jobs: Array.isArray(jobsResponse) ? jobsResponse : [],
          certificates: Array.isArray(certificatesResponse) ? certificatesResponse : []
        })
        setHasFetched(true)
      } catch (error) {
        console.error('SkillTooltip: failed to load related data', error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [isVisible, hasFetched])

  const relatedProjects = useMemo(
    () => data.projects.filter((project) => project.skills.includes(skill)),
    [data.projects, skill]
  )

  const relatedJobs = useMemo(
    () =>
      data.jobs
        .filter((job) => job.skills.includes(skill))
        .map((job) => ({ ...job, isCurrent: job.isCurrent ?? false })),
    [data.jobs, skill]
  )

  const relatedCertificates = useMemo(
    () => data.certificates.filter((certificate) => certificate.skills.includes(skill)),
    [data.certificates, skill]
  )

  const getLevelColor = () => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'advanced':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelBadge = () => {
    const levelColors = {
      beginner: 'bg-yellow-500',
      intermediate: 'bg-blue-500',
      advanced: 'bg-green-500',
      expert: 'bg-purple-500'
    } as const

    return (
      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${levelColors[level]}`} />
    )
  }

  const trigger = (
    <button
      type="button"
      className={`skill-tag cursor-help ${getLevelColor()}`}
      aria-describedby={`skill-${skill.replace(/\s+/g, '-')}-tooltip`}
    >
      {getLevelBadge()}
      {skill}
    </button>
  )

  return (
    <Tooltip
      content={
        <div id={`skill-${skill.replace(/\s+/g, '-')}-tooltip`}>
          <SkillTooltipContent
            projects={relatedProjects}
            jobs={relatedJobs}
            certificates={relatedCertificates}
          />
        </div>
      }
      placement="top"
      onOpenChange={(o) => setIsVisible(o)}
      open={isVisible}
    >
      {children || trigger}
    </Tooltip>
  )
}
