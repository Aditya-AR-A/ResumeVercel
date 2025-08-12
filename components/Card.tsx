import React from 'react';
import Image from 'next/image';
import { CardProps } from '@/types/interfaces';
import SkillTag from './SkillTag';

export default function Card({
  title,
  description,
  imageUrl,
  linkUrl,
  tags,
  featured,
  children,
  projects,
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        featured ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {featured && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Featured
          </span>
        </div>
      )}
      {imageUrl && (
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={160}
            className="w-full md:w-64 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            {description && <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>}
          </div>
        </div>
      )}
      {!imageUrl && (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          {description && <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>}
        </>
      )}
      {tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <SkillTag key={tag} skill={tag} />
          ))}
        </div>
      )}
      {projects && projects.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Related Projects ({projects.length})
          </h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{project.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.skills.slice(0, 3).map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                  {project.skills.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                      +{project.skills.length - 3}
                    </span>
                  )}
                </div>
                {(project.demoUrl || project.githubUrl) && (
                  <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {children}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
        >
          Learn more →
        </a>
      )}
    </div>
  );
}
