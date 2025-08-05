/**
 * Projects API Route Handler
 * 
 * This Next.js API route provides a RESTful endpoint for retrieving project data.
 * It serves as a proxy layer between the frontend and the FastAPI backend,
 * with built-in fallback to static data when the backend is unavailable.
 * 
 * Endpoint: GET /api/projects
 * 
 * Supported Query Parameters:
 * - category: Filter by project category (e.g., "Machine Learning", "Web Development")
 * - featured: Filter by featured status (true/false)
 * - status: Filter by project status (e.g., "completed", "in-progress")
 * - skills: Comma-separated list of skills to filter by
 * 
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": Project[],
 *   "message": "Projects retrieved successfully"
 * }
 * ```
 * 
 * Error Handling:
 * - Graceful degradation to static data if backend fails
 * - Comprehensive error logging for debugging
 * - Standardized error response format
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/services/projectService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      status: searchParams.get('status') || undefined,
      skills: searchParams.get('skills')?.split(',').filter(Boolean) || undefined,
    };

    const projects = await projectService.getProjects(filters);
    
    return NextResponse.json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully'
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch projects',
        data: [] 
      },
      { status: 500 }
    );
  }
}
