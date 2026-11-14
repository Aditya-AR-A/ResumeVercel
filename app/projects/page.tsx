import { projects } from '@/utils/portfolio';
import { ProjectExplorer } from '@/components/PortfolioExperience';
export default function ProjectsPage({searchParams={}}:{searchParams?:{skill?:string|string[]}}) {
  const raw=searchParams.skill??'';
  const skill=(Array.isArray(raw)?raw[0]:raw).slice(0,100);
  return <div className="portfolio-experience py-12 sm:py-16"><header className="project-page-heading"><p className="work-label">Explore the work</p><h1>A collection of<br /><span>problems worth solving.</span></h1><p>Filter by a focus or technology. Open a project to see the problem, my contribution, and the workflow behind it.</p></header><ProjectExplorer key={skill} projects={projects} initialSkill={skill} /></div>;
}
