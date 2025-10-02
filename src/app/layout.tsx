
import React from 'react'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className="container mx-auto py-12">
        { children }
      </body>
    </html>
  )
}