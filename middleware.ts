import { NextRequest, NextResponse } from 'next/server';

const parseOrigin = (value?: string | null) => {
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch (error) {
    console.warn('middleware: failed to parse origin', value, error);
    return value;
  }
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiOrigin = parseOrigin(apiUrl) || 'http://localhost:8000';
const assetOrigin = parseOrigin(process.env.NEXT_PUBLIC_ASSET_BASE_URL) || apiOrigin;

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  const imgSrcValues = new Set(["'self'", 'data:', 'https:']);
  [apiOrigin, assetOrigin].forEach((origin) => {
    if (origin && origin !== "'self'" && origin !== 'data:' && origin !== 'https:') {
      imgSrcValues.add(origin);
    }
  });

  const frameSrcValues = new Set(["'self'"]);
  [apiOrigin, assetOrigin].forEach((origin) => {
    if (origin && origin !== "'self'") {
      frameSrcValues.add(origin);
    }
  });

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${Array.from(imgSrcValues).join(' ')}`,
    `frame-src ${Array.from(frameSrcValues).join(' ')}`,
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin} ws://localhost:3000 ws://127.0.0.1:3000 wss://*`,
  ];

  response.headers.set('Content-Security-Policy', `${cspDirectives.join('; ')};`);

  const formatPermissionOrigin = (origin: string) => {
    if (origin === 'self') {
      return 'self';
    }
    if (/^https?:\/\//i.test(origin)) {
      return `"${origin}"`;
    }
    return origin;
  };

  const fullscreenAllowList = new Set<string>(['self']);
  [apiOrigin, assetOrigin].forEach((origin) => {
    if (origin && origin !== 'self') {
      fullscreenAllowList.add(origin);
    }
  });

  const permissionsPolicyDirectives = [`fullscreen=(${Array.from(fullscreenAllowList).map(formatPermissionOrigin).join(' ')})`];
  response.headers.set('Permissions-Policy', permissionsPolicyDirectives.join(', '));

  // API rate limiting (basic implementation)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    // Add your rate limiting logic here
    console.log(`API request from IP: ${ip} to ${request.nextUrl.pathname}`);
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
