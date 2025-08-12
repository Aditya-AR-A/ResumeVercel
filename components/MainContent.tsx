"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInterface from './CommandInterface';
import AnimatedNavbar from './AnimatedNavbar';

const MainContent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.5; // Adjusted threshold
      if (scrolled !== isScrolled && !isAnimating) {
        setIsAnimating(true);
        setIsScrolled(scrolled);
        setTimeout(() => setIsAnimating(false), 500); // Reduced animation duration
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled, isAnimating]);

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
            <AnimatedNavbar isVisible={isScrolled} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="h-[67vh] flex items-center"
        animate={{
          height: isScrolled ? 0 : "67vh",
          opacity: isScrolled ? 0 : 1
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Hero Section Content */}
      </motion.div>

      <motion.div
        className="h-[33vh] flex items-center"
        animate={{
          height: isScrolled ? 0 : "33vh",
          opacity: isScrolled ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.div layoutId="command-interface" className="w-full">
          <CommandInterface variant={isScrolled ? "navbar" : "full"} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default MainContent;
