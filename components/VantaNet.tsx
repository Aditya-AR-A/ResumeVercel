"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface VantaNetProps {
  className?: string;
  children?: React.ReactNode;
}

// Type for the global window with Vanta
declare global {
  interface Window {
    THREE: unknown;
    VANTA: {
      NET: (options: {
        el: HTMLElement;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        color?: number;
        backgroundColor?: number;
        points?: number;
        maxDistance?: number;
        spacing?: number;
      }) => {
        destroy: () => void;
        resize?: () => void;
      };
    };
  }
}

const VantaNet: React.FC<VantaNetProps> = ({ className = "", children }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<{ destroy: () => void; resize?: () => void } | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Load scripts dynamically
  useEffect(() => {
    setMounted(true);
    
    const loadScripts = async () => {
      try {
        // Check if already loaded
        if (window.THREE && window.VANTA && window.VANTA.NET) {
          setScriptsLoaded(true);
          return;
        }

        // Load Three.js
        if (!window.THREE) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
              console.log('Three.js loaded successfully');
              resolve();
            };
            script.onerror = () => {
              console.error('Failed to load Three.js');
              reject(new Error('Failed to load Three.js'));
            };
            document.head.appendChild(script);
          });
        }

        // Small delay to ensure Three.js is ready
        await new Promise(resolve => setTimeout(resolve, 300));

        // Load Vanta NET
        if (!window.VANTA || !window.VANTA.NET) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
              console.log('Vanta NET script loaded');
              // Wait a bit more for Vanta to initialize
              setTimeout(() => {
                if (window.VANTA && window.VANTA.NET) {
                  console.log('Vanta NET is available');
                  resolve();
                } else {
                  console.error('Vanta NET not available after loading');
                  reject(new Error('Vanta NET not available'));
                }
              }, 500);
            };
            script.onerror = () => {
              console.error('Failed to load Vanta NET');
              reject(new Error('Failed to load Vanta NET'));
            };
            document.head.appendChild(script);
          });
        }

        setScriptsLoaded(true);
        console.log('All Vanta scripts loaded successfully');
      } catch (error) {
        console.error('Error loading Vanta scripts:', error);
        setLoadingError(true);
      }
    };

    loadScripts();
  }, []);

  // Initialize Vanta effect
  useEffect(() => {
    if (!mounted || !scriptsLoaded || !vantaRef.current || loadingError) return;

    const initVanta = () => {
      try {
        // Destroy existing effect
        if (vantaEffect.current) {
          vantaEffect.current.destroy();
          vantaEffect.current = null;
        }

        // Check if Vanta NET is available
        if (!window.VANTA || !window.VANTA.NET) {
          console.error('Vanta NET not available for initialization');
          setLoadingError(true);
          return;
        }

        // Theme-based colors
        const isDark = resolvedTheme === 'dark';
        
        const config = {
          el: vantaRef.current!,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: isDark ? 0x3498db : 0x2563eb,
          backgroundColor: isDark ? 0x0f0f23 : 0xf8fafc,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00
        };

        console.log('Initializing Vanta NET with config:', config);
        vantaEffect.current = window.VANTA.NET(config);
        console.log('Vanta NET initialized successfully');

      } catch (error) {
        console.error('Error initializing Vanta NET:', error);
        setLoadingError(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initVanta, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mounted, scriptsLoaded, resolvedTheme, loadingError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
          vantaEffect.current = null;
        } catch (error) {
          console.error('Error destroying Vanta effect:', error);
        }
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect.current && vantaEffect.current.resize) {
        try {
          vantaEffect.current.resize();
        } catch (error) {
          console.error('Error resizing Vanta effect:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fallback background while loading
  const fallbackBg = resolvedTheme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

  return (
    <div
      ref={vantaRef}
      className={`${className} ${!scriptsLoaded || loadingError ? fallbackBg : ''}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100vh'
      }}
    >
      {children}
      
      {/* Loading indicator */}
      {!scriptsLoaded && !loadingError && mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm opacity-70">Loading NET animation...</p>
          </div>
        </div>
      )}
      
      {/* Error indicator */}
      {loadingError && (
        <div className="absolute top-4 right-4 text-xs opacity-50">
          NET animation unavailable
        </div>
      )}
    </div>
  );
};

export default VantaNet;