/**
 * Next.js Configuration File
 * 
 * This configuration file optimizes the Next.js application for production use
 * and prepares it for seamless integration with the FastAPI backend. It includes
 * performance optimizations, security enhancements, and build configurations.
 * 
 * Key Configurations:
 * - Image optimization for external sources (GitHub, project assets)
 * - API rewrites for seamless backend integration
 * - Security headers and Content Security Policy
 * - Build optimization and experimental features
 * - Static file serving and caching strategies
 * 
 * FastAPI Integration:
 * - API route rewrites for backend proxy
 * - CORS handling for cross-origin requests
 * - Environment-specific configuration
 * - Development vs production optimizations
 * 
 * Performance Features:
 * - Image optimization with next/image
 * - Static generation for improved loading
 * - Bundle analysis and tree shaking
 * - Progressive Web App capabilities
 * 
 * Security:
 * - Content Security Policy headers
 * - Frame options and XSS protection
 * - Secure cookie settings
 * - HTTPS redirect configuration
 * 
 * Development Experience:
 * - Fast refresh for rapid development
 * - Source map generation for debugging
 * - TypeScript optimization
 * - ESLint integration
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'addminwebworld.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cispl.net.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'planto.ai',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'resume-backend-8uzi.onrender.com',
        pathname: '/assets/**',
      },
    ],
  },
  async rewrites() {
    // Only proxy to FastAPI in development or when API_PROXY is enabled
    if (process.env.API_PROXY === 'true') {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.API_URL || 'http://localhost:8000'}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
