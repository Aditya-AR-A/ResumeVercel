import React from 'react';
import { Project, Job, Certificate } from '../types/interfaces';

type SkillTooltipContentProps = {
  projects?: Project[];
  jobs?: Job[];
  certificates?: Certificate[];
};

const SkillTooltipContent: React.FC<SkillTooltipContentProps> = ({ projects, jobs, certificates }) => {
  return (
    <div role="tooltip" className="p-4 rounded-lg text-sm bg-slate-900/95 text-white shadow-tooltip ring-1 ring-white/10">
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Projects</h3>
          <ul className="list-disc pl-5">
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
      )}

      {jobs && jobs.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Jobs</h3>
          <ul className="list-disc pl-5">
            {jobs.map((job) => (
              <li key={job.id}>{job.title} at {job.company}</li>
            ))}
          </ul>
        </div>
      )}

      {certificates && certificates.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Certificates</h3>
          <ul className="list-disc pl-5">
            {certificates.map((certificate) => (
              <li key={certificate.name}>{certificate.name} by {certificate.provider}</li>
            ))}
          </ul>
        </div>
      )}

      {(!projects || projects.length === 0) && (!jobs || jobs.length === 0) && (!certificates || certificates.length === 0) && (
        <p className="text-slate-300">No related data found.</p>
      )}
    </div>
  );
};

export default SkillTooltipContent;
