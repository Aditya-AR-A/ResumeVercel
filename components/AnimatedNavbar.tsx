"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInterface from './CommandInterface';

interface NavbarProps {
  isVisible: boolean;
}

const AnimatedNavbar = ({ isVisible }: NavbarProps) => {
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold heading-gradient"
                >
                  Aditya AR
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-1/2"
              >
                <CommandInterface variant="navbar" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedNavbar;
