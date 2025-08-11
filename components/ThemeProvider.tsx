'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark' // The actual theme being applied
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Function to get system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Function to apply theme
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    
    let themeToApply: 'light' | 'dark'
    
    if (newTheme === 'system') {
      themeToApply = getSystemTheme()
    } else {
      themeToApply = newTheme
    }

    // Update DOM
    root.classList.remove('light', 'dark')
    root.classList.add(themeToApply)
    
    // Update state
    setActualTheme(themeToApply)
    
    // Store preference
    localStorage.setItem('theme', newTheme)
  }

  // Initialize theme
  useEffect(() => {
    // Get stored theme or default to system
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme || 'system'
    
    setTheme(initialTheme)
    applyTheme(initialTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setActualTheme(getSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    theme,
    setTheme,
    actualTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
