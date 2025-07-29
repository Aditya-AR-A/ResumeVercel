'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';
import { Job } from '@/types/jobs';
import { Project, isValidProject } from '@/types/projects';
import { formatDate } from '@/utils/dateUtils';

// Robust company logo image with fallback to /default.png
function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <Image
        src={"/default.png"}
        alt={alt}
        width={64}
        height={64}
        className={styles.logo}
        unoptimized
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={styles.logo}
      onError={() => setError(true)}
      unoptimized={src.startsWith('http')}
    />
  );
}

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export function JobCard({ job, featured = false }: JobCardProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      if (!job.projectIds?.length) return;
      try {
        const mod = await import("@/data/projects.json");
        const allProjects = mod.default || mod;
        const jobProjects = (allProjects as unknown[])
          .filter(isValidProject)
          .filter((p) => job.projectIds?.includes(p.id));
        setProjects(jobProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      }
    }
    
    loadProjects();
  }, [job.projectIds]);

  const {
    company,
    companyLogo,
    title,
    startDate,
    endDate,
    isCurrent,
    description,
    responsibilities,
    achievements,
    skills,
    links,
    documents,
    images
  } = job;

  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.header}>
        {companyLogo && (
          <div className={styles.logoContainer}>
            <LogoImage src={companyLogo} alt={`${company} logo`} />
          </div>
        )}
        <div className={styles.titleInfo}>
          <div className={styles.company}>{company}</div>
          <div className={styles.title}>{title}</div>
          <div className={styles.duration}>
            {formatDate(startDate)} - {isCurrent ? (
              <>
                Present
                <span className={styles.currentBadge}>Current</span>
              </>
            ) : endDate ? (
              formatDate(endDate)
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.description}>{description}</div>

      {responsibilities && responsibilities.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Key Responsibilities</h4>
          <ul className={styles.list}>
            {responsibilities.map((responsibility, index) => (
              <li key={index} className={styles.listItem}>
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Key Achievements</h4>
          <ul className={styles.list}>
            {achievements.map((achievement, index) => (
              <li key={index} className={styles.listItem}>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Skills & Technologies</h4>
          <div className={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Related Projects</h4>
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={styles.project}
              >
                <div className={styles.projectTitle}>{project.name}</div>
                <div className={styles.projectDescription}>
                  {project.shortDescription || project.description}
                </div>
                <div className={styles.projectSkills}>
                  {project.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.projectSkill}>
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 3 && (
                    <span className={styles.projectSkill}>
                      +{project.skills.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {images && images.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Media</h4>
          <div className={styles.mediaGrid}>
            {images.map((image, index) => (
              <div key={index} className={styles.mediaItem}>
                <Image
                  src={image.file}
                  alt={image.name}
                  width={400}
                  height={225}
                  className={styles.mediaImage}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {documents && documents.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Documents</h4>
          <div className={styles.documentsList}>
            {documents.map((doc, index) => (
              <Link
                key={index}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {doc.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {links && (
        <div className={styles.linksList}>
          {links.company && (
            <Link
              href={links.company}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Company Website
            </Link>
          )}
          {links.linkedin && (
            <Link
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              LinkedIn
            </Link>
          )}
          {links.portfolio && (
            <Link
              href={links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Portfolio
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default JobCard;
