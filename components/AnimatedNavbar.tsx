"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInterface from './CommandInterface';
import { ViewType } from './DynamicContentManager';

interface NavbarProps {
  isVisible: boolean;
  onViewChange?: (view: ViewType) => void;
  currentView?: ViewType;
  commandValue?: string;
  onCommandChange?: (v: string) => void;
  brandName?: string;
}

const AnimatedNavbar = ({ isVisible, onViewChange, currentView, commandValue, onCommandChange, brandName }: NavbarProps) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 35,
            opacity: { duration: 0.2 }
          }}
          className="fixed top-0 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg z-50"
        >
          <div className="container mx-auto px-3 sm:px-4 py-2">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Sidebar toggle first */}
                <button
                  id="sidebar-inline-toggle"
                  data-sidebar-toggle
                  onClick={() => window.dispatchEvent(new Event('sidebar:toggle'))}
                  className="p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                  aria-label="Open menu"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex flex-col justify-between">
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                  </div>
                </button>
                <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          className="hidden xs:block text-sm sm:text-base md:text-lg lg:text-xl font-bold heading-gradient whitespace-nowrap truncate max-w-[120px] sm:max-w-none"
          layoutId="brand-name"
                >
          {brandName || 'Aditya AR'}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                className="flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                layoutId="command-interface"
              >
                <CommandInterface 
                  variant="navbar" 
                  onViewChange={onViewChange}
                  currentView={currentView}
                  value={commandValue}
                  onValueChange={onCommandChange}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedNavbar;
