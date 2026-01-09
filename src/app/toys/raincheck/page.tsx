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
      ;(element as HTMLElement).style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`
      //
      ;(element as HTMLElement).style.setProperty('--reflection-x', `${percentX}%`)
      ;(element as HTMLElement).style.setProperty('--reflection-y', `${percentY}%`)
    }

    const handleMouseLeave = () => {
      ;(element as HTMLElement).style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
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

  useEffect(() => {
    const guilloche = document.querySelector('.guilloche')
    if (!guilloche) return

    const width = 320
    const height = 240
    const border = 12

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const createWavePath = (offset: number, amplitude: number, frequency: number, isHorizontal: boolean, position: number) => {
      let path = ''
      if (isHorizontal) {
        for (let i = 0; i <= width; i += 2) {
          const y = position + Math.sin((i + offset) * frequency) * amplitude
          path += `${i === 0 ? 'M' : 'L'} ${i} ${y} `
        }
      } else {
        for (let i = 0; i <= height; i += 2) {
          const x = position + Math.sin((i + offset) * frequency) * amplitude
          path += `${i === 0 ? 'M' : 'L'} ${x} ${i} `
        }
      }
      return path
    }

    for (let i = 0; i < 3; i++) {
      const pathTop = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathTop.setAttribute('d', createWavePath(i * 20, 3, 0.1, true, border + i * 2))
      pathTop.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathTop.setAttribute('stroke-width', '0.5')
      pathTop.setAttribute('fill', 'none')
      svg.appendChild(pathTop)

      const pathBottom = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathBottom.setAttribute('d', createWavePath(i * 20, 3, 0.1, true, height - border - i * 2))
      pathBottom.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathBottom.setAttribute('stroke-width', '0.5')
      pathBottom.setAttribute('fill', 'none')
      svg.appendChild(pathBottom)

      const pathLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathLeft.setAttribute('d', createWavePath(i * 20, 3, 0.1, false, border + i * 2))
      pathLeft.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathLeft.setAttribute('stroke-width', '0.5')
      pathLeft.setAttribute('fill', 'none')
      svg.appendChild(pathLeft)

      const pathRight = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathRight.setAttribute('d', createWavePath(i * 20, 3, 0.1, false, width - border - i * 2))
      pathRight.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathRight.setAttribute('stroke-width', '0.5')
      pathRight.setAttribute('fill', 'none')
      svg.appendChild(pathRight)
    }

    guilloche.appendChild(svg)
  }, [])

  return (
    <div>    
      <h1 className="text-7xl">Raincheck</h1>     
      <p className="text-2xl mb-4">
        For when you need to send a raincheck to someone important to you.
      </p>
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="font-bold">Design Reference</p>
          <div className="flex w-full">
              <img className="w-[75%] max-w-full h-auto" src="https://d2w9rnfcy7mm78.cloudfront.net/42513465/original_6d9beb4bfa401743160eabcf9ffa095d.jpg?1767979735?bc=0" alt="Travis Purrington's US banknote proposal with how data transfers over" />
              <img className="w-[25%] max-w-full h-auto" src="http://www.couponingtodisney.com/wp-content/uploads/2011/06/Rainchecks.jpg" alt="Three filled out rain checks from CVS, Walgreens, and Publix." />
          </div>
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
        </div>
        <div className="w-[45%]">
          <p className="font-bold mt-4">Ideas from converation with Evan Gedrich Pintado</p>
          <ul className="list-disc pl-4">
            <li>certainty of specific future thing, day and time offered (required) not having to make plan again</li>
            <li>put forward options for user</li>
            <li>different kinds of "certificates" based</li>
            <li>ticket form is based on how severe the issue is (coin = not a big deal) – (tapestry = big deal issue) </li>
          </ul>
        </div>
        <div className="w-full"> 
          <h2 className="font-bold">Sample Raincheck</h2>
          <div className="w-full p-12 bg-blue-950 flex items-center justify-center">
            <div className="w-full text-white">
              <p>Raincheck issued to April Greiman.</p>
              <p>Graciously Accept</p>
              <p>Politely Decline</p>
            </div>
            <div className="flex w-full relative">
              <div className="rainbow-roll w-80 h-60 rounded-sm">
                <div className="guilloche"></div>
                <div className="m-4 absolute top-2 left-2 right-2 bottom-2 bg-white shadow-sm text-black rounded-sm">
                  <p>Issued by<br/>C Stavridis</p>
                  {/* <div className="hologram"></div> */}
                  {/* <div className="seal font-mono">OFFICIAL&nbsp;RAINCHECK&nbsp;</div> */}
                </div>
              </div>
              <div className="note bg-amber-50 w-40 h-30 absolute top-[50%] -translate-y-[50%] -right-5 -translate-x-[50%] p-4">
                Custom Note
              </div>
            </div>
          </div>
        </div>
        <div className="basis-full"></div>
        <div className="w-[45%]">
          <h2>Claude Code Generated Elements</h2>
          // TBD: seal, hologram, guilloche, rainbow-roll hover
        </div>
      </div>
    </div>
  )
}
