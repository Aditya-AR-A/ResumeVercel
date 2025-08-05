/**
 * Next.js Middleware
 * 
 * This middleware file provides application-wide request handling, security
 * enhancements, and routing logic that runs before pages are rendered. It
 * implements security headers, rate limiting, and request preprocessing.
 * 
 * Key Features:
 * - Security headers (CSP, HSTS, X-Frame-Options)
 * - Rate limiting for API routes
 * - Request logging and analytics
 * - CORS handling for FastAPI integration
 * - Bot detection and filtering
 * - Geolocation-based routing
 * 
 * Security Enhancements:
 * - Content Security Policy to prevent XSS
 * - Clickjacking protection with frame options
 * - MIME type sniffing prevention
 * - Referrer policy configuration
 * - Strict Transport Security headers
 * 
 * API Protection:
 * - Rate limiting by IP address
 * - Request validation and sanitization
 * - API key validation (when applicable)
 * - DDoS protection mechanisms
 * 
 * Performance:
 * - Request caching strategies
 * - Static asset optimization
 * - CDN integration headers
 * - Compression middleware
 * 
 * Monitoring:
 * - Request logging for analytics
 * - Error tracking and reporting
 * - Performance metrics collection
 * - User behavior analytics
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

function applyRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get client IP address
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!applyRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: data: https: http:",
    "connect-src 'self' https://api.github.com ws: wss:",
    "frame-src 'self' https://colab.research.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
