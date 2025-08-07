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
      className={`bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 transition border ${
        featured ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-gray-700 dark:text-gray-300 mb-2">{description}</p>}
      {tags && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <SkillTag key={tag} skill={tag} />
          ))}
        </div>
      )}
      {projects && projects.length > 0 && (
        <div className="mt-4 mb-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Related Projects:</h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                {(project.demoUrl || project.githubUrl) && (
                  <div className="mt-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mr-3"
                      >
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
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
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Learn more
        </a>
      )}
    </div>
  );
}
