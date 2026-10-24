'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * ThemeToggle component.
 * Allows users to choose between Light, Dark, or System themes.
 * Designed to look clean, minimalist, and prevents client-side hydration mismatches.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder to match the layout dimensions while loading
    return (
      <div className="w-[106px] h-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 rounded-lg p-0.5 select-none">
      <button
        onClick={() => setTheme('light')}
        aria-label="Switch to Light Theme"
        title="Light Mode"
        className={`p-1.5 rounded-md transition-all duration-150 ${
          theme === 'light'
            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-700/60'
            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 border border-transparent'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
      <button
        onClick={() => setTheme('dark')}
        aria-label="Switch to Dark Theme"
        title="Dark Mode"
        className={`p-1.5 rounded-md transition-all duration-150 ${
          theme === 'dark'
            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-700/60'
            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 border border-transparent'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <button
        onClick={() => setTheme('system')}
        aria-label="Switch to System Theme"
        title="System Mode"
        className={`p-1.5 rounded-md transition-all duration-150 ${
          theme === 'system'
            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-700/60'
            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 border border-transparent'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </button>
    </div>
  )
}
