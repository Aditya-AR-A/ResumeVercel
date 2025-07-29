'use client';
import { Certificate } from '@/types/certificates';
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

interface CertificateCardProps {
  cert: Certificate;
  featured?: boolean;
}

export function CertificateCard({ cert, featured }: CertificateCardProps) {
  // Determine thumbnail filename
  const { thumbPath } = useMemo(() => {
    let thumbnail = cert.thumbnail;
    if (!thumbnail && cert.file) {
      thumbnail = cert.file.replace(/\.(pdf|mhtml)$/i, ".png");
    }
    return {
      thumbPath: `/certificate_thumbnails/${encodeURIComponent(thumbnail ?? "fallback.png")}`,
      fallback: "/certificate_thumbnails/fallback.png"
    };
  }, [cert.thumbnail, cert.file]);

  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.imageContainer}>
        <LogoImage
          src={thumbPath}
          alt={cert.name + " certificate thumbnail"}
          width={featured ? 961 : 220}
          height={featured ? 600 : 150}
          className={`${styles.image} ${featured ? styles.featured : ''}`}
        />
      </div>
      <div className={styles.title}>
        {cert.name}
      </div>
      <div className={styles.field}>
        {cert.field || <span className={styles.fieldPlaceholder}>Field</span>}
      </div>
      <div className={styles.skillsContainer}>
        {cert.skills.map((skill: string) => (
          <span key={skill} className={styles.skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className={styles.provider}>
        {cert.provider}
      </div>
      <a
        href={`/Cerificates/${encodeURIComponent(cert.file)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.viewPdfLink}
      >
        View PDF
      </a>
      {cert.issueDate && (
        <div className={styles.issueDate}>
          Issued: {cert.issueDate}
        </div>
      )}
      {cert.credentialId && (
        <div className={styles.credentialId}>
          ID: {cert.credentialId}
        </div>
      )}
      {cert.description && (
        <div className={styles.description}>
          {cert.description}
        </div>
      )}
    </div>
  );
}
