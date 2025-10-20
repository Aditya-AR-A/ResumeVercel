import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import CursorGradient from '@/components/CursorGradient'
import { ReactNode } from 'react'
import { dataApi } from '@/utils/api'
import type { IntroData } from '@/types/interfaces'
import VantaFog from '@/components/VantaFog'
import Section from '@/components/Section'
// Using inline SVGs for footer social links to match Sidebar styling

const inter = Inter({ subsets: ['latin'] })

interface LayoutConfig {
  metadata?: Partial<Metadata>
  viewport?: Partial<Viewport>
}

const FALLBACK_METADATA: Metadata = {
  title: 'Aditya Raj - Data Scientist & Python Developer',
  description:
    'Portfolio of Aditya Raj - Software developer and data scientist with expertise in full-stack development, deep learning, and machine learning.',
  keywords: [
    'Data Scientist',
    'Python Developer',
    'Machine Learning',
    'Deep Learning',
    'Full Stack Developer',
    'AI Developer',
    'Aditya Raj',
  ],
  authors: [{ name: 'Aditya Raj' }],
  creator: 'Aditya Raj',
  openGraph: {
    title: 'Aditya Raj - Data Scientist & Python Developer',
    description: 'Portfolio showcasing projects in data science, machine learning, and full-stack development.',
    url: 'https://theaditya.vercel.app',
    siteName: 'Aditya Raj Portfolio',
    images: [
      {
        url: 'https://avatars.githubusercontent.com/u/126697615?v=4',
        width: 1200,
        height: 630,
        alt: 'Aditya Raj - Data Scientist & Python Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Raj - Data Scientist & Python Developer',
    description: 'Portfolio showcasing projects in data science, machine learning, and full-stack development.',
    images: ['https://avatars.githubusercontent.com/u/126697615?v=4'],
  },
  robots: 'index, follow',
}

const FALLBACK_VIEWPORT: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const FALLBACK_SOCIAL_LINKS = {
  email: 'adityaraj.anshukumar50@gmail.com',
  github: 'https://github.com/Aditya-AR-A',
  linkedin: 'https://www.linkedin.com/in/aditya-raj-921a08352/'
}

let cachedLayout: LayoutConfig | null = null
let cachedSocialLinks: IntroData['socialLinks'] | null = null

async function loadLayoutConfig(): Promise<LayoutConfig | null> {
  if (cachedLayout) {
    return cachedLayout
  }

  try {
    const data = await dataApi.getLayout()
    if (data && typeof data === 'object') {
      cachedLayout = data as LayoutConfig
      return cachedLayout
    }
  } catch (error) {
    console.error('RootLayout: failed to fetch layout config', error)
  }

  return null
}

async function loadSocialLinks(): Promise<IntroData['socialLinks']> {
  if (cachedSocialLinks) {
    return cachedSocialLinks
  }

  try {
    const data = await dataApi.getIntro()
    if (data && typeof data === 'object' && 'socialLinks' in data) {
      cachedSocialLinks = (data as IntroData).socialLinks
      return cachedSocialLinks
    }
  } catch (error) {
    console.error('RootLayout: failed to fetch intro data', error)
  }

  return FALLBACK_SOCIAL_LINKS
}

export async function generateMetadata(): Promise<Metadata> {
  const layout = await loadLayoutConfig()
  return {
    ...FALLBACK_METADATA,
    ...(layout?.metadata ?? {}),
  }
}

export async function generateViewport(): Promise<Viewport> {
  const layout = await loadLayoutConfig()
  return {
    ...FALLBACK_VIEWPORT,
    ...(layout?.viewport ?? {}),
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const socialLinks = await loadSocialLinks()

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
          <Navbar />
          <Sidebar socialLinks={socialLinks} />
          <main className="relative mx-auto w-full max-w-[90%] overflow-x-hidden pt-24" style={{ zIndex: 10 }}>
            {children}
          </main>
          <footer className="relative mx-auto w-full max-w-[90%] pb-12">
            <Section
              background="gradient"
              className="mx-auto max-w-5xl"
              containerClassName="flex flex-col items-center gap-6 py-10 text-center"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
                  Stay Connected
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  &copy; 2025 Aditya Raj. All rights reserved.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:${socialLinks.email}`}
                  aria-label="Email"
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-900 transition hover:border-white/40 hover:bg-white/20 dark:text-white"
                >
                  <svg
                    width="20"
                    height="20"
                    className="transition group-hover:scale-105"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>

                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-blue-600 transition hover:border-white/40 hover:bg-white/20 dark:text-blue-400"
                >
                  <svg
                    width="20"
                    height="20"
                    className="transition group-hover:scale-105"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-900 transition hover:border-white/40 hover:bg-white/20 dark:text-white"
                >
                  <svg
                    width="20"
                    height="20"
                    className="transition group-hover:scale-105"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>

              <div className="text-[0.75rem] text-slate-500 dark:text-slate-400">
                Crafted with curiosity and a love for learning.
              </div>
            </Section>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
