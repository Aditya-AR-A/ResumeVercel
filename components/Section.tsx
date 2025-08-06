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
        return 'bg-gray-50 dark:bg-gray-900'
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'
      default:
        return 'bg-white dark:bg-gray-800'
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
