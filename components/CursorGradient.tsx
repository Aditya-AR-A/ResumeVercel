"use client";

import { useEffect, useRef } from 'react';

interface CursorGradientProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const CursorGradient: React.FC<CursorGradientProps> = ({ 
  className = "", 
  colors = {
    primary: 'rgba(99,102,241,0.3)',
    secondary: 'rgba(147,51,234,0.1)'
  }
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const gradient = gradientRef.current;
      if (!gradient) return;

      // Use exact coordinates like in the CodePen
      gradient.style.backgroundImage = `radial-gradient(at ${event.clientX}px ${event.clientY}px, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 70%)`;
    };

    // Only add mousemove listener if not on touch device
    if (!('ontouchstart' in window)) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [colors]);

  return (
    <div
      ref={gradientRef}
      className={`fixed inset-0 pointer-events-none transition-all duration-300 ease-out ${className}`}
      style={{
        backgroundImage: `radial-gradient(at 50% 50%, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 70%)`,
        zIndex: 1
      }}
    />
  );
};

export default CursorGradient;
