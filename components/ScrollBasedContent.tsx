import Link from 'next/link';
import { toSlug } from '@/utils/slug';
import JobCard from './JobCard';
import PortfolioExperience from './PortfolioExperience';
import type { IntroData, Project, Job, Certificate, SkillsResponse } from '@/types/interfaces';
interface Props { introData: IntroData; projects: Project[]; jobs: Job[]; certificates: Certificate[]; skillsAggregation?: SkillsResponse }
export default function ScrollBasedContent({ introData, projects, jobs, certificates }: Props) {
  const sortedJobs = [...jobs].sort((a,b)=>b.startDate.localeCompare(a.startDate));
  return <div className="portfolio-experience pb-16">
    <PortfolioExperience intro={introData} projects={projects} />
    <section id="experience" className="career-section"><div className="section-heading"><div><p className="work-label">The journey</p><h2>Building, learning,<br /><span>and making things useful.</span></h2></div><Link href="/experience" className="story-link">Full experience →</Link></div>
      <div className="space-y-4">{sortedJobs.map(job=><JobCard key={job.id} {...job} compact href={`/experience/${job.id}`} />)}</div>
    </section>
    <section id="certificates" className="credentials-section"><div><p className="work-label">Learning behind the work</p><h2>Credentials & foundations</h2><p>Python, SQL, analytics, and earlier machine learning study.</p></div><div className="credential-links">{certificates.filter(c=>c.name.includes('PCAP')||c.name.includes('HackerRank SQL')).map(c=><Link key={c.name} href={`/certificates/${toSlug(c.name)}`}>{c.name}<span aria-hidden="true">↗</span></Link>)}<Link href="/certificates">All certificates →</Link></div></section>
    <section className="portfolio-contact"><p className="work-label">Something worth building?</p><h2>Let’s connect the dots.</h2><Link href="/contact" className="explore-button">Get in touch <span aria-hidden="true">↗</span></Link></section>
  </div>;
}
