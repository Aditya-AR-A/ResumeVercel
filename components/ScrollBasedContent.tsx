"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import CommandInterface from './CommandInterface';
import AnimatedNavbar from './AnimatedNavbar';
// Removed unused Hero import
import DynamicContentManager, { ViewType } from './DynamicContentManager';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

interface ScrollBasedContentProps {
  introData: IntroData;
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
}

const ScrollBasedContent: React.FC<ScrollBasedContentProps> = ({ 
  introData, 
  projects, 
  jobs, 
  certificates
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [commandInput, setCommandInput] = useState('');
  // Navbar visibility with hysteresis to prevent flicker near thresholds
  const [navVisible, setNavVisible] = useState(false);
  // Track refs for sections (including hero as index 0)
  const sectionRefs = useRef<HTMLElement[]>([]);
  
  // Define the sequence of views
  const viewSequence: ViewType[] = useMemo(() => ['home', 'about', 'experience', 'projects', 'certificates', 'contact'], []);
  
  const handleViewChange = (view: ViewType) => {
    // Optimistically set current view so UI highlights immediately
    if (view !== currentView) {
      setCurrentView(view);
    }
    const viewIndex = viewSequence.indexOf(view);
    if (viewIndex >= 0 && sectionRefs.current[viewIndex]) {
      sectionRefs.current[viewIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Fallback re-sync after scroll finishes (in case observer misses due to snap)
      setTimeout(() => {
        const el = sectionRefs.current[viewIndex];
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
            const ratio = visible / Math.min(vh, rect.height || vh);
          if (ratio >= 0.3 && currentView !== view) {
            setCurrentView(view);
          }
        }
      }, 400);
    }
  };

  // Visibility percentage based activation (choose section occupying largest portion of viewport)
  useEffect(() => {
    let ticking = false;
    const calcActive = () => {
      const vh = window.innerHeight || 1;
      let bestIdx = -1;
      let bestRatio = 0;
      sectionRefs.current.forEach((el, idx) => {
        if (!el) {
          return;
        }
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = visible / Math.min(vh, rect.height || vh);
        // Prefer higher ratio; in tie choose nearer to viewport center
        if (ratio > bestRatio + 0.001) {
          bestRatio = ratio;
          bestIdx = idx;
        } else if (Math.abs(ratio - bestRatio) <= 0.001 && ratio > 0) {
          const center = vh / 2;
          const elCenter = rect.top + rect.height / 2;
          const bestEl = sectionRefs.current[bestIdx];
          if (bestEl) {
            const bestRect = bestEl.getBoundingClientRect();
            const bestCenter = bestRect.top + bestRect.height / 2;
            if (Math.abs(elCenter - center) < Math.abs(bestCenter - center)) {
              bestIdx = idx;
            }
          }
        }
      });
      if (bestIdx >= 0) {
        const view = viewSequence[bestIdx];
        if (view && view !== currentView) {
          setCurrentView(view);
        }
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calcActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    // Initial calculation
    calcActive();
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [currentView, viewSequence]);

  // Body class to adjust styles (e.g., hide sidebar floating button)
  useEffect(() => {
    if (currentView !== 'home') {
      document.body.classList.add('navbar-active');
    } else {
      document.body.classList.remove('navbar-active');
    }
  }, [currentView]);

  // Compute navbar visibility based on hero visibility ratio (with hysteresis)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = sectionRefs.current[0];
        if (!hero) {
          return;
        }
        const vh = window.innerHeight || 1;
        const rect = hero.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = visible / Math.min(vh, rect.height || vh);
        // Hysteresis thresholds
        const SHOW_NAV = 0.35; // show when hero mostly off-screen
        const HIDE_NAV = 0.55; // hide when hero more visible again
        if (!navVisible && ratio < SHOW_NAV) {
          setNavVisible(true);
        } else if (navVisible && ratio > HIDE_NAV) {
          setNavVisible(false);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [navVisible]);

  return (
    <LayoutGroup id="app-shared-layout">
    <div className="scroll-smooth">
      <AnimatePresence>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: navVisible ? 0 : -100 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ pointerEvents: navVisible ? 'auto' : 'none' }}
        >
          <AnimatedNavbar 
            isVisible={navVisible} 
            onViewChange={handleViewChange}
            currentView={currentView}
            commandValue={commandInput}
            onCommandChange={setCommandInput}
            brandName={introData.name}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero + Interactive (combined) */}
      <motion.div
  ref={el => { if (el) { sectionRefs.current[0] = el; } }}
        data-view="home"
        className="min-h-screen snap-start"
        initial={false}
        animate={{ 
          opacity: currentView === 'home' ? 1 : 0.05,
          scale: currentView === 'home' ? 1 : 0.99,
          filter: currentView === 'home' ? 'blur(0px)' : 'blur(0.3px)'
        }}
        style={{ pointerEvents: 'auto' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <section className="h-[75vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                        Welcome to my portfolio
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Hi, I&apos;m{' '}
                      <motion.span className="heading-gradient" layoutId="brand-name">{introData.name}</motion.span>
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                      {introData.title}
                    </h2>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Certificates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">20+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">3+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">AI</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Specialist</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profile Image */}
                <div className="relative">
                  <picture>
                    <source srcSet="/default.png" type="image/png" />
                    <Image
                      src="/default.png"
                      alt="Profile Picture"
                      width={300}
                      height={300}
                      className="w-[300px] h-[300px] rounded-full shadow-lg mx-auto object-cover"
                      priority
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Section - 25vh */}
        <section className="h-[25vh] flex items-center bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Left Column - Description */}
                <div className="md:col-span-2 space-y-6">
                  <h2 className="text-3xl font-bold mb-4">Let&apos;s Explore Together</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    I&apos;m a passionate <strong>AI and Python Developer</strong> with expertise in building 
                    intelligent systems that solve real-world problems.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Scroll down or use commands to explore my work!
                  </p>
                </div>

                {/* Right Column - Command Interface */}
                {!navVisible && (
                  <motion.div 
                    layout 
                    layoutId="command-interface" 
                    className="w-full"
                    transition={{ layout: { duration: 0.55, ease: 'easeInOut' } }}
                  >
                    <CommandInterface 
                      variant="full"
                      onViewChange={handleViewChange}
                      currentView={currentView}
                      value={commandInput}
                      onValueChange={setCommandInput}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Sequential Content Sections (About .. Contact) */}
      {viewSequence.slice(1).map((view, idx) => {
        const sectionIndex = idx + 1; // offset for hero
        return (
          <motion.section
            key={view}
            ref={el => { if (el) sectionRefs.current[sectionIndex] = el; }}
            data-view={view}
            className="min-h-screen flex items-center justify-center snap-start overflow-hidden"
            initial={false}
            animate={{ 
              opacity: currentView === view ? 1 : 0.05,
              scale: currentView === view ? 1 : 0.99,
              filter: currentView === view ? 'blur(0px)' : 'blur(0.3px)'
            }}
            style={{ pointerEvents: 'auto' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-full"
              initial={false}
              animate={{ 
                y: currentView === view ? 0 : 10,
                scale: currentView === view ? 1 : 0.985,
                opacity: currentView === view ? 1 : 0.85
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <DynamicContentManager
                currentView={view}
                introData={introData}
                projects={projects}
                jobs={jobs}
                certificates={certificates}
              />
            </motion.div>
          </motion.section>
        );
      })}

      {/* Scroll Progress Indicator */}
  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="flex flex-col space-y-2">
          {viewSequence.map((view) => (
            <motion.div
              key={view}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                currentView === view 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => handleViewChange(view)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
  </div>
  </LayoutGroup>
  );
};

export default ScrollBasedContent;
