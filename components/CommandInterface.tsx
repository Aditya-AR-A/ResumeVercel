"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewType } from './DynamicContentManager';

interface CommandInterfaceProps {
  variant: 'navbar' | 'full';
  onViewChange?: (view: ViewType) => void;
  currentView?: ViewType;
  value?: string; // external controlled value
  onValueChange?: (v: string) => void; // external setter
}

const CommandInterface: React.FC<CommandInterfaceProps> = ({ variant, onViewChange, currentView = 'home', value, onValueChange }) => {
  const isControlled = typeof value === 'string' && typeof onValueChange === 'function';
  const [uncontrolled, setUncontrolled] = useState('');
  const input = isControlled ? value! : uncontrolled;
  const setInput = (v: string) => {
    if (isControlled) {
      onValueChange!(v);
    } else {
      setUncontrolled(v);
    }
  };
  const [lastCommand, setLastCommand] = useState('');

  const handleExecute = () => {
    const command = input.toLowerCase().trim();
    setLastCommand(command);
    
    if (!onViewChange) {
      // Fallback to old scroll behavior if no view change handler
      if (command.includes('project')) {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('experience')) {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('certificate')) {
        document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('contact')) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Dynamic view switching
    if (command.includes('project')) {
      onViewChange('projects');
    } else if (command.includes('experience') || command.includes('work')) {
      onViewChange('experience');
    } else if (command.includes('certificate') || command.includes('cert')) {
      onViewChange('certificates');
    } else if (command.includes('contact') || command.includes('email')) {
      onViewChange('contact');
    } else if (command.includes('about') || command.includes('me') || command.includes('bio')) {
      onViewChange('about');
    } else if (command.includes('home') || command.includes('main') || command.includes('start')) {
      onViewChange('home');
    } else {
      // If command doesn't match, show a helpful message
      setInput(`Try: "show projects", "about me", "contact me"`);
      setTimeout(() => setInput(''), 2000);
      return;
    }
    
  setInput(''); // Clear input after successful command (works for controlled & uncontrolled)
  };

  return (
    <motion.div
      layout
      layoutId="command-interface"
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={variant === 'navbar' ? 'w-full' : 'w-full'}
    >
      {variant === 'navbar' ? (
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder={`Try: "show projects", "about me" | Current: ${currentView}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            onClick={handleExecute}
          >
            Execute
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-full space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              placeholder="Try these commands..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Available commands:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>&quot;show projects&quot; - View my featured projects</li>
                <li>&quot;show experience&quot; - View my work experience</li>
                <li>&quot;show certificates&quot; - View my certifications</li>
                <li>&quot;contact me&quot; - Get my contact information</li>
                <li>&quot;about me&quot; - Learn more about my background</li>
                <li>&quot;skills&quot; - View my technical skills</li>
              </ul>
            </div>
            <button
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleExecute}
            >
              Execute
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
};

export default CommandInterface;
