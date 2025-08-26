"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Script from 'next/script';

// Minimal global typing for Vanta
declare global {
  interface Window {
    VANTA?: {
      FOG: (options: Record<string, unknown>) => { destroy: () => void; resize?: () => void }
    }
  }
}

interface VantaFogProps {
  className?: string;
  children?: React.ReactNode;
}

const VantaFog: React.FC<VantaFogProps> = ({ className = "", children }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<{ destroy: () => void; resize?: () => void } | null>(null);
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThreeLoaded = () => {
    console.log('Three.js loaded via Script component');
  };

  const handleVantaLoaded = () => {
    console.log('Vanta FOG loaded via Script component');
    setTimeout(() => {
      const fogFn = window.VANTA?.FOG;
      if (typeof fogFn === 'function') {
        setScriptsLoaded(true);
        console.log('Vanta FOG is ready');
      } else {
        console.error('Vanta FOG not available after script load');
        setLoadingError(true);
      }
    }, 500);
  };

  const handleScriptError = (scriptName: string) => {
    console.error(`Failed to load ${scriptName}`);
    setLoadingError(true);
  };

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

  // Check if Vanta FOG is available
  if (typeof window.VANTA?.FOG !== 'function') {
          console.error('Vanta FOG not available for initialization');
          setLoadingError(true);
          return;
        }

        // Theme-aware color palettes
  const isLight = actualTheme === 'light';
        const colorPalette = isLight
          ? {
              // Light theme colors you requested
              highlightColor: 0xffbc00,
              midtoneColor: 0xff1c00,
              lowlightColor: 0x2c00ff,
              baseColor: 0xffffff,
            }
          : {
              // Original dark theme colors
              highlightColor: 0xfff0,
              midtoneColor: 0x3026d9,
              lowlightColor: 0x180766,
              baseColor: 0x000000,
            };

        const config = {
          el: vantaRef.current!,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          ...colorPalette,
          blurFactor: 0.52,
          speed: 0.70,
          zoom: 1.70,
        };

        console.log('Initializing Vanta FOG with config:', config);
  vantaEffect.current = window.VANTA!.FOG(config);
        console.log('Vanta FOG initialized successfully');

      } catch (error) {
        console.error('Error initializing Vanta FOG:', error);
        setLoadingError(true);
      }
    };

    const timeoutId = setTimeout(initVanta, 200);
    return () => clearTimeout(timeoutId);
  }, [mounted, scriptsLoaded, actualTheme, loadingError]);

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

  const fallbackBg = actualTheme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

  return (
    <>
      {/* Load scripts using Next.js Script component */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        onLoad={handleThreeLoaded}
        onError={() => handleScriptError('Three.js')}
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        onLoad={handleVantaLoaded}
        onError={() => handleScriptError('Vanta FOG')}
        strategy="afterInteractive"
      />

      {/* If caller supplies fixed/absolute positioning in className, don't set layout-affecting dimensions */}
      <div
        ref={vantaRef}
        className={`${className} ${!scriptsLoaded || loadingError ? fallbackBg : ''}`}
        style={(() => {
          const style: React.CSSProperties = {};
          const isOverlay = /(fixed|absolute)/.test(className);
          if (!isOverlay) {
            style.width = '100%';
            style.minHeight = '100vh';
          }
          return style;
        })()}
      >
        {children}
        
        {/* Loading indicator */}
        {!scriptsLoaded && !loadingError && mounted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm opacity-70">Loading FOG animation...</p>
            </div>
          </div>
        )}
        
        {/* Error indicator */}
        {loadingError && (
          <div className="absolute top-4 right-4 text-xs opacity-50">
            FOG animation unavailable
          </div>
        )}
      </div>
    </>
  );
};

export default VantaFog;
