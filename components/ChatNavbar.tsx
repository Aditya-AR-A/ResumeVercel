"use client";

import React, { useState, useEffect } from 'react';
import CommandInterface from './CommandInterface';

const ChatNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Height of the landing section (hero + chat sections = 100vh)
      const landingHeight = window.innerHeight;
      
      if (window.scrollY > landingHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg z-50 animate-[slideDown_0.3s_ease-out]">
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <CommandInterface variant="navbar" />
        </div>
      </div>
    </div>
  );
};

export default ChatNavbar;
