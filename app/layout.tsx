import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ReactNode } from 'react'
import layoutData from '@/data/layout.json';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = layoutData.metadata;
export const viewport = layoutData.viewport;

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const contactLinks = layoutData.contact;

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
              {contactLinks.map((link) => (
                <a 
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.className}
                >
                  <Image
                    src={link.icon}
                    alt={link.platform}
                    width={24}
                    height={24}
                    className="inline-block mr-2"
                  />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
