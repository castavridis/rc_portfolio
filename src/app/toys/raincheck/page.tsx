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

      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100

      // the semicolon at the beginning of ;(element as HTMLElement) is a defensive semicolon
      ;(element as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`
      //
      ;(element as HTMLElement).style.setProperty('--reflection-x', `${percentX}%`)
      ;(element as HTMLElement).style.setProperty('--reflection-y', `${percentY}%`)
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
      <div>
        <p>
          Raincheck is a toy that helps you send a beautiful invitation when you need to take a rain check with a friend.
        </p>
        <p>
          <strong>
            Features
          </strong>
          <ul>
            <li>Add to Calendar Button: https://add-to-calendar-button.com/examples</li>
            <li>Add form with the following fields:</li>
            <ul>
              <li>To</li>
              <li>From</li>
              <li>Title</li>
              <li>Message</li>
              <li>Category/Reason (sick, weather, etc.)</li>
              <li>Location</li>
              <li>Date</li>
              <li>Time</li>
            </ul>
          </ul>
        </p>
      </div>
      <div className="rainbow-roll w-80 h-60 rounded-sm">
        <div className="p-4">
          {/* FORM HERE */}
        </div>
      </div>
    </div>
  )
}

/**
 * 



certainty of specific future thing, day and time offered (required) not having to make plan again



put forward options for user



ticket based on how severe the issue is (coin = not a big deal) – (tapestry = big deal issue) 


 * 
 */