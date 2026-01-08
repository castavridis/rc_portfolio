'use client'

import './styles.css'
import { useEffect } from 'react'

export default function RainCheckPage () {
  useEffect(() => {
    const element = document.querySelector('.rainbow-roll')
    if (!element) return

    // Placing function within useEffect means that these are instatiated once per component, on mount
    const handleMouseMove = (e: MouseEvent) => {
      
      // DOMRect - "the smallest rectangle which contains the entire element"
      const rect = element.getBoundingClientRect() 
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / centerY * -10
      const rotateY = (x - centerX) / centerX * 10
      const translateZ = 20

      ;(element as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`
    }

    const handleMouseLeave = () => {
      ;(element as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }

    element.addEventListener('mousemove', handleMouseMove as EventListener)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div>
      Rain Check
      <div className="rainbow-roll w-80 h-60 rounded-sm">
        <div className="p-4">
          Hello.
        </div>
      </div>
    </div>
  )
}