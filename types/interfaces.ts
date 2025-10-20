import { ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  category: string;
  featured: boolean;
  skills: string[];
  demoUrl?: string;
  githubUrl?: string;
  jobId?: string; // Link a project to a job when applicable
  relatedJobIds?: string[];
  links?: Record<string, string>;
  startDate?: string;
  endDate?: string | null;
  status?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  skills: string[];
  links?: Record<string, string>;
  featured?: boolean;
  projectIds?: string[];
}

export interface Certificate {
  name: string;
  file: string;
  provider: string;
  field: string;
  skills: string[];
  issueDate: string | null;
  expiryDate?: string | null;
  credentialId: string | null;
  credentialUrl?: string | null;
  description?: string;
  featured: boolean;
}

export interface IntroData {
  profileImage: {
    src: string;
    alt: string;
  };
  name: string;
  title: string;
  about: string;
  socialLinks: {
    email: string;
    github: string;
    linkedin: string;
    additional?: Record<string, string>;
  };
}

export interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  containerClassName?: string;
  background?: 'default' | 'gray' | 'gradient';
}

export interface SkillTooltipProps {
  skill: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  children?: ReactNode;
  projects?: Project[];
  jobs?: Job[];
  certificates?: Certificate[];
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export interface SearchSectionResult {
  type: string;
  items: any[];
  count: number;
  highlights?: any[];
}

export interface SearchSummary {
  title: string;
  body: string;
  highlights?: Record<string, string[]>;
}

export interface SearchResultItem {
  type: string;
  data: any;
}

export interface SearchResponse {
  items: SearchResultItem[];
  total_count: number;
  search_time: number;
  query: string;
  search_type: string;
  pagination: {
    total_count: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
  summary?: SearchSummary | null;
  sections?: SearchSectionResult[] | null;
  llm_response?: string | null;
  intent?: string | null;
}

export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  tags?: string[];
  featured?: boolean;
  children?: ReactNode;
  projects?: Project[];
}
