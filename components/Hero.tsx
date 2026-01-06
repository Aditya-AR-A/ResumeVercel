"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CommandInterface from './CommandInterface';
import Button from './Button';
import { IntroData } from '@/types/interfaces';
import { getAssetUrl } from '@/utils/assets';

interface HeroProps {
  introData: IntroData;
  showCommand: boolean;
  commandValue: string;
  onCommandChange: (v: string) => void;
  onViewChange?: (view: 'home' | 'about' | 'experience' | 'projects' | 'certificates') => void;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.6 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
    >
      {STATS.map((s, idx) => (
        <div key={s.label} className="text-center p-2 sm:p-0">
          <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${s.accentClass}`}>{values[idx]}{values[idx] === s.value ? s.suffix : ''}</div>
          <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

const Hero: React.FC<HeroProps> = ({ introData, showCommand, commandValue, onCommandChange, onViewChange }) => {
  const [hideHint, setHideHint] = useState(false);

  const resumeLink = getAssetUrl('resume.pdf');

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 32) setHideHint(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timeout = setTimeout(() => setHideHint(true), 6000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timeout); };
  }, []);

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 sm:gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        {/* Image block first on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, type: 'spring', stiffness: 130 }}
          className="order-1 -mt-2 mb-4 flex justify-center lg:order-2 lg:mb-0"
        >
          <div className="relative mx-auto flex w-full max-w-[200px] items-center justify-center sm:max-w-[240px] md:max-w-[280px] lg:max-w-[360px]">
            <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 lg:-inset-6 rounded-2xl sm:rounded-3xl bg-[radial-gradient(circle_at_32%_30%,var(--accent-gradient-start)_0%,transparent_65%)] opacity-55 blur-lg sm:blur-xl" />
            <Image
              src={introData.profileImage?.src || 'https://avatars.githubusercontent.com/u/126697615?v=4'}
              alt={introData.profileImage?.alt || 'Portrait of ' + introData.name}
              width={320}
              height={320}
              sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1280px) 280px, 360px"
              priority
              className="relative rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl ring-1 sm:ring-2 ring-[color-mix(in_srgb,var(--accent-gradient-mid)_35%,transparent)] object-cover w-full aspect-square"
            />
          </div>
        </motion.div>

        {/* Text block second on mobile, first on large */}
  <div className="order-2 space-y-6 sm:space-y-8 lg:order-1 lg:max-w-2xl">
          <div className="space-y-3 sm:space-y-4">
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
            <Button className="btn-secondary" href={resumeLink} target="_blank" rel="noopener noreferrer">Resume</Button>
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
