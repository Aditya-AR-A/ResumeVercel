import React from 'react';
import Image from 'next/image';
import SkillTag from './SkillTag';
import { Project } from '@/types/interfaces';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities?: string[];
  skills: string[];
  featured?: boolean;
  projects?: Project[];
  compact?: boolean; // For different layouts
}

export default function JobCard({
  title,
  company,
  companyLogo,
  position,
  location,
  startDate,
  endDate,
  isCurrent,
  description,
  responsibilities,
  skills,
  featured,
  projects,
  compact = false
}: JobCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDuration = () => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate || '');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.round(diffDays / 30);
    
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border ${
        featured ? 'border-blue-500' : 'border-transparent'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {companyLogo && (
              <Image
                src={companyLogo}
                alt={`${company} logo`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-600"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                {company}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {formatDate(startDate)} - {isCurrent ? 'Present' : formatDate(endDate || '')}
            </div>
            <div className="text-xs text-gray-400 mt-1">{getDuration()}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.slice(0, 4).map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              +{skills.length - 4} more
            </span>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border ${
      featured ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header with company info and duration */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {companyLogo && (
            <Image
              src={companyLogo}
              alt={`${company} logo`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-contain bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-600 shadow-sm"
            />
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-1">
              {company}
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-sm">{location}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm">{position}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg">
          <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            {formatDate(startDate)} - {isCurrent ? 'Present' : formatDate(endDate || '')}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            {getDuration()}
          </div>
          {isCurrent && (
            <div className="inline-flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Current</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Responsibilities */}
      {responsibilities && responsibilities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Key Responsibilities
          </h4>
          <ul className="space-y-2">
            {responsibilities.slice(0, 3).map((responsibility, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {responsibility}
              </li>
            ))}
            {responsibilities.length > 3 && (
              <li className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                +{responsibilities.length - 3} more responsibilities
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Technologies & Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
        </div>
      </div>

      {/* Related Projects */}
      {projects && projects.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Related Projects ({projects.length})
          </h4>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h5>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{project.skills.length - 4}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <span className="mr-1">🔗</span> Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:underline flex items-center"
                    >
                      <span className="mr-1">📁</span> GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
