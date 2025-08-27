import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import CursorGradient from '@/components/CursorGradient'
import { ReactNode } from 'react'
import layoutData from '@/data/layout.json';
import { loadJson } from '@/utils/loadJson';
import { IntroData } from '@/types/interfaces';
import VantaFog from '@/components/VantaFog';
// Using inline SVGs for footer social links to match Sidebar styling

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = layoutData.metadata;
export const viewport = layoutData.viewport;

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // Hardcoded social links since we removed introData loading
  const socialLinks = {
    email: "adityaraj.anshukumar50@gmail.com",
    github: "https://github.com/Aditya-AR-A",
    linkedin: "https://www.linkedin.com/in/aditya-raj-921a08352/"
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen overflow-x-hidden`}>
        <CursorGradient />
        <ThemeProvider>
          {/* Global animated fog background */}
          <VantaFog className="fixed inset-0 -z-10" />
          <Sidebar socialLinks={socialLinks} />
          <main className="relative w-full max-w-[90%] mx-auto overflow-x-hidden" style={{ zIndex: 10 }}>
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-[90%] mx-auto px-4 text-center">
              <p className="text-sm sm:text-base">&copy; 2025 Aditya Raj. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-5 flex-wrap">
                {/* Email */}
                <a
                  href={`mailto:${socialLinks.email}`}
                  aria-label="Email"
                  className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 group"
                >
                  <svg width="20" height="20" className="text-white group-hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 group"
                >
                  <svg width="20" height="20" className="text-white group-hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* GitHub */}
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex items-center justify-center w-10 h-10 bg-gray-900 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300 rounded-lg transition-colors duration-200 group"
                >
                  <svg width="20" height="20" className="text-white dark:text-gray-900 group-hover:text-gray-200 dark:group-hover:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
