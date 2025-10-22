
import React from 'react'
import '../../styles/globals.css'

export default function ToyLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="container py-12 mx-auto">
      { children }
    </div>
  )
}