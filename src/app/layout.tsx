"use client"

import React from 'react'
import '../styles/globals.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
  let bodyClasses = "h-full"
  if (pathname.indexOf('sandy') > 0) {
    bodyClasses += " bg-calder-beige"
  }
  return (
    <html lang="en">
      <head>
        <script src="http://localhost:8097"></script>
      </head>
      <body>
        {/* Main layout */}
        <div className={bodyClasses}>
          <header className="text-xl flex py-8 justify-between container mx-auto">
            <div>
              <Link href="/">C Stavridis</Link>
            </div>
            <div className="flex gap-4">
              <Link className="underline" href="#">Work</Link>
              <Link className="underline" href="#">About</Link>
            </div>
          </header>
          { children }
        </div>
      </body>
    </html>
  )
}