'use client';
import { Project } from '@/types/projects';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useMemo } from 'react';

// Robust logo/thumbnail image with fallback to /default.png
function LogoImage({ src, alt, width = 64, height = 64, className = '' }: { src: string; alt: string; width?: number; height?: number; className?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <Image
        src={'/default.png'}
        alt={alt}
        width={width}
        height={height}
        className={className}
        unoptimized
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      unoptimized={src.startsWith('http')}
    />
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  // Determine thumbnail path
  const { thumbPath } = useMemo(() => {
    let thumbnail = project.thumbnail;
    if (!thumbnail && project.id) {
      thumbnail = `${project.id}-thumbnail.jpg`;
    }
    return {
      thumbPath: `/projects/${encodeURIComponent(thumbnail ?? "fallback.jpg")}`,
      fallback: "/projects/fallback.jpg"
    };
  }, [project.thumbnail, project.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.imageContainer}>
        <LogoImage
          src={thumbPath}
          alt={project.name + " project thumbnail"}
          width={featured ? 400 : 280}
          height={featured ? 250 : 180}
          className={`${styles.image} ${featured ? styles.featured : ''}`}
        />
        <div className={styles.statusBadge}>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.title}>
          {project.name}
        </div>
        
        <div className={styles.category}>
          {project.category}
        </div>
        
        <div className={styles.description}>
          {project.shortDescription || project.description}
        </div>
        
        <div className={styles.skillsContainer}>
          {project.skills.slice(0, 6).map((skill: string) => (
            <span key={skill} className={styles.skill}>
              {skill}
            </span>
          ))}
          {project.skills.length > 6 && (
            <span className={styles.skillMore}>
              +{project.skills.length - 6} more
            </span>
          )}
        </div>
        
        <div className={styles.dateRange}>
          {formatDate(project.startDate)}
          {project.endDate && ` - ${formatDate(project.endDate)}`}
          {project.status === 'active' && !project.endDate && ' - Present'}
        </div>
        
        <div className={styles.links}>
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Live Demo
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Demo
            </a>
          )}
        </div>
        
        {project.model?.metrics && (
          <div className={styles.metrics}>
            {Object.entries(project.model.metrics).slice(0, 2).map(([key, value]) => (
              <div key={key} className={styles.metric}>
                <span className={styles.metricLabel}>{key}:</span>
                <span className={styles.metricValue}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
