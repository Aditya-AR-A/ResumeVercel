/**
 * API utility functions for communicating with the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://resume-backend-8uzi.onrender.com'
    : 'http://localhost:8000');

// Debug logging for API configuration
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('API Configuration:', {
    API_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    isConfigured: !!API_BASE_URL
  });
}

const AI_CACHE_TTL_MS = 1000 * 60 * 5;
const AI_CACHE_MAX = 100;
const aiCache: Map<string, { ts: number; data: any }> = new Map();

function makeCacheKey(endpoint: string, options: RequestInit) {
  const body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body ?? '');
  return `${endpoint}|${body}`;
}

function getCached(endpoint: string, options: RequestInit) {
  const key = makeCacheKey(endpoint, options);
  const entry = aiCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > AI_CACHE_TTL_MS) {
    aiCache.delete(key);
    return undefined;
  }
  return entry.data;
}

function setCached(endpoint: string, options: RequestInit, data: any) {
  const key = makeCacheKey(endpoint, options);
  aiCache.set(key, { ts: Date.now(), data });
  if (aiCache.size > AI_CACHE_MAX) {
    const firstKey = aiCache.keys().next().value as string;
    aiCache.delete(firstKey);
  }
}

/**
 * Generic API fetch function with error handling
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  if (process.env.NODE_ENV !== 'production') {
    console.log('API Request:', { url, method: options.method || 'GET', body: options.body });
  }

  try {
    const method = (options.method || 'GET').toUpperCase();
    const isGetRequest = method === 'GET';
    const isServer = typeof window === 'undefined';

    const fetchOptions: RequestInit = {
      ...options,
      method,
      cache: options.cache ?? (isGetRequest ? 'force-cache' : 'no-store'),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if ((options as any)?.next) {
      (fetchOptions as any).next = (options as any).next;
    } else if (isServer && isGetRequest) {
      (fetchOptions as any).next = { revalidate: 900 };
    }

    if (method === 'POST' && endpoint.startsWith('/ai/')) {
      const cached = getCached(endpoint, fetchOptions);
      if (cached !== undefined) {
        return cached;
      }
    }

    const response = await fetch(url, fetchOptions);

    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response status:', response.status, response.statusText);
    }

    if (!response.ok) {
      const errorPayload = { status: response.status, statusText: response.statusText };
      if (process.env.NODE_ENV !== 'production') {
        console.error('API Error response:', errorPayload);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response data:', result);
    }

    // Check if the response has the APIResponse structure (data endpoints)
    if (result && typeof result === 'object' && 'data' in result && 'success' in result) {
      if (!result.success) {
        console.error('API returned success=false:', result.message);
        throw new Error(result.message || 'API request failed');
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log('Extracting data from APIResponse wrapper');
      }
      return result.data; // Return just the data field for data endpoints
    }

    // For AI endpoints and other direct responses, return the result as-is
    if (process.env.NODE_ENV !== 'production') {
      console.log('Returning direct response (AI endpoint or other)');
    }
    if (method === 'POST' && endpoint.startsWith('/ai/')) {
      setCached(endpoint, fetchOptions, result);
    }
    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`API request failed for ${endpoint}:`, error);
    }
    throw error;
  }
}

/**
 * Data API functions
 */
export const dataApi = {
  // Get intro data
  async getIntro() {
    return apiRequest('/api/intro');
  },

  // Get all projects
  async getProjects() {
    return apiRequest('/api/projects');
  },

  // Get new projects (additional feed)
  async getNewProjects() {
    return apiRequest('/api/projects/new');
  },

  // Get specific project
  async getProject(id: string) {
    return apiRequest(`/api/projects/${id}`);
  },

  // Get all jobs
  async getJobs() {
    return apiRequest('/api/jobs');
  },

  // Get specific job
  async getJob(id: string) {
    return apiRequest(`/api/jobs/${id}`);
  },

  // Get all certificates
  async getCertificates() {
    return apiRequest('/api/certificates');
  },

  // Get specific certificate
  async getCertificate(id: string) {
    return apiRequest(`/api/certificates/${id}`);
  },

  // Unified search
  async search(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest(`/api/search?${params}`);
  },

  // Get aggregated skills
  async getSkills() {
    return apiRequest('/api/skills');
  },

  // Get timeline
  async getTimeline() {
    return apiRequest('/api/timeline');
  },

  // Get portfolio stats
  async getStats() {
    return apiRequest('/api/stats');
  },

  // Get global layout configuration
  async getLayout() {
    return apiRequest('/api/layout');
  },
};

/**
 * AI API functions
 */
export const aiApi = {
  // General chat with AI agent
  async chat(message: string) {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Ask question-answering endpoint
  async ask(question: string) {
    return apiRequest('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },

  // Message classification
  async classify(message: string) {
    return apiRequest('/ai/classify', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Content analysis
  async analyze(content: string) {
    return apiRequest('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Content generation
  async generate(prompt: string) {
    return apiRequest('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  // Semantic search with AI summary
  async search(query: string, options: {
    searchType?: string;
    filters?: any;
    limit?: number;
    offset?: number;
    includeSections?: string[];
  } = {}) {
    const payload: Record<string, unknown> = { query };

    if (options.searchType) {
      payload.search_type = options.searchType;
    }
    if (options.filters) {
      payload.filters = options.filters;
    }
    if (typeof options.limit === 'number') {
      payload.limit = options.limit;
    }
    if (typeof options.offset === 'number') {
      payload.offset = options.offset;
    }
    if (options.includeSections && options.includeSections.length > 0) {
      payload.include_sections = options.includeSections;
    }

    return apiRequest('/ai/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

/**
 * Utility functions
 */
export const apiUtils = {
  // Health check
  async healthCheck() {
    console.log('API Utils: Performing health check...');
    try {
      const result = await apiRequest('/health');
      console.log('API Utils: Health check successful:', result);
      return result;
    } catch (error) {
      console.error('API Utils: Health check failed:', error);
      throw error;
    }
  },

  // Test AI endpoint (without requiring API keys)
  async testConnection() {
    console.log('API Utils: Testing API connection...');
    try {
      // Try to access the docs endpoint which should always be available
      const response = await fetch(`${API_BASE_URL}/docs`);
      console.log('API Utils: Docs endpoint response:', response.status, response.statusText);
      return { status: response.status, available: response.ok };
    } catch (error) {
      console.error('API Utils: Connection test failed:', error);
      return { status: 0, available: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};
