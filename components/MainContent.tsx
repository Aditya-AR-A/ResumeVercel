"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInterface from './CommandInterface';
import AnimatedNavbar from './AnimatedNavbar';
import DynamicContentManager, { ViewType } from './DynamicContentManager';
import { Project, Job, Certificate, IntroData } from '@/types/interfaces';

interface MainContentProps {
  introData: IntroData;
  projects: Project[];
  jobs: Job[];
  certificates: Certificate[];
}

const MainContent: React.FC<MainContentProps> = ({ 
  introData, 
  projects, 
  jobs, 
  certificates
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.8; // Later threshold for stability
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <>
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <AnimatedNavbar 
              isVisible={isScrolled} 
              onViewChange={handleViewChange}
              currentView={currentView}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen"
        animate={{
          height: isScrolled ? 0 : "100vh",
          opacity: isScrolled ? 0 : 1
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
        style={{ overflow: "hidden" }}
      >
        {/* Hero Section Content - 75vh */}
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
                      <span className="heading-gradient">Aditya AR</span>
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                      AI & Python Developer
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
                  <Image
                    src="/default.png"
                    alt="/default.png"
                    width={300}
                    height={300}
                    className="w-[300px] h-[300px] rounded-full shadow-lg mx-auto object-cover"
                    priority
                  />
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
                    Type a command to explore my work, skills, or start a conversation!
                  </p>
                </div>

                {/* Right Column - Command Interface */}
                <motion.div layoutId="command-interface" className="w-full">
                  <CommandInterface 
                    variant="full" 
                    onViewChange={handleViewChange}
                    currentView={currentView}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Dynamic Content Area */}
      <DynamicContentManager
        currentView={currentView}
        introData={introData}
        projects={projects}
        jobs={jobs}
        certificates={certificates}
      />
    </>
  );
};

export default MainContent;
