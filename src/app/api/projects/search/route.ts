/**
 * Project Search API Route Handler
 * 
 * This Next.js API route provides full-text search capabilities across all
 * project data. It implements intelligent search algorithms that look across
 * project names, descriptions, skills, and categories.
 * 
 * Endpoint: GET /api/projects/search
 * 
 * Query Parameters:
 * - q: Search query string (required)
 * 
 * Search Algorithm:
 * - Case-insensitive text matching
 * - Searches across: name, description, skills, categories
 * - Partial word matching supported
 * - Results ranked by relevance (when using FastAPI backend)
 * 
 * Response Format (Success):
 * ```json
 * {
 *   "success": true,
 *   "data": Project[],
 *   "message": "Found X projects"
 * }
 * ```
 * 
 * Use Cases:
 * - Real-time search as user types
 * - Skill-based project discovery
 * - Content filtering and exploration
 * - SEO-friendly search pages
 * 
 * Performance Notes:
 * - Static search is performed client-side for speed
 * - API search supports advanced features like fuzzy matching
 * - Results are automatically cached for repeated queries
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
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Search query is required',
                    data: []
                },
                { status: 400 }
            );
        }

        const projects = await projectService.searchProjects(query);

        return NextResponse.json({
            success: true,
            data: projects,
            message: `Found ${projects.length} projects`
        });
    } catch (error) {
        console.error('Failed to search projects:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to search projects',
                data: []
            },
            { status: 500 }
        );
    }
}
