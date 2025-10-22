import React from 'react'
import '../../../styles/globals.css'

export default function CreativeCodingLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="w-full h-full">
      { children }
    </div>
  )
}