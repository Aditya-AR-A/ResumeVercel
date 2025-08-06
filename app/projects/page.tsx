import React from 'react'
import { loadJson } from '@/utils/loadJson'
import Card from '@/components/Card'
import Section from '@/components/Section'
import { Project } from '@/types/interfaces'

export default async function ProjectsPage() {
  const projects: Project[] = loadJson('projects_new.json')

  // Group projects by category
  const projectsByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = []
    }
    acc[project.category].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <Section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 heading-gradient">
            All Projects
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore all the projects I have worked on, categorized for your convenience.
          </p>
        </div>
      </Section>

      {/* Projects by Category */}
      {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
        <Section key={category} className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 heading-gradient">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProjects.map((project) => (
                <Card
                  key={project.id}
                  title={project.name}
                  description={project.shortDescription}
                  imageUrl={project.thumbnail}
                  tags={project.skills.slice(0, 4)}
                  featured={project.featured}
                  linkUrl={project.demoUrl || project.githubUrl}
                />
              ))}
            </div>
          </div>
        </Section>
      ))}

      {/* Call to Action */}
      <Section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 heading-gradient">
            Interested in Collaborating?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects and opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Get In Touch
            </a>
            <a
              href="/"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
