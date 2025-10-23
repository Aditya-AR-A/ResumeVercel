import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  href?: string;
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
  projects,
  compact = false,
  href,
}: JobCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getCompanyLogoBackground = (companyName: string) => {
    const company = companyName.toLowerCase();
    
    if (company.includes('planto') || company.includes('coding pro')) {
      return 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20';
    } else if (company.includes('addmin') || company.includes('web world')) {
      return 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20';
    } else if (company.includes('independent') || company.includes('freelance')) {
      return 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20';
    } else {
      return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700';
    }
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

  const compactContent = (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-transparent p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt={`${company} logo`}
                width={48}
                height={48}
                sizes="(max-width: 640px) 12vw, 48px"
                className={`w-12 h-12 rounded-lg object-contain p-2 border border-gray-200 dark:border-gray-600 shadow-sm ${getCompanyLogoBackground(company)}`}
              />
            ) : (
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm ${getCompanyLogoBackground(company)}`}>
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="accent-cert font-semibold">
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

  const fullContent = (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Header with company info and duration */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={`${company} logo`}
              width={64}
              height={64}
              sizes="(max-width: 640px) 16vw, 64px"
              className={`w-16 h-16 rounded-xl object-contain p-3 border border-gray-200 dark:border-gray-600 shadow-sm ${getCompanyLogoBackground(company)}`}
            />
          ) : (
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm ${getCompanyLogoBackground(company)}`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-xl accent-cert font-semibold mb-1">
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
          <div className="text-xs accent-cert mt-1">
            {getDuration()}
          </div>
          {isCurrent && (
            <div className="inline-flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs accent-experience font-medium">Current</span>
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
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                {/* Project Thumbnail */}
                {project.thumbnail && (
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    width={400}
                    height={160}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                {/* Project Header */}
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {project.name}
                  </h5>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {project.category}
                  </span>
                </div>
                
                {/* Project Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {project.shortDescription}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.skills.slice(0, 4).map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                  {project.skills.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      +{project.skills.length - 4} more
                    </span>
                  )}
                </div>
                
                {/* Project Links */}
                <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium accent-cert hover:opacity-80 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Demo
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
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

  const cardContent = compact ? compactContent : fullContent;

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 rounded-xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
