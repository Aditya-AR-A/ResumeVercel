'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { IntroData, Project } from '@/types/interfaces';

const workIds = ['slicer-analytics', 'recruitment-automation-platform', 'slicer-overlay', 'talentpool-powerbi'];
const workLabels = ['Operational analytics', 'Recruitment & voice', 'Editing tools', 'Power BI'];
const tags = ['Python', 'Dash', 'Plotly', 'Django', 'MongoDB', 'Power BI', 'DAX', 'LiveKit', 'openpyxl'];

function Arrow({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`h-5 w-5 ${className}`}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export function WorkflowWalkthrough({ project }: { project: Project }) {
  const [step, setStep] = useState(0);
  const story = project.caseStudy;
  if (!story) return null;
  const active = story.steps[step];
  return <div className="workflow-walkthrough">
    <p className="work-label">Inside the workflow · choose a step</p>
    <ol className="workflow-steps">{story.steps.map((item, index) => <li key={item.title}>
      <button type="button" aria-pressed={step === index} onClick={() => setStep(index)} className={step === index ? 'is-active' : ''}>
        <span className="step-number">0{index + 1}</span><span>{item.title}</span>
      </button>
    </li>)}</ol>
    <div className="workflow-description" aria-live="polite"><span className="work-label">Step 0{step + 1}</span><h4>{active.title}</h4><p>{active.description}</p></div>
  </div>;
}

function BatchDemo() {
  const [flags, setFlags] = useState([false, false, false]);
  const rework = flags.some(Boolean);
  return <div className="live-demo">
    <div className="demo-topline"><span className="demo-dot" />Batch rule explorer<span className="demo-label">Illustrative data</span></div>
    <p className="demo-instruction">Flag any clip for an auditor correction.</p>
    <div className="batch-clips">{flags.map((flag, index) => <button type="button" key={index} aria-label={`Toggle auditor correction for clip ${index + 1}`} aria-pressed={flag} onClick={() => setFlags(previous => previous.map((value, i) => i === index ? !value : value))} className={flag ? 'clip-flagged' : ''}>
      <span className="clip-symbol" aria-hidden="true">{flag ? '↻' : '✓'}</span><span>Clip 0{index + 1}</span><small>{flag ? 'Correction' : 'Clear'}</small>
    </button>)}</div>
    <div className={`batch-result ${rework ? 'has-rework' : ''}`} role="status"><span className="work-label">Container classification</span><strong>{rework ? 'Auditor rework batch' : 'No auditor correction flagged'}</strong><p>{rework ? 'One flagged video makes the entire container a rework batch.' : 'Individual clip flags determine the batch-level classification.'}</p></div>
    <button type="button" className="demo-reset" disabled={!rework} onClick={() => setFlags([false, false, false])}>Reset example</button>
  </div>;
}

function TimelineDemo() {
  const [point, setPoint] = useState(12);
  const [boundaries, setBoundaries] = useState([0, 30]);
  const [history, setHistory] = useState<number[][]>([]);
  const canSplit = point > 0 && point < 30 && !boundaries.includes(point);
  const split = () => {
    if (!canSplit) return;
    setHistory(previous => [...previous, boundaries]);
    setBoundaries(previous => [...previous, point].sort((a, b) => a - b));
  };
  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setBoundaries(previous); setHistory(old => old.slice(0, -1));
  };
  return <div className="live-demo">
    <div className="demo-topline"><span className="demo-dot" />Clip boundary lab<span className="demo-label">Standalone demo</span></div>
    <p className="demo-instruction">Move the playhead, then split the segment around it.</p>
    <div className="clip-timeline" aria-label="Demo video segments">{boundaries.slice(0, -1).map((start, i) => <div key={start} style={{ width: `${(boundaries[i + 1] - start) / 30 * 100}%` }}><span>{start}–{boundaries[i + 1]}s</span></div>)}<span className="playhead" style={{left:`${point / 30 * 100}%`}} aria-hidden="true" /></div>
    <label className="playhead-label" htmlFor="demo-playhead">Playhead <output htmlFor="demo-playhead">{point}s / 30s</output></label>
    <input id="demo-playhead" aria-label="Demo playhead" type="range" min="0" max="30" value={point} onChange={event => setPoint(Number(event.target.value))} className="timeline-range" />
    <div className="demo-actions"><button type="button" onClick={split} disabled={!canSplit}>Split at {point}s</button><button type="button" onClick={undo} disabled={!history.length}>Undo split</button><button type="button" onClick={() => { setBoundaries([0, 30]); setHistory([]); setPoint(12); }}>Reset</button></div>
    <p className="demo-feedback" role="status">{boundaries.length - 1} segment{boundaries.length === 2 ? '' : 's'} · {canSplit ? 'Ready to split the containing segment.' : 'Move inside a segment to create a new split.'}</p>
  </div>;
}

function ProjectPanel({ project }: { project: Project }) {
  return <div className="project-panel experience-enter">
    <div className="project-story"><div className="story-eyebrow"><span className="work-label">{project.category}</span><span className="story-index">A closer look</span></div>
      <h3>{project.name}</h3><p className="story-challenge">{project.caseStudy?.challenge ?? project.shortDescription}</p>
      <div className="contribution-box"><p className="work-label">My contribution</p><p>{project.caseStudy?.contribution ?? project.description}</p></div>
      <div className="story-tags">{project.skills.slice(0, 6).map(skill => <Link href={`/search?query=${encodeURIComponent(skill)}`} key={skill}>{skill}</Link>)}</div>
      <Link href={`/projects/${project.id}`} className="story-link">Open the full project <Arrow /></Link>
    </div>
    <div className="project-interaction"><WorkflowWalkthrough key={project.id} project={project} />
      {project.id === 'slicer-analytics' && <BatchDemo />}
      {project.id === 'slicer-overlay' && <TimelineDemo />}
      <p className="interaction-note">{project.caseStudy?.boundary}</p>
    </div>
  </div>;
}

export function SkillConnections({ projects }: { projects: Project[] }) {
  const [skill, setSkill] = useState('Python');
  const matches = projects.filter(project => project.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
  return <section id="skills" className="skill-connections">
    <div><p className="work-label">Skills, with context</p><h2>Follow a skill into the work.</h2><p className="section-copy">Select a technology to see where it appears in my projects.</p>
      <div className="skill-switches">{tags.map(tag => <button type="button" key={tag} aria-pressed={skill === tag} onClick={() => setSkill(tag)}>{tag}</button>)}</div>
    </div>
    <div className="skill-results" aria-live="polite"><p className="work-label">{skill} · {matches.length} project{matches.length === 1 ? '' : 's'}</p>{matches.slice(0, 3).map(project => <Link key={project.id} href={`/projects/${project.id}`}><span>{project.name}</span><Arrow /></Link>)}
      <Link className="skill-all" href={`/projects?skill=${encodeURIComponent(skill)}`}>Explore all {skill} projects →</Link>
    </div>
  </section>;
}

export default function PortfolioExperience({ intro, projects }: { intro: IntroData; projects: Project[] }) {
  const [selected, setSelected] = useState(workIds[0]);
  const active = projects.find(project => project.id === selected) ?? projects[0];
  const chooseTrack = (id: string) => setSelected(id);
  return <div>
    <section id="home" className="portfolio-hero">
      <div className="hero-editorial"><div className="hero-identity"><Image src={intro.profileImage.src} alt="Aditya Raj" width={48} height={48} priority /><span>Aditya Raj<span className="identity-sub">AI / Python Developer & Data Analyst</span></span></div>
        <h1>I connect <span>AI, data</span><br className="hidden sm:block" /> & everyday work.</h1>
        <p>From voice workflows to operational dashboards, I build the tools that make complex processes easier to use.</p>
        <div className="hero-links"><a href="#projects" className="explore-button">Explore the work <Arrow /></a><Link href="/contact" className="hero-secondary">Let’s talk <span aria-hidden="true">↗</span></Link></div>
        <div className="hero-current"><span className="current-dot" />Currently at <Link href="/experience/ai-python-sshd-2026">SSHD Technologies</Link></div>
      </div>
      <div className="build-map"><div className="map-top"><span className="work-label">The way I build</span><span className="map-status">Explore a focus</span></div>
        <div className="map-source"><span aria-hidden="true">↳</span> A real workflow to improve</div><div className="map-stem" aria-hidden="true" />
        <div className="map-options">{[{id:workIds[1],symbol:'{ }',label:'Applied AI',text:'Voice & recruitment'},{id:workIds[0],symbol:'▥',label:'Analytics',text:'Reporting & decisions'},{id:workIds[2],symbol:'⌘',label:'Practical tools',text:'APIs & interaction'}].map(item => <button type="button" key={item.id} aria-pressed={selected===item.id} onClick={() => chooseTrack(item.id)}><span className="map-symbol" aria-hidden="true">{item.symbol}</span><strong>{item.label}</strong><small>{item.text}</small><span className="map-select" aria-hidden="true">↘</span></button>)}</div>
        <div className="map-output" aria-live="polite"><span className="work-label">On the workbench</span><strong>{active.name}</strong><a href="#projects">Step inside <Arrow /></a></div>
        <div className="map-foot"><span>Python at the core</span><span>People at the other end</span></div>
      </div>
    </section>
    <section id="projects" className="workbench-section"><div className="section-heading"><div><p className="work-label">The workbench</p><h2>Don’t just read about it.<br /><span>Explore how it works.</span></h2></div><p>Choose a project. Walk through the thinking.<br />Try the small interactive examples.</p></div>
      <div className="workbench"><div className="workbench-switches" aria-label="Choose a project walkthrough">{workIds.map((id,index) => <button type="button" key={id} aria-pressed={selected===id} onClick={()=>chooseTrack(id)}><span className="switch-index">0{index+1}</span>{workLabels[index]}</button>)}</div>
        <ProjectPanel key={active.id} project={active} />
      </div><div className="workbench-footer"><p>Small demos explain the interaction. Full project pages explain the scope.</p><Link href="/projects">Explore all projects <Arrow /></Link></div>
    </section>
    <SkillConnections projects={projects} />
  </div>;
}

export function ProjectExplorer({ projects, initialSkill = '' }: { projects: Project[]; initialSkill?: string }) {
  const [category, setCategory] = useState('All work');
  const [query, setQuery] = useState(initialSkill);
  const categories = ['All work', ...Array.from(new Set(projects.map(p=>p.category)))];
  const visible = useMemo(()=>projects.filter(project => (category==='All work'||project.category===category) && `${project.name} ${project.description} ${project.skills.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())),[projects,category,query]);
  return <div className="project-explorer">
    <div className="explorer-controls"><label htmlFor="project-filter"><span className="work-label">Find your thread</span><input id="project-filter" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try Python, voice, Power BI…" /></label>
      <div className="category-switches" aria-label="Filter projects by category">{categories.map(item=><button key={item} type="button" onClick={()=>setCategory(item)} aria-pressed={category===item}>{item}</button>)}</div>
    </div>
    <div className="explorer-count"><p role="status">{visible.length} project{visible.length===1?'':'s'} to explore</p>{(query||category!=='All work')&&<button type="button" onClick={()=>{setQuery('');setCategory('All work');}}>Clear filters</button>}</div>
    {visible.length===0&&<div className="explorer-empty">No projects match yet. Try another technology or clear the filters.</div>}
    <div className="explorer-grid">{visible.map((project,index)=><article key={project.id} className="explorer-card experience-enter"><div className="explorer-card-meta"><span className="work-label">{project.category}</span><span>{String(index+1).padStart(2,'0')}</span></div><h2><Link href={`/projects/${project.id}`}>{project.name}</Link></h2><p>{project.shortDescription}</p><div className="story-tags">{project.skills.slice(0,6).map(skill=><button key={skill} type="button" onClick={()=>setQuery(skill)}>{skill}</button>)}</div>
      {project.caseStudy&&<details className="project-preview"><summary>Problem & contribution <span aria-hidden="true">＋</span></summary><div><h3>The problem</h3><p>{project.caseStudy.challenge}</p><h3>My contribution</h3><p>{project.caseStudy.contribution}</p></div></details>}
      <Link href={`/projects/${project.id}`} className="story-link">Explore project <Arrow /></Link>
    </article>)}</div>
  </div>;
}
