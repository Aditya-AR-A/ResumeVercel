import React from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { loadJson } from '@/utils/loadJson'
import Card from '@/components/Card'
import Section from '@/components/Section'
import Button from '@/components/Button'
import SkillTag from '@/components/SkillTag';
import JobCard from '@/components/JobCard';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

export default async function Home() {
  // Load data from JSON files
  const introData: IntroData = loadJson('intro.json')
  const projects: Project[] = loadJson('projects_new.json')
  const jobs: Job[] = loadJson('jobs.json')
  const certificates: Certificate[] = loadJson('certificates.json')

  // Handle scroll animation in client component
  const ScrollBasedContent = dynamic(() => import('@/components/ScrollBasedContent'), { ssr: false })

  return (
    <div className="min-h-screen">
      {/* Scroll-based sequential content system */}
      <ScrollBasedContent 
        introData={introData}
        projects={projects}
        jobs={jobs}
        certificates={certificates}
      />
    </div>
  )
}
