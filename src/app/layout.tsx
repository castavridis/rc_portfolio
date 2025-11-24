"use client"

import React from 'react'
import '../styles/globals.css'
import { usePathname } from 'next/navigation'

class TestClass {
  variable = 0
  constructor () {} 
}

// Keep this as unopinionated to allow directories to have unique styles
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const pathname = usePathname()
  let bodyClasses = ""
  if (pathname.indexOf('sandy') > 0) {
    bodyClasses += " bg-calder-beige"
  }
  return (
    <html lang="en">
      <body>
        {/* Main layout */}
        <div className={bodyClasses}>
          <header className="container mx-auto py-3 text-xl">
            C Stavridis
          </header>
          { children }
        </div>
      </body>
    </html>
  )
}