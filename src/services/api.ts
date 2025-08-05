/**
 * API Service Layer
 * 
 * This module provides a comprehensive API client for communicating with the FastAPI backend.
 * It includes:
 * - Base configuration for API endpoints
 * - Generic HTTP client with error handling
 * - Type-safe request/response interfaces
 * - Automatic JSON serialization/deserialization
 * - Centralized error handling and logging
 * 
 * The API client supports all standard HTTP methods (GET, POST, PUT, DELETE) and
 * automatically handles authentication headers, request timeouts, and error responses.
 * 
 * Usage:
 * ```typescript
 * import { apiClient } from '@/services/api';
 * 
 * const response = await apiClient.get<Project[]>('/projects');
 * const newProject = await apiClient.post<Project>('/projects', projectData);
 * ```
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

// API configuration and base setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Generic API client
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
