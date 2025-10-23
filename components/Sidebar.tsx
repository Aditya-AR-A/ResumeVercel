"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { getAssetUrl } from '@/utils/assets';

interface SidebarProps {
  socialLinks: {
    email: string;
    github: string;
    linkedin: string;
  };
}

export default function Sidebar({ socialLinks }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resumeLink = getAssetUrl('resume.pdf');
  const pathname = usePathname();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      const sidebar = document.getElementById('sidebar');
      const toggleButtons = Array.from(document.querySelectorAll('[data-sidebar-toggle]')) as HTMLElement[];
      if (sidebar?.contains(target)) return; // inside sidebar
      if (toggleButtons.some(btn => btn.contains(target))) return; // clicked a toggle button
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleDocumentClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Explicit control helpers
  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  // Expose global custom event API so other components can trigger
  useEffect(() => {
    const handleOpen = () => openSidebar();
    const handleClose = () => closeSidebar();
    const handleToggle = () => toggleSidebar();
    window.addEventListener('sidebar:open', handleOpen);
    window.addEventListener('sidebar:close', handleClose);
    window.addEventListener('sidebar:toggle', handleToggle);
    return () => {
      window.removeEventListener('sidebar:open', handleOpen);
      window.removeEventListener('sidebar:close', handleClose);
      window.removeEventListener('sidebar:toggle', handleToggle);
    };
  }, []);

  // Emit event whenever state changes (optional listeners)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar:state', { detail: { isOpen } }));
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/experience', label: 'Experience' },
    { href: '/certificates', label: 'Certificates' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pt-20 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-900 dark:text-white hover:accent-cert transition-colors"
            >
              Aditya Raj
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Data Scientist & ML Engineer
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:accent-cert'
                    }`}
                  >
                    <span className="text-lg">{item.label}</span>
                    {isActive(item.href) && (
                      <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}
              
              {/* Theme Toggle */}
              <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </li>
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <svg width="16" height="16" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
            
            <div className="flex space-x-2">
              <a
                href={`mailto:${socialLinks.email}`}
                className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 group"
                aria-label="Email"
                title="Email"
              >
                <svg width="16" height="16" className="w-4 h-4 text-white group-hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 group"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg width="16" height="16" className="w-4 h-4 text-white group-hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-900 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-300 rounded-lg transition-colors duration-200 group"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg width="16" height="16" className="w-4 h-4 text-white dark:text-gray-900 group-hover:text-gray-200 dark:group-hover:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
