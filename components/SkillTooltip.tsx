import React, { useState } from 'react'
import { SkillTooltipProps } from '@/types/interfaces';

export default function SkillTooltip({
  skill,
  description,
  level = 'intermediate',
  yearsOfExperience,
  children
}: SkillTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getLevelColor = () => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'advanced':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelBadge = () => {
    const levelColors = {
      beginner: 'bg-yellow-500',
      intermediate: 'bg-blue-500',
      advanced: 'bg-green-500',
      expert: 'bg-purple-500'
    }

    return (
      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${levelColors[level]}`} />
    )
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <span className={`skill-tag cursor-help ${getLevelColor()}`}>
          {getLevelBadge()}
          {skill}
        </span>
      )}
      
      {isVisible && (description || yearsOfExperience) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 shadow-lg max-w-xs">
            <div className="font-semibold mb-1">{skill}</div>
            {description && (
              <div className="text-gray-300 mb-1">{description}</div>
            )}
            {yearsOfExperience && (
              <div className="text-gray-400 text-xs">
                {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} experience
              </div>
            )}
            <div className="text-gray-400 text-xs capitalize">{level} level</div>
            
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
