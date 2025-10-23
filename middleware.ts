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

const resolveDefaultApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://resume-backend-8uzi.onrender.com';
  }

  return 'http://localhost:8000';
};

// Ensure CSP reflects the same base URL logic as the API client helper
const apiUrl = resolveDefaultApiUrl();
const defaultOrigin = process.env.NODE_ENV === 'production'
  ? 'https://resume-backend-8uzi.onrender.com'
  : 'http://localhost:8000';

const apiOrigin = parseOrigin(apiUrl) || defaultOrigin;
const assetOrigin = parseOrigin(process.env.NEXT_PUBLIC_ASSET_BASE_URL) || apiOrigin;

const TABLEAU_ORIGINS = ['https://public.tableau.com', 'http://public.tableau.com'];

const THIRD_PARTY_SCRIPT_ORIGINS = [
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
  ...TABLEAU_ORIGINS,
];

const THIRD_PARTY_FRAME_ORIGINS = [...TABLEAU_ORIGINS];

const THIRD_PARTY_IMAGE_ORIGINS = [...TABLEAU_ORIGINS];

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  const imgSrcValues = new Set(["'self'", 'data:', 'https:']);
  [apiOrigin, assetOrigin, ...THIRD_PARTY_IMAGE_ORIGINS].forEach((origin) => {
    if (origin && origin !== "'self'" && origin !== 'data:' && origin !== 'https:') {
      imgSrcValues.add(origin);
    }
  });

  const frameSrcValues = new Set(["'self'"]);
  [apiOrigin, assetOrigin, ...THIRD_PARTY_FRAME_ORIGINS].forEach((origin) => {
    if (origin && origin !== "'self'") {
      frameSrcValues.add(origin);
    }
  });

  const scriptSrcValues = new Set(["'self'", "'unsafe-eval'", "'unsafe-inline'", ...THIRD_PARTY_SCRIPT_ORIGINS]);

  const cspDirectives = [
    "default-src 'self'",
  `script-src ${Array.from(scriptSrcValues).join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${Array.from(imgSrcValues).join(' ')}`,
    `frame-src ${Array.from(frameSrcValues).join(' ')}`,
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin} ${TABLEAU_ORIGINS.join(' ')} ws://localhost:3000 ws://127.0.0.1:3000 wss://*`,
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
  [apiOrigin, assetOrigin, ...TABLEAU_ORIGINS].forEach((origin) => {
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
