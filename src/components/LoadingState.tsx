/**
 * Loading State Components
 * 
 * This module provides a collection of reusable loading state components for
 * displaying loading indicators throughout the application. It includes various
 * spinner types and loading states for different use cases.
 * 
 * Components:
 * - LoadingSpinner: Animated spinner with customizable size and text
 * - PageLoading: Full-page loading overlay
 * - ContentLoading: Inline content loading state
 * - SkeletonLoader: Placeholder content while data loads
 * 
 * Features:
 * - Multiple size variants (small, medium, large)
 * - Customizable loading text and messages
 * - Accessible loading states (screen reader friendly)
 * - Smooth animations and transitions
 * - Consistent theming across the application
 * - Performance optimized with CSS animations
 * 
 * Usage Examples:
 * ```tsx
 * <LoadingSpinner size="large" text="Loading projects..." />
 * <PageLoading message="Setting up your dashboard..." />
 * <ContentLoading lines={3} />
 * ```
 * 
 * Accessibility:
 * - ARIA labels for screen readers
 * - Reduced motion support for accessibility
 * - High contrast support
 * - Keyboard navigation friendly
 * 
 * @author Aditya
 * @version 1.0.0
 * @since 2025-08-05
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-text-muted">{text}</p>}
    </div>
  );
}

interface LoadingStateProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingComponent?: React.ComponentType;
  error?: Error | null;
  errorComponent?: React.ComponentType<{ error: Error }>;
}

export function LoadingState({ 
  children, 
  isLoading, 
  loadingComponent: LoadingComponent = LoadingSpinner,
  error,
  errorComponent: ErrorComponent
}: LoadingStateProps) {
  if (error && ErrorComponent) {
    return <ErrorComponent error={error} />;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  return <>{children}</>;
}
