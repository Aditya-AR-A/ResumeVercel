/**
 * Individual Project API Route Handler
 * 
 * This Next.js API route provides a RESTful endpoint for retrieving a specific
 * project by its unique identifier. It supports the same hybrid data approach
 * as the main projects route, with automatic fallback capabilities.
 * 
 * Endpoint: GET /api/projects/{id}
 * 
 * Path Parameters:
 * - id: Unique identifier of the project (string)
 * 
 * Response Format (Success):
 * ```json
 * {
 *   "success": true,
 *   "data": Project,
 *   "message": "Project retrieved successfully"
 * }
 * ```
 * 
 * Response Format (Not Found):
 * ```json
 * {
 *   "success": false,
 *   "data": null,
 *   "message": "Project not found"
 * }
 * ```
 * 
 * Use Cases:
 * - Project detail pages
 * - Deep linking to specific projects
 * - Dynamic project content loading
 * - SEO-friendly project URLs
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/services/projectService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(id);
    
    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Project not found',
          data: null 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    });
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch project',
        data: null 
      },
      { status: 500 }
    );
  }
}
