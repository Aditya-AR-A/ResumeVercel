import React, { useState } from 'react'
import { SkillTooltipProps } from '@/types/interfaces';
import SkillTooltipContent from './SkillTooltipContent';
import projectsData from '@/data/projects.json';
import jobsData from '@/data/jobs.json';
import certificatesData from '@/data/certificates.json';

export default function SkillTooltip({
  skill,
  level = 'intermediate',
  children
}: Pick<SkillTooltipProps, 'skill' | 'level' | 'children'>) {
  const [isVisible, setIsVisible] = useState(false)

  const relatedProjects = projectsData.filter((project) => project.skills.includes(skill));
  const relatedJobs = jobsData
    .filter((job) => job.skills.includes(skill))
    .map((job) => ({ ...job, isCurrent: job.isCurrent ?? false }));
  const relatedCertificates = certificatesData.filter((certificate) => certificate.skills.includes(skill));

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

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <span className={`skill-tag cursor-help ${getLevelColor()}`}>
          {getLevelBadge()}
          {skill}
        </span>
      )}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <SkillTooltipContent 
            projects={relatedProjects} 
            jobs={relatedJobs} 
            certificates={relatedCertificates} 
          />
        </div>
      )}
    </div>
  )
}
