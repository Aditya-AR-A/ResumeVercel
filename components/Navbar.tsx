"use client";

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  // Listen for sidebar state (kept for potential future use)
  useEffect(() => {
  const handler = () => {};
    window.addEventListener('sidebar:state', handler as EventListener);
    return () => window.removeEventListener('sidebar:state', handler as EventListener);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 navbar-blur border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors ml-12 sm:ml-0">
            Aditya Raj
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/projects" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Projects
            </Link>
            <Link 
              href="/experience" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Experience
            </Link>
            <Link 
              href="/certificates" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Certificates
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          {/* Mobile area intentionally left empty: floating sidebar button remains the single source */}
          <div className="md:hidden" />
        </div>
      </div>

      {/* Mobile Menu (hidden by default - would need state management for full functionality) */}
      <div className="md:hidden hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/projects"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/experience"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Experience
          </Link>
          <Link
            href="/certificates"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Certificates
          </Link>
          <Link
            href="#contact"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  )
}
