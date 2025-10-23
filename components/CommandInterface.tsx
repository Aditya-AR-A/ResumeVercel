"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewType } from './DynamicContentManager';
import { useRouter } from 'next/navigation';

interface CommandInterfaceProps {
  variant: 'navbar' | 'full';
  onViewChange?: (view: ViewType) => void;
  currentView?: ViewType;
  value?: string; // external controlled value
  onValueChange?: (v: string) => void; // external setter
}

const SECTION_ALIAS_MAP: Record<ViewType, string[]> = {
  home: ['home', 'main', 'start', 'landing'],
  projects: ['project', 'projects', 'portfolio', 'build', 'builds', 'work samples'],
  experience: ['experience', 'work', 'career', 'job', 'jobs', 'professional experience'],
  certificates: ['certificate', 'certificates', 'certs', 'certifications', 'credentials'],
  about: ['about', 'bio', 'me', 'profile'],
};

const NAVIGATION_PREFIX_PATTERN = /^(?:go to|goto|open|show|take me to|view|list|navigate to)\s+(.+)$/;

const normalizeCandidate = (input: string) => {
  return input
    .replace(/[^a-z\s]/gi, ' ')
    .replace(/\b(the|this|my)\b/gi, ' ')
    .replace(/\b(section|page|tab|area)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

const resolveViewFromCandidate = (candidate: string): ViewType | null => {
  const normalized = normalizeCandidate(candidate);
  if (!normalized) {
    return null;
  }

  for (const [view, aliases] of Object.entries(SECTION_ALIAS_MAP)) {
    if (aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias} `))) {
      return view as ViewType;
    }
  }

  return null;
};

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
  // Removed unused lastCommand state
  const router = useRouter();

  const handleExecute = () => {
    const rawCommand = input.trim();
    const command = rawCommand.toLowerCase();

    const redirectToSearch = () => {
      if (!rawCommand) {
        return;
      }
      let queryValue = rawCommand;
      const searchPrefix = rawCommand.match(/^(?:search|find|show)\s+(.+)/i);
      if (searchPrefix && searchPrefix[1]) {
        queryValue = searchPrefix[1];
      }
      router.push(`/search?query=${encodeURIComponent(queryValue.trim())}`);
      setInput('');
    };

    const determineViewTarget = (): ViewType | null => {
      const navMatch = command.match(NAVIGATION_PREFIX_PATTERN);

      if (navMatch && navMatch[1]) {
        return resolveViewFromCandidate(navMatch[1]);
      }

      const tokens = command.split(/\s+/).filter(Boolean);
      if (tokens.length <= 2) {
        return resolveViewFromCandidate(command);
      }

      return null;
    };

    const targetView = determineViewTarget();
    
    if (targetView) {
      if (onViewChange) {
        onViewChange(targetView);
      } else {
        document.getElementById(targetView)?.scrollIntoView({ behavior: 'smooth' });
      }
      setInput('');
      return;
    }

    redirectToSearch();
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
            placeholder={`Try: "show projects", "search python" | Current: ${currentView}`}
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
                <li>&quot;about me&quot; - Learn more about my background</li>
                <li>&quot;search python&quot; - Find everything related to a skill</li>
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
