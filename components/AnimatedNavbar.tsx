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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, height: 0 }}
          animate={{ y: 0, height: "auto" }}
          exit={{ y: -100, height: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
                {/* Sidebar toggle first */}
                <button
                  id="sidebar-inline-toggle"
                  onClick={() => document.getElementById('sidebar-toggle')?.click()}
                  className="p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Open menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-between">
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                    <span className="block h-0.5 bg-gray-700 dark:bg-gray-300" />
                  </div>
                </button>
                <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xl font-bold heading-gradient"
          layoutId="brand-name"
                >
          {brandName || 'Aditya AR'}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-1/2"
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
