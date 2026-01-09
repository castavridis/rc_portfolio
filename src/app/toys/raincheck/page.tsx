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

  useEffect(() => {
    const seal = document.querySelector('.seal')
    if (!seal) return

    const text = seal.textContent || ''
    seal.innerHTML = ''

    const chars = text.split('')
    const radius = 50
    const angleStep = 360 / chars.length

    chars.forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.position = 'absolute'
      span.style.left = '50%'
      span.style.top = '50%'
      span.style.transformOrigin = '0 0'
      span.style.transform = `rotate(${i * angleStep}deg) translateY(-${radius}px)`
      seal.appendChild(span)
    })
  }, [])

  return (
    <div>    
      <h1 className="text-7xl">Raincheck</h1>     
      <p className="text-2xl mb-4">
        For when you need to take a raincheck with someone you care about and you want to show them they're important to you.
      </p>
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="font-bold">Inspiration</p>
          <img className="w-full max-w-full h-auto" src="https://d2w9rnfcy7mm78.cloudfront.net/42513465/original_6d9beb4bfa401743160eabcf9ffa095d.jpg?1767979735?bc=0" alt="Travis Purrington's US banknote proposal with how data transfers over" />
          <div className="flex w-full">
            <img className="block max-w-full h-auto w-[50%]" src="https://d2w9rnfcy7mm78.cloudfront.net/42512657/original_70dfab1b7433133f16aea20466b4e304.jpg?1767978056?bc=0" alt="Australian 50 dollar banknote" />
            <img className="block max-w-full h-auto w-[50%]" src="https://d2w9rnfcy7mm78.cloudfront.net/42512590/original_ee1964b32ae75272a47a2d8f0d52eb4b.jpg?1767977978?bc=0" alt="Swiss 50 franc note" />
          </div>
        </div>
        <div className="basis-full"></div>
        <div className="w-[45%]"> 
          <p>
            <strong>
              Features
            </strong>
          </p>
          <ul className="list-disc pl-4">
            <li className="font-bold">Sender</li>
            <ul className="list-disc pl-4">
              <li>Form</li>
              <li>Save raincheck</li>
              <li>Send raincheck</li>
            </ul>
            <li className="font-bold">Recipient</li>
            <ul className="list-disc pl-4">
              <li>
                <a href="https://add-to-calendar-button.com/examples" className="underline text-blue-700">
                  Add to Calendar Button
                </a>
              </li>
              <li>PWA notifications for Accept/Reject</li>
            </ul>
            <li className="font-bold">Handle the following data:</li>
            <ul className="list-disc pl-4">
              <li className="font-bold">Core Data</li>
              <ul className="list-disc pl-4">
                <li>To</li>
                <li>From</li>
                <li>Event name</li>
                <li>Message</li>
                <li>Category/Reason (sick, weather, etc.) - create different base check designs</li>
                <li>Cancellation severity - (no biggie, easy to reschedule &gt; big deal = coin, once-in-a-lifetime event = placquard)</li>
              </ul>
              <li className="font-bold">Original Date – Used for security printing effects</li>
              <ul className="list-disc pl-4">
                <li>Location – Lat, Long down to seconds?</li>
                <li>Datetime – UNIX time</li>
              </ul>
              <li className="font-bold">Proposed Data - Displayed in a human-readable format</li>
              <ul className="list-disc pl-4">
                <li>Location</li>
                <li>Date</li>
                <li>Time</li>
              </ul>
              <li className="font-bold">Raincheck Metadata</li>
              <ul className="list-disc pl-4">
                <li>Date issued (e.g. created)</li>
                <li>Location issued from</li>
                <li>Time</li>
              </ul>
            </ul>
          </ul>

          <p className="font-bold mt-4">Ideas from converation with Evan Gedrich Pintado</p>
          <ul className="list-disc pl-4">
            <li>certainty of specific future thing, day and time offered (required) not having to make plan again</li>
            <li>put forward options for user</li>
            <li>different kinds of "certificates" based</li>
            <li>ticket form is based on how severe the issue is (coin = not a big deal) – (tapestry = big deal issue) </li>
          </ul>
        </div>
        <div className="w-[45%]"> 
          <h2 className="font-bold">Sample Raincheck</h2>
          <div className="rainbow-roll w-80 h-60 rounded-sm">
            <div className="m-4 absolute top-2 left-2 right-2 bottom-2 bg-white shadow-sm text-black rounded-sm">
              <p>To: April Grieman</p>
              <p>From: C Stavridis</p>
              <div className="hologram"></div>
              <div className="seal font-mono">OFFICIAL&nbsp;RAINCHECK&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
