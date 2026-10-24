'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * ThemeProvider wrapper component.
 * Used to enable dark/light/system theme toggling across the Next.js App Router.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
