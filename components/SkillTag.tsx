"use client";

import projectsData from '@/data/projects_new.json';
import jobsData from '@/data/jobs.json';
import certificatesData from '@/data/certificates.json';

import React from 'react';

type SkillTagProps = {
  skill: string;
  onClick?: () => void;
  className?: string;
};


const SkillTag: React.FC<SkillTagProps> = ({ skill, onClick, className }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipRef = React.useRef<HTMLSpanElement>(null);

  // Toggle tooltip on click
  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    setShowTooltip((prev) => !prev);
  };

  // Close tooltip if clicked outside
  React.useEffect(() => {
    if (!showTooltip) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);
  // Find related items
  const relatedProjects = Array.isArray(projectsData)
    ? projectsData.filter((project) => Array.isArray(project.skills) && project.skills.includes(skill))
    : [];
  const relatedJobs = Array.isArray(jobsData)
    ? jobsData.filter((job) => Array.isArray(job.skills) && job.skills.includes(skill))
    : [];
  const relatedCertificates = Array.isArray(certificatesData)
    ? certificatesData.filter((certificate) => Array.isArray(certificate.skills) && certificate.skills.includes(skill))
    : [];

  return (
    <span
      ref={tooltipRef}
      className={`relative inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition ${className}`}
      onClick={handleTagClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {skill}
      {showTooltip && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 max-w-xs px-4 py-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20 whitespace-normal text-left border border-blue-500 animate-fade-in">
          <div className="font-bold text-base mb-2 text-blue-300">{skill}</div>
          {relatedProjects.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-200">Projects:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedProjects.map((project) => (
                  <li key={project.id} className="mb-1">{project.name}</li>
                ))}
              </ul>
            </div>
          )}
          {relatedJobs.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-200">Jobs:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedJobs.map((job) => (
                  <li key={job.id} className="mb-1">{job.title} <span className="text-gray-400">at</span> {job.company}</li>
                ))}
              </ul>
            </div>
          )}
          {relatedCertificates.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold text-blue-200">Certificates:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedCertificates.map((certificate) => (
                  <li key={certificate.name} className="mb-1">{certificate.name} <span className="text-gray-400">by</span> {certificate.provider}</li>
                ))}
              </ul>
            </div>
          )}
          {relatedProjects.length === 0 && relatedJobs.length === 0 && relatedCertificates.length === 0 && (
            <div className="text-gray-400">No related items found.</div>
          )}
        </span>
      )}
    </span>
  );
};

export default SkillTag;
