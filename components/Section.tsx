import React from 'react'
import { SectionProps } from '@/types/interfaces';

export default function Section({
  id,
  className = '',
  children,
  containerClassName = '',
  background = 'default'
}: SectionProps) {
  const getBackgroundClasses = () => {
    switch (background) {
      case 'gray':
        return 'bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm'
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm'
      default:
        return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
    }
  }

  return (
    <section
      id={id}
      className={`${getBackgroundClasses()} ${className}`}
    >
      <div className={`container mx-auto px-4 ${containerClassName}`}>
        {children}
      </div>
    </section>
  )
}
