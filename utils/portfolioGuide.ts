import { intro, projects, jobs, certificates } from './portfolio';
import { toSlug } from './slug';
import type { Project } from '../types/interfaces';

export interface GuideLink { label: string; href: string }
export interface GuideReply {
  text: string;
  links: GuideLink[];
  projectId?: string;
  destination?: string;
}
export interface GuideContext { pathname?: string; projectId?: string }

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const has = (value: string, phrase: string) => (' ' + value + ' ').includes(' ' + normalise(phrase) + ' ');
const linkToProject = (project: Project): GuideLink => ({ label: project.name, href: '/projects/' + project.id });
const short = (value: string, limit = 750) => value.length <= limit ? value : value.slice(0, limit).replace(/\s+\S*$/, '') + '…';
const sections: GuideLink[] = [
  { label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' }, { label: 'Certificates', href: '/certificates' },
  { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' },
];
const aliases: [string, string[]][] = [
  ['slicer-overlay', ['slicer script', 'slicing script', 'video segmentation', 'overlay', 'clip splitter', 'clip splitting']],
  ['sshd-website-chatbot', ['sshd chatbot', 'website chatbot', 'chatbot']],
  ['talentpool-powerbi', ['talentpool', 'talent pool', 'talent', 'power bi', 'powerbi', 'deneb', 'vega lite']],
  ['qlik-powerbi-suite', ['performance pro', 'performancepro', 'qlik', 'qvs', 'qvd']],
  ['recruitment-automation-platform', ['recruitment agent', 'recruitment system', 'recruitment automation', 'voice integration', 'livekit', 'twilio']],
  ['workaholic-backend', ['workaholic']],
  ['slicer-analytics', ['slicer', 'slicing dashboard', 'slicer analytics', 'settlement dashboard']],
];
export const GUIDE_STARTERS = [
  'What did Aditya build at SSHD?', 'Explain the Talent Power BI dashboard',
  'Show me his backend projects', 'What was his role in Performance Pro?',
];

export function isAllowedGuidePath(path: string): boolean {
  if (sections.some(link => link.href === path)) return true;
  if (projects.some(p => path === '/projects/' + p.id)) return true;
  if (jobs.some(j => path === '/experience/' + j.id)) return true;
  if (certificates.some(c => path === '/certificates/' + toSlug(c.name))) return true;
  if (path.startsWith('/projects?skill=')) {
    try {
      const skill = decodeURIComponent(path.slice('/projects?skill='.length));
      return projects.some(p => p.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
    } catch { return false; }
  }
  return false;
}

function matchProject(query: string): Project | undefined {
  for (const [id, names] of aliases) {
    if (names.some(name => has(query, name))) return projects.find(p => p.id === id);
  }
  return projects.find(p => has(query, p.id) || has(query, p.name));
}

function response(text: string, links: GuideLink[], navigate: boolean, projectId?: string): GuideReply {
  const safeLinks = links.filter(link => isAllowedGuidePath(link.href));
  return { text: short(text), links: safeLinks, projectId,
    destination: navigate ? safeLinks[0]?.href : undefined };
}

export function answerPortfolioQuestion(input: string, context: GuideContext = {}): GuideReply {
  const raw = input.trim().slice(0, 500), query = normalise(raw);
  const navigate = /^(please )?(open|go to|take me to|navigate to|show( me)?)( the)?\b/.test(query);
  const fallback = () => response('I use prepared answers from this portfolio. Try a project name, a technology, SSHD experience, certificates, or contact details.', sections.filter(s => ['/projects', '/experience', '/contact'].includes(s.href)), false);
  if (!query) return response('Choose a topic or ask a short question about Aditya’s work.', [], false);
  if (/(https?:|javascript:|data:|www\.)/i.test(raw)) return fallback();

  let project = matchProject(query);
  if (!project && /\b(it|its|this|that|used|the project|technologies|tech stack)\b/.test(query)) {
    const id = context.projectId || context.pathname?.match(/^\/projects\/([^/?]+)$/)?.[1];
    project = projects.find(p => p.id === id);
  }

  if (/\b(salary|notice period|phone number|private|password|married|age)\b/.test(query)) {
    return response('Those details are not published in this portfolio. Please contact Aditya directly for information he chooses to share.', [{ label: 'Contact Aditya', href: '/contact' }], false);
  }
  if (/\b(how many (users|clients)|cost savings|measured|percentage improvement|how much .* (increase|reduce|improve|save)|improvement percentage)\b/.test(query)) {
    return response('The portfolio does not publish verified figures for that outcome. It describes the implementation and personal contribution.', project ? [linkToProject(project)] : [{ label: 'Explore projects', href: '/projects' }], false, project?.id);
  }

  if (project) {
    const links = [linkToProject(project)];
    if (/\b(employer|which company|was .* at|at sshd)\b/.test(query)) {
      const job = jobs.find(j => j.id === project?.jobId);
      return job
        ? response(project.name + ' is linked to ' + job.company + ' in this portfolio.', [...links, { label: job.company, href: '/experience/' + job.id }], navigate, project.id)
        : response('The employer for ' + project.name + ' has not been confirmed in the portfolio.', links, false, project.id);
    }
    const text = /\b(skills|technologies|stack|tools|built with)\b/.test(query)
      ? project.name + ' lists these technologies: ' + project.skills.join(', ') + '.'
      : /\b(challenge|problem)\b/.test(query) && project.caseStudy
        ? project.caseStudy.challenge + ' Aditya’s contribution: ' + project.caseStudy.contribution
        : project.name + '. ' + (project.caseStudy?.contribution || project.description);
    return response(text, links, navigate, project.id);
  }

  const company = jobs.find(j => has(query, j.company) || (j.company.includes('SSHD') && has(query, 'sshd')) || (j.company.includes('Addmin') && has(query, 'addmin')) || (j.company.includes('Planto') && has(query, 'planto')));
  if (company) {
    const related = projects.filter(p => p.jobId === company.id);
    return response(company.title + ' at ' + company.company + '. ' + company.description,
      [{ label: company.company + ' experience', href: '/experience/' + company.id }, ...related.slice(0, 4).map(linkToProject)], navigate);
  }
  if (/\b(backend|back end|django|fastapi)\b/.test(query)) {
    const matches = projects.filter(p => p.skills.some(s => /^(django|django rest framework|fastapi|node\.js)$/i.test(s)));
    const current = jobs.find(j => j.isCurrent && j.skills.includes('Node.js'));
    const note = current ? ' His ' + current.company + ' role also lists Node.js backend contributions.' : '';
    return response('Backend-related project records include ' + matches.map(p => p.name).join('; ') + '.' + note, [{ label: 'Django backend projects', href: '/projects?skill=Django' }, ...matches.map(linkToProject)], navigate);
  }
  if (/\b(certificates?|certifications?|credentials?)\b/.test(query)) {
    const selected = certificates.filter(c => /PCAP|HackerRank SQL/.test(c.name));
    return response('The certificates section includes ' + selected.map(c => c.name).join(', ') + ', alongside other study records. See each record for its issuer and available dates.', [{ label: 'Certificates', href: '/certificates' }], navigate);
  }
  if (/\b(contact|email|hire|connect|get in touch|linkedin|github)\b/.test(query)) {
    return response('You can contact Aditya through the email and professional profile links on the contact page.', [{ label: 'Contact Aditya', href: '/contact' }], navigate);
  }
  if (/\b(resume|cv)\b/.test(query)) return response('Use the Résumé link in the navigation to open the PDF. The experience page contains the current public role records.', [{ label: 'Current experience', href: '/experience' }], false);
  if (/\b(experience|career|employment|jobs|job profile)\b/.test(query)) {
    return response('The listed career includes ' + jobs.map(j => j.title + ' at ' + j.company).join('; ') + '.', [{ label: 'Experience', href: '/experience' }], navigate);
  }
  if (/\b(skills|technologies|tech stack)\b/.test(query)) return response('His public work spans Python, applied AI, backend workflows, and data analysis. The About page connects recorded technologies with projects; these are not proficiency scores.', [{ label: 'About and skills', href: '/about' }], navigate);

  const listedSkills = Array.from(new Set(projects.flatMap(p => p.skills))).sort((a, b) => b.length - a.length);
  const skill = listedSkills.find(s => has(query, s));
  if (skill) {
    const matches = projects.filter(p => p.skills.includes(skill));
    return response(skill + ' appears in ' + matches.map(p => p.name).join('; ') + '.', [{ label: 'Explore ' + skill + ' projects', href: '/projects?skill=' + encodeURIComponent(skill) }, ...matches.slice(0, 3).map(linkToProject)], navigate);
  }
  if (/\b(projects|portfolio|work samples)\b/.test(query)) return response('Explore his AI, Python and analytics work, including Slicer Analytics, the Talent Power BI dashboard and recruitment automation.', [{ label: 'All projects', href: '/projects' }], navigate);
  if (/\b(home|main page)\b/.test(query) && navigate) return response('Opening the portfolio home.', [{ label: 'Home', href: '/' }], true);
  if (query === 'about' || /\b(about aditya|about you|yourself|who is|introduce|hello|hi)\b/.test(query) || (navigate && has(query, 'about'))) return response(intro.name + ' is an ' + intro.title + '. ' + intro.about, [{ label: 'About Aditya', href: '/about' }], navigate);
  return fallback();
}
