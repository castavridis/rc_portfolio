import React from 'react'
import './styles.css'

export default function CalderLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="bg-calder-beige">
      { children }
    </div>
  )
}