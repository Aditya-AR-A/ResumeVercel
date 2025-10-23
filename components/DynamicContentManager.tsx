"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceView from './views/ExperienceView';
import ProjectsView from './views/ProjectsView';
import CertificatesView from './views/CertificatesView';
import AboutView from './views/AboutView';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

export type ViewType = 'home' | 'about' | 'experience' | 'projects' | 'certificates';

interface DynamicContentManagerProps {
  currentView: ViewType;
  introData: IntroData;
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
}

const DynamicContentManager: React.FC<DynamicContentManagerProps> = ({
  currentView,
  introData,
  projects,
  jobs,
  certificates
}) => {
  // Move the function logic into the client component
  const getRelatedProjects = (jobId: string) => {
    return projects.filter(project => project.jobId === jobId || project.relatedJobIds?.includes(jobId));
  };
  const renderView = () => {
    switch (currentView) {
      case 'about':
        return (
          <AboutView
            key="about"
            introData={introData}
            projects={projects}
            jobs={jobs}
            certificates={certificates}
          />
        );
      case 'experience':
        return <ExperienceView key="experience" jobs={jobs} getRelatedProjects={getRelatedProjects} />;
      case 'projects':
        return <ProjectsView key="projects" projects={projects} jobs={jobs} />;
      case 'certificates':
        return <CertificatesView key="certificates" certificates={certificates} />;
      case 'home':
      default:
        return (
          <div key="home" className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold heading-gradient">Welcome to My Portfolio</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                Use the command interface above to explore my work, experience, and skills. 
                Try commands like &quot;show projects&quot;, &quot;show experience&quot;, or &quot;about me&quot;.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-gray-600 dark:text-gray-400">
                <div>💼 &quot;show experience&quot;</div>
                <div>🚀 &quot;show projects&quot;</div>
                <div>📜 &quot;show certificates&quot;</div>
                <div>👋 &quot;about me&quot;</div>
                <div>📧 &quot;contact me&quot;</div>
                <div>🏠 &quot;go home&quot;</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[60vh]"
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicContentManager;
