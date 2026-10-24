// src/app/layout.tsx
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Single type family across the whole app: Montserrat for both body and
// headings, giving the UI a clean, geometric, sharp-edged feel.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "mahogany-sync — MMH Dormitory Management",
  description: "Mahogany Men's Hall (MMH) Dormitory Management System prototype styled with Montserrat and the official mahogany-sync identity.",
  icons: {
    icon: [
      { url: "/mahogany_sync-header.svg", type: "image/svg+xml" },
      { url: "/mahogany_sync-header.png", type: "image/png" },
    ],
    shortcut: "/mahogany_sync-header.png",
    apple: "/mahogany_sync-header.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-[#120e0d] text-black dark:text-neutral-100 transition-colors duration-150">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
