/**
 * Project Data Service
 * 
 * This service provides a unified interface for accessing project data from either
 * static JSON files or a FastAPI backend. It implements the adapter pattern to
 * seamlessly switch between data sources based on configuration.
 * 
 * Features:
 * - Hybrid data fetching (static JSON fallback when API fails)
 * - Advanced filtering and search capabilities
 * - Project analytics and statistics calculation
 * - Caching and performance optimization
 * - Type-safe interfaces for all operations
 * 
 * The service automatically falls back to static data if the API is unavailable,
 * ensuring the application remains functional in all environments.
 * 
 * Key Methods:
 * - getProjects(): Fetch projects with optional filtering
 * - getProjectById(): Get a specific project by ID
 * - searchProjects(): Full-text search across project data
 * - getProjectAnalytics(): Generate usage statistics and metrics
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import { apiClient, ApiResponse } from './api';
import { Project } from '@/types/projects';
import projectsData from '@/data/projects.json';

export interface ProjectFilters {
  category?: string;
  featured?: boolean;
  status?: string;
  skills?: string[];
}

export interface ProjectAnalytics {
  totalProjects: number;
  completedProjects: number;
  featuredProjects: number;
  categoryCounts: Record<string, number>;
  skillCounts: Record<string, number>;
}

export class ProjectService {
  private useApi: boolean;

  constructor(useApi: boolean = false) {
    this.useApi = useApi;
  }

  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    if (this.useApi) {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.category) queryParams.set('category', filters.category);
        if (filters?.featured !== undefined) queryParams.set('featured', String(filters.featured));
        if (filters?.status) queryParams.set('status', filters.status);
        if (filters?.skills?.length) queryParams.set('skills', filters.skills.join(','));

        const endpoint = `/api/projects${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response: ApiResponse<Project[]> = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        console.warn('API request failed, falling back to static data:', error);
        return this.getStaticProjects(filters);
      }
    }
    
    return this.getStaticProjects(filters);
  }

  private getStaticProjects(filters?: ProjectFilters): Project[] {
    let projects = projectsData as Project[];

    if (filters) {
      if (filters.category) {
        projects = projects.filter(p => p.category === filters.category);
      }
      if (filters.featured !== undefined) {
        projects = projects.filter(p => p.featured === filters.featured);
      }
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.skills?.length) {
        projects = projects.filter(p => 
          filters.skills!.some(skill => p.skills.includes(skill))
        );
      }
    }

    return projects;
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (this.useApi) {
      try {
        const response: ApiResponse<Project> = await apiClient.get(`/api/projects/${id}`);
        return response.data;
      } catch (error) {
        console.warn('API request failed, falling back to static data:', error);
      }
    }

    const projects = projectsData as Project[];
    return projects.find(p => p.id === id) || null;
  }

  async getProjectAnalytics(): Promise<ProjectAnalytics> {
    if (this.useApi) {
      try {
        const response: ApiResponse<ProjectAnalytics> = await apiClient.get('/api/projects/analytics');
        return response.data;
      } catch (error) {
        console.warn('API request failed, calculating static analytics:', error);
      }
    }

    return this.calculateStaticAnalytics();
  }

  private calculateStaticAnalytics(): ProjectAnalytics {
    const projects = projectsData as Project[];
    
    const categoryCounts: Record<string, number> = {};
    const skillCounts: Record<string, number> = {};

    projects.forEach(project => {
      // Count categories
      categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
      
      // Count skills
      project.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      featuredProjects: projects.filter(p => p.featured).length,
      categoryCounts,
      skillCounts
    };
  }

  async searchProjects(query: string): Promise<Project[]> {
    if (this.useApi) {
      try {
        const response: ApiResponse<Project[]> = await apiClient.get(`/api/projects/search?q=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        console.warn('API search failed, using static search:', error);
      }
    }

    // Static search implementation
    const projects = projectsData as Project[];
    const searchLower = query.toLowerCase();
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      project.category.toLowerCase().includes(searchLower)
    );
  }
}

// Export singleton instance
export const projectService = new ProjectService(
  process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_API === 'true'
);
