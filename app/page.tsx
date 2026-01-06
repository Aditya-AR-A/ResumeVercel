import React from 'react'
import dynamic from 'next/dynamic'
import { dataApi } from '@/utils/api'
import { Project, Job, Certificate, IntroData, SkillsResponse } from '@/types/interfaces';

export default async function Home() {
  // Load data from backend API with error handling
  let introData: IntroData;
  let projects: Project[] = [];
  let jobs: Job[] = [];
  let certificates: Certificate[] = [];
  let skillsAggregation: SkillsResponse | undefined;

  try {
    console.log('Page: Starting to load intro data...');
    introData = await dataApi.getIntro();
    console.log('Page: Intro data loaded successfully:', introData);
  } catch (error) {
    console.error('Page: Failed to load intro data:', error);
    // Fallback to empty object
    introData = {} as IntroData;
  }

  try {
    console.log('Page: Starting to load projects...');
    const baseProjects = await dataApi.getProjects() || [];
    let newProjects: Project[] = [];
    try {
      newProjects = await dataApi.getNewProjects() || [];
    } catch {}
    const seen = new Set<string>();
    const merged: Project[] = [];
    for (const p of [...baseProjects, ...newProjects]) {
      if (!p || !p.id || seen.has(p.id)) continue;
      seen.add(p.id);
      merged.push(p);
    }
    projects = merged;
    console.log('Page: Projects loaded successfully:', projects.length);
  } catch (error) {
    console.error('Page: Failed to load projects:', error);
  }

  try {
    console.log('Page: Starting to load jobs...');
    jobs = await dataApi.getJobs() || [];
    console.log('Page: Jobs loaded successfully:', jobs.length);
  } catch (error) {
    console.error('Page: Failed to load jobs:', error);
  }

  try {
    console.log('Page: Starting to load certificates...');
    certificates = await dataApi.getCertificates() || [];
    console.log('Page: Certificates loaded successfully:', certificates.length);
  } catch (error) {
    console.error('Page: Failed to load certificates:', error);
  }

  try {
    console.log('Page: Starting to load skills aggregation...');
    skillsAggregation = await dataApi.getSkills();
    console.log('Page: Skills aggregation loaded:', skillsAggregation?.total_unique_skills);
  } catch (error) {
    console.error('Page: Failed to load skills aggregation:', error);
  }

  console.log('Page: All data loading complete', {
    introData: !!introData,
    projects: projects.length,
    jobs: jobs.length,
    certificates: certificates.length
  });

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
        skillsAggregation={skillsAggregation}
      />
    </div>
  )
}
