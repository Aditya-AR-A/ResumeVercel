"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dataApi } from "@/utils/api";
import type { Certificate, Job, Project } from "@/types/interfaces";

type SkillTagProps = {
  skill: string;
  onClick?: () => void;
  className?: string;
};

interface RelatedData {
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
}

let cachedData: RelatedData | null = null;
let loadPromise: Promise<RelatedData> | null = null;

async function fetchRelatedData(): Promise<RelatedData> {
  if (cachedData) {
    return cachedData;
  }

  if (!loadPromise) {
    loadPromise = Promise.all([
      dataApi.getProjects().catch(() => []),
      dataApi.getJobs().catch(() => []),
      dataApi.getCertificates().catch(() => []),
    ])
      .then(([projects, jobs, certificates]) => {
        const parsed: RelatedData = {
          projects: Array.isArray(projects) ? projects : [],
          jobs: Array.isArray(jobs) ? jobs : [],
          certificates: Array.isArray(certificates) ? certificates : [],
        };

        cachedData = parsed;
        return parsed;
      })
      .finally(() => {
        loadPromise = null;
      });
  }

  return loadPromise;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, onClick, className }) => {
  const normalizedSkill = useMemo(() => skill.trim(), [skill]);
  const normalizedSkillKey = normalizedSkill.toLowerCase();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement | null>(null);
  const [data, setData] = useState<RelatedData>({ projects: [], jobs: [], certificates: [] });
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTagClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.();
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    if (!showTooltip || hasFetched) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await fetchRelatedData();
        if (isMounted) {
          setData(result);
          setHasFetched(true);
        }
      } catch (error) {
        console.error("SkillTag: failed to load related data", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [showTooltip, hasFetched]);

  useEffect(() => {
    if (!showTooltip) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTooltip]);

  const matchesSkill = useCallback(
    (value: string | undefined | null) => value?.trim().toLowerCase() === normalizedSkillKey,
    [normalizedSkillKey]
  );

  const relatedProjects = useMemo(
    () =>
      data.projects.filter(
        (project) =>
          Array.isArray(project.skills) && project.skills.some((item) => matchesSkill(item))
      ),
    [data.projects, matchesSkill]
  );

  const relatedJobs = useMemo(
    () =>
      data.jobs.filter(
        (job) => Array.isArray(job.skills) && job.skills.some((item) => matchesSkill(item))
      ),
    [data.jobs, matchesSkill]
  );

  const relatedCertificates = useMemo(
    () =>
      data.certificates.filter(
        (certificate) =>
          Array.isArray(certificate.skills) &&
          certificate.skills.some((item) => matchesSkill(item))
      ),
    [data.certificates, matchesSkill]
  );

  const showEmptyState =
    !isLoading &&
    relatedProjects.length === 0 &&
    relatedJobs.length === 0 &&
    relatedCertificates.length === 0;

  if (!normalizedSkill) {
    return null;
  }

  return (
    <span
      ref={tooltipRef}
      className={`relative inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition ${className ?? ""}`}
      onClick={handleTagClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {normalizedSkill}
      {showTooltip && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 max-w-xs px-4 py-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20 whitespace-normal text-left border border-blue-500 animate-fade-in">
          <div className="font-bold text-base mb-2 text-blue-300">{normalizedSkill}</div>
          {isLoading && <div className="text-gray-400">Loading related items...</div>}

          {relatedProjects.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-200">Projects:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedProjects.map((project) => (
                  <li key={project.id} className="mb-1">
                    {project.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedJobs.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-200">Jobs:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedJobs.map((job) => (
                  <li key={job.id} className="mb-1">
                    {job.title} <span className="text-gray-400">at</span> {job.company}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedCertificates.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold text-blue-200">Certificates:</span>
              <ul className="list-disc pl-5 mt-1">
                {relatedCertificates.map((certificate) => (
                  <li key={certificate.name} className="mb-1">
                    {certificate.name} <span className="text-gray-400">by</span> {certificate.provider}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showEmptyState && <div className="text-gray-400">No related items found.</div>}
        </span>
      )}
    </span>
  );
};

export default SkillTag;
