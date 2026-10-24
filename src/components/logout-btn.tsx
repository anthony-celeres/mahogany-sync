'use client'

import { useState } from 'react'
import { signOutAction } from '@/app/auth/actions'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOutAction()
    } catch (err) {
      console.error('Sign-Out Error:', err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
      )}
      <span>{loading ? 'Signing out...' : 'Sign out'}</span>
    </button>
  )
}
