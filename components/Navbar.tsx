"use client";

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CommandInterface from './CommandInterface'
import type { ViewType } from './DynamicContentManager'
import { getAssetUrl } from '@/utils/assets'

const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const resumeLink = useMemo(() => getAssetUrl('resume.pdf'), [])

  const [isScrolled, setIsScrolled] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isCommandOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCommandOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandOpen])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    if (isCommandOpen) {
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
  }, [isCommandOpen])

  const handleCommandViewChange = (view: ViewType) => {
    const routeMap: Partial<Record<ViewType, string>> = {
      home: '/',
      projects: '/projects',
      experience: '/experience',
  certificates: '/certificates',
      about: '/#about',
    }

    const target = routeMap[view]
    if (target) {
      router.push(target)
    }

    setIsCommandOpen(false)
  }

  const isActiveLink = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pointer-events-auto fixed left-0 right-0 top-0 z-50"
      >
        <div className="pt-4">
          <div className="container mx-auto px-0">
            <div
              className={`relative flex w-full items-center justify-between gap-6 rounded-2xl border border-[var(--color-border)] px-5 py-3 transition-all duration-300 navbar-blur ${
                isScrolled
                  ? 'shadow-[0_20px_70px_rgba(15,23,42,0.28)]'
                  : 'shadow-[0_10px_45px_rgba(15,23,42,0.18)]'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  id="sidebar-inline-toggle"
                  data-sidebar-toggle
                  onClick={() => window.dispatchEvent(new Event('sidebar:toggle'))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] text-text transition hover:brightness-105"
                  aria-label="Toggle sidebar"
                >
                  <span className="sr-only">Toggle sidebar</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                </button>

                <Link href="/" className="heading-gradient text-lg font-semibold sm:text-xl">
                  Aditya Raj
                </Link>
              </div>

              <div className="hidden items-center gap-6 md:flex">
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition duration-200 ${
                        isActiveLink(link.href)
                          ? 'text-textStrong'
                          : 'text-textMuted hover:text-textStrong'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {isActiveLink(link.href) && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-2 text-sm font-medium text-text transition hover:brightness-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                  Command
                </button>
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.35)] transition hover:shadow-[0_20px_45px_rgba(59,130,246,0.45)]"
                >
                  Resume
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isCommandOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-2xl dark:bg-slate-950/80"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Command Palette</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Type a command like “show projects” or “contact me”.</p>
                </div>
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-slate-500 transition hover:border-white/30 hover:bg-white/20 dark:text-slate-300"
                  aria-label="Close command palette"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 6l12 12" />
                    <path d="M6 18L18 6" />
                  </svg>
                </button>
              </div>
              <CommandInterface variant="full" onViewChange={handleCommandViewChange} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
