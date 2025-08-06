import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aditya Raj - Data Scientist & Python Developer',
  description: 'Portfolio of Aditya Raj - Software developer and data scientist with expertise in full-stack development, deep learning, and machine learning.',
  keywords: [
    'Data Scientist',
    'Python Developer',
    'Machine Learning',
    'Deep Learning',
    'Full Stack Developer',
    'AI Developer',
    'Aditya Raj'
  ],
  authors: [{ name: 'Aditya Raj' }],
  creator: 'Aditya Raj',
  openGraph: {
    title: 'Aditya Raj - Data Scientist & Python Developer',
    description: 'Portfolio showcasing projects in data science, machine learning, and full-stack development.',
    url: 'https://your-domain.vercel.app',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Aditya Raj. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a 
                href="https://github.com/Aditya-AR-A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/aditya-raj-921a08352/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="mailto:adityaraj.anshukumar50@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
