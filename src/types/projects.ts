// Basic types
interface Image {
  name: string;
  file: string;
  description?: string;
}

interface Document {
  name: string;
  file: string;
}

interface Metric {
  label: string;
  value: string;
}

// Project-specific types
interface DeploymentInfo {
  type: 'cloud' | 'self-hosted' | 'edge';
  platform: string;
  url?: string;
  status: 'active' | 'maintenance' | 'offline';
  apiPlatform?: string;
}

interface MLModelInfo {
  type: 'llm' | 'computer-vision' | 'nlp' | 'other';
  base?: string;
  framework?: string;
  customizations?: string[];
  optimizations?: string[];
  metrics?: Record<string, string>;
  hardware?: string;
  training?: {
    dataset: string;
    size: string;
    accuracy?: string;
  };
}

interface VisualizationInfo {
  type: 'power-bi' | 'tableau' | 'custom';
  features: string[];
  metrics: Record<string, string>;
}

interface DemoInfo {
  type: 'video' | 'interactive' | 'embedded';
  url?: string;
  embedCode?: string;
  powerbiEmbedUrl?: string;
  tableauEmbedUrl?: string;
  screenshots?: Image[];
}

interface APIInfo {
  type: 'rest' | 'graphql' | 'websocket';
  endpoints?: string[];
  documentation: string;
  status?: 'active' | 'beta' | 'deprecated';
}

interface ResearchInfo {
  publications?: {
    title: string;
    url: string;
    date: string;
    citation?: string;
  }[];
  patents?: {
    title: string;
    number: string;
    url: string;
    date: string;
  }[];
}

// Main Project interface
export interface Project {
  id: string;
  name: string;
  type: 'web-app' | 'mobile-app' | 'llm-app' | 'computer-vision' | 'ml-service' | 'data-visualization' | 'research' | 'other';
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  category: string;
  featured?: boolean;
  status: 'active' | 'completed' | 'in-progress' | 'archived';
  startDate: string;
  endDate?: string;
  skills: string[];
  
  // Links
  links?: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
    api?: string;
    paper?: string;
    powerbi?: string;
    tableau?: string;
    [key: string]: string | undefined;
  };

  // Project-specific details
  deployment?: DeploymentInfo;
  model?: MLModelInfo;
  visualization?: VisualizationInfo;
  demo?: DemoInfo;
  api?: APIInfo;
  research?: ResearchInfo;

  // Media and metrics
  images?: Image[];
  documents?: Document[];
  metrics?: Metric[];
}

export type GroupedProjects = {
  [key: string]: Project[];
};


export function isValidProject(project: unknown): project is Project {
  const p = project as Project;
  return (
    typeof p === 'object' &&
    p !== null &&
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.type === 'string' &&
    typeof p.description === 'string' &&
    typeof p.category === 'string' &&
    typeof p.status === 'string' &&
    typeof p.startDate === 'string' &&
    Array.isArray(p.skills) &&
    p.skills.every(skill => typeof skill === 'string')
  );
}
