"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import CommandInterface from './CommandInterface';
import Button from './Button';
import { IntroData } from '@/types/interfaces';

interface HeroProps {
  introData: IntroData;
  showCommand: boolean;
  commandValue: string;
  onCommandChange: (v: string) => void;
  onViewChange?: (view: any) => void;
}

interface StatDef {
  label: string;
  value: number;
  suffix?: string;
  accentClass?: string;
}

const stats: StatDef[] = [
  { label: 'Certificates', value: 15, suffix: '+', accentClass: 'text-blue-600 dark:text-blue-400' },
  { label: 'Projects', value: 20, suffix: '+', accentClass: 'text-purple-600 dark:text-purple-400' },
  { label: 'Years Experience', value: 3, suffix: '+', accentClass: 'text-green-600 dark:text-green-400' },
  { label: 'AI Specialist', value: 1, suffix: '', accentClass: 'text-orange-600 dark:text-orange-400' }
];

const useCountUp = (end: number, startDelay = 0) => {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px', amount: 0.4 });

  useEffect(() => {
    if (!startedRef.current && inView) {
      startedRef.current = true;
      const duration = 1100; // ms
      const start = performance.now() + startDelay;
      const step = (t: number) => {
        if (t < start) {
          requestAnimationFrame(step);
          return;
        }
        const progress = Math.min(1, (t - start) / duration);
        setVal(Math.round(progress * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [inView, end, startDelay]);

  return { ref, val } as const;
};

const Hero: React.FC<HeroProps> = ({ introData, showCommand, commandValue, onCommandChange, onViewChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hideHint, setHideHint] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 32) setHideHint(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timeout = setTimeout(() => setHideHint(true), 6000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timeout); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spot-x', `${x}px`);
    el.style.setProperty('--spot-y', `${y}px`);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col justify-center min-h-screen overflow-hidden px-4 py-8"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950" />
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(600px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(99,102,241,0.18), transparent 70%)'
      }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Welcome to my portfolio
              </span>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((s, idx) => {
              const { ref, val } = useCountUp(s.value, idx * 120);
              return (
                <div key={s.label} className="text-center">
                  <div ref={ref as any} className={`text-2xl md:text-3xl font-bold ${s.accentClass}`}>{val}{val === s.value ? s.suffix : ''}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              );
            })}
          </motion.div>

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

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, type: 'spring', stiffness: 120 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-3xl animate-pulse-slow" />
            <Image
              src={introData.profileImage?.src || '/default.png'}
              alt={introData.profileImage?.alt || 'Portrait of ' + introData.name}
              width={360}
              height={360}
              priority
              className="relative rounded-full shadow-xl ring-4 ring-white/50 dark:ring-gray-800/60 object-cover aspect-square"
            />
          </div>
        </motion.div>
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
