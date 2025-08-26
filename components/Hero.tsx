"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CommandInterface from './CommandInterface';
import Button from './Button';
import { IntroData } from '@/types/interfaces';

interface HeroProps {
  introData: IntroData;
  showCommand: boolean;
  commandValue: string;
  onCommandChange: (v: string) => void;
  onViewChange?: (view: 'home' | 'about' | 'experience' | 'projects' | 'certificates' | 'contact') => void;
}

interface StatDef {
  label: string;
  value: number;
  suffix?: string;
  accentClass?: string;
}

const STATS: StatDef[] = [
  { label: 'Certificates', value: 15, suffix: '+', accentClass: 'accent-cert' },
  { label: 'Projects', value: 20, suffix: '+', accentClass: 'accent-projects' },
  { label: 'Years Experience', value: 3, suffix: '+', accentClass: 'accent-experience' },
  { label: 'AI Specialist', value: 1, suffix: '', accentClass: 'accent-ai' }
];

const StatsGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [values, setValues] = useState<number[]>(() => STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Start animation for each stat with staggered timing
            STATS.forEach((stat, idx) => {
              const delay = idx * 200; // 200ms delay between each stat
              const duration = 1500; // 1.5s animation duration
              
              setTimeout(() => {
                const startTime = performance.now();
                const animate = (currentTime: number) => {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  
                  // Easing function for smooth animation
                  const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                  const currentValue = Math.round(easeOutCubic * stat.value);
                  
                  setValues(prev => {
                    const newValues = [...prev];
                    newValues[idx] = currentValue;
                    return newValues;
                  });
                  
                  if (progress < 1) {
                    requestAnimationFrame(animate);
                  }
                };
                requestAnimationFrame(animate);
              }, delay);
            });
            
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45, duration: 0.6 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-6"
    >
      {STATS.map((s, idx) => (
        <div key={s.label} className="text-center">
          <div className={`text-2xl md:text-3xl font-bold ${s.accentClass}`}>{values[idx]}{values[idx] === s.value ? s.suffix : ''}</div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

const Hero: React.FC<HeroProps> = ({ introData, showCommand, commandValue, onCommandChange, onViewChange }) => {
  const [hideHint, setHideHint] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 32) setHideHint(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timeout = setTimeout(() => setHideHint(true), 6000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timeout); };
  }, []);

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden layout-safe-pad py-12">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto w-full content-grid cols-responsive">
        {/* Image block first on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, type: 'spring', stiffness: 130 }}
          className="relative flex justify-center order-1 lg:order-2 -mt-2 mb-4 lg:mb-0"
        >
          <div className="relative w-full flex items-center justify-center mx-auto max-w-[220px] sm:max-w-[260px] lg:max-w-[360px]">
            <div className="absolute -inset-3 sm:-inset-4 md:-inset-5 lg:-inset-6 rounded-3xl bg-[radial-gradient(circle_at_32%_30%,var(--accent-gradient-start)_0%,transparent_65%)] opacity-55 blur-xl" />
            <Image
              src={introData.profileImage?.src || 'https://avatars.githubusercontent.com/u/126697615?v=4'}
              alt={introData.profileImage?.alt || 'Portrait of ' + introData.name}
              width={320}
              height={320}
              priority
              className="relative rounded-3xl shadow-xl ring-1 sm:ring-2 ring-[color-mix(in_srgb,var(--accent-gradient-mid)_35%,transparent)] object-cover w-full aspect-square"
            />
          </div>
        </motion.div>

        {/* Text block second on mobile, first on large */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-2 h-8 brand-gradient-bar rounded-full"></div>
              <span className="intro-badge">Welcome to my portfolio</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
            >
              Hi, I&apos;m <span className="heading-gradient inline-block">{introData.name}</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium"
            >
              {introData.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-700 dark:text-gray-300 max-w-xl"
            >
              {introData.about}
            </motion.p>
          </div>

          <StatsGrid />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button className="btn-primary" onClick={() => onViewChange?.('projects')}>View Projects</Button>
            <Button className="btn-secondary" onClick={() => onViewChange?.('experience')}>Experience</Button>
            <Button className="btn-secondary" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</Button>
            <Button className="btn-secondary" onClick={() => onViewChange?.('contact')}>Contact</Button>
          </motion.div>

          {showCommand && (
            <motion.div
              layoutId="command-interface"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: 'spring', stiffness: 250, damping: 28 }}
              className="max-w-xl"
            >
              <CommandInterface
                variant="full"
                currentView={'home'}
                onViewChange={onViewChange}
                value={commandValue}
                onValueChange={onCommandChange}
              />
            </motion.div>
          )}
        </div>

  {/* (Image block moved above for mobile; removed duplicate here) */}
      </div>

      <motion.button
        aria-label="Scroll to explore"
        onClick={() => onViewChange?.('about')}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hideHint ? 0 : 0.9, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <span className="text-xs tracking-wider uppercase mb-1">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-5 h-5 border-b-2 border-r-2 rotate-45 border-current"
        />
      </motion.button>
    </div>
  );
};

export default Hero;
