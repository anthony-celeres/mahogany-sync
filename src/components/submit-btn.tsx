'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel: string
}

/**
 * SubmitButton component.
 * Uses the React 19 'useFormStatus' hook to automatically reflect the pending
 * state of the enclosing form during Server Action execution.
 */
export function SubmitButton({ label, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black font-bold text-xs sm:text-sm rounded-lg shadow-sm border border-neutral-300 dark:border-transparent transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && (
        <svg className="w-3.5 h-3.5 animate-spin text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  )
}
